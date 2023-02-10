import { AuthBody } from '../api/auth/types.js'
import bcrypt from 'bcrypt'
import db from '../lib/db.js'
import { Exception } from 'sass'
import { AppError, isAppError } from '../lib/AppError.js'
import { generateToken } from '../lib/tokens.js'
import { User } from '@prisma/client'

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

  async generateTokens(user: User) {
    const { id: userId, username } = user

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'accessToken',
        userId,
        tokenId: 1,
        username,
      }),
      generateToken({
        type: 'refreshToken',
        tokenId: 1,
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

  // constructor(){}
}
export default UserService
