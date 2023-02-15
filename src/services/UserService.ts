import { AuthBody } from '../api/auth/types.js'
import bcrypt from 'bcrypt'
import db from '../lib/db.js'
import { Exception } from 'sass'
import { AppError, isAppError } from '../lib/AppError.js'
import {
  AccessTokenPayload,
  generateToken,
  RefreshTokenPayload,
  validateToken,
} from '../lib/tokens.js'
import { User } from '@prisma/client'
import App from 'next/app.js'

const saltRounds = 10

// interface AuthParams {
//   username: string
//   password: string
// }

class UserService {
  private static instance: UserService
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async generateTokens(user: User, existingTokenId?: number) {
    const { id: userId, username } = user
    const tokenId =
      existingTokenId ??
      (
        await db.token.create({
          data: {
            userId,
          },
        })
      ).id

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'accessToken',
        userId,
        tokenId,
        username,
      }),
      generateToken({
        type: 'refreshToken',
        tokenId,
        rotationCounter: 1,
      }),
    ])

    return { accessToken, refreshToken }
  }
  //로그인
  async login({ username, password }: AuthBody) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    })
    if (!user) {
      throw new AppError('AuthenticationError')
    }

    try {
      const result = await bcrypt.compareSync(password, user.passwordHash)
      if (!result) {
        throw new AppError('AuthenticationError')
      }
    } catch (e) {
      if (isAppError(e)) {
        throw e
      }
      console.log('e:::::::::::::', e)
      throw new AppError('UnknownError')
    }

    const tokens = await this.generateTokens(user)
    return { user, tokens }
  }

  //등록 토큰과 유저 리턴
  async register({ username, password }: AuthBody) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })
    if (exists) {
      throw new AppError('UserExistsError')
    }

    const hash = await bcrypt.hashSync(password, saltRounds)
    const user = await db.user.create({
      data: {
        username: username,
        passwordHash: hash,
      },
    })

    const tokens = await this.generateTokens(user)

    return { tokens, user }
  }
  //token 을 refresh 하고 return 해준다.
  async refreshToken(token: string) {
    // const decoded = await validateToken<RefreshTokenPayload>(token)
    try {
      const { tokenId } = await validateToken<RefreshTokenPayload>(token)

      const tokenItem = await db.token.findUnique({
        where: {
          id: tokenId,
        },
        include: {
          user: true,
        },
      })

      if (!tokenItem) {
        throw new Error('Token Not Found')
      }

      const tokens = this.generateTokens(tokenItem.user, tokenId)
      return tokens
    } catch (e) {
      throw new AppError('RefreshTokenError')
    }
  }

  // constructor(){}
}
export default UserService
