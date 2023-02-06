import { AuthBody } from '../api/auth/types.js'
import bcrypt from 'bcrypt'
import db from '../lib/db.js'
import { Exception } from 'sass'
import { AppError } from '../lib/AppError.js'

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
    const user = db.user.create({
      data: {
        username: username,
        passwordHash: hash,
      },
    })
    return user
  }

  // constructor(){}
}
export default UserService
