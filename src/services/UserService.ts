import { AuthBody } from '../api/auth/types.js'
import bcrypt from 'bcrypt'
import db from '../lib/db.js'
import { Exception } from 'sass'
import { AppError } from '../lib/AppError.js'
import { generateToken } from '../lib/tokens.js'

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

  async generateTokens(userId: number, username: string) {
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

  login() {
    return 'login'
  }

  async register({ username, password }: AuthBody) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })
    console.log(exists)
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

    const tokens = await this.generateTokens(user.id, username)

    return { tokens, user }
  }

  // constructor(){}
}
export default UserService
