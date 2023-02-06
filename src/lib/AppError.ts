type ErrorName = 'UserExistsError' | 'AuthenticationError' | 'UnknownError'

interface ErrorInfo {
  //   name: string
  statusCode: number
  message: string
}

const statusCodeMap: Record<ErrorName, ErrorInfo> = {
  UserExistsError: {
    statusCode: 409,
    message: 'User Already Exists',
  },
  AuthenticationError: {
    statusCode: 401,
    message: 'Invalid username or password',
  },
  UnknownError: {
    statusCode: 500,
    message: 'Unknown error',
  },
}

export class AppError extends Error {
  public statusCode: number

  constructor(name: ErrorName) {
    const info = statusCodeMap[name]
    super(info.message)
    this.statusCode = info.statusCode
  }
}

export const appErrorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
  },
}
