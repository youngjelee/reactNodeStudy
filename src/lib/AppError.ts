type ErrorName =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnknownError'
  | 'UnAuthorizedError'

interface ErrorInfo {
  //   name: string
  statusCode: number
  message: string
}

interface ErrorPayloads {
  UserExistsError: undefined
  AuthenticationError: undefined
  UnknownError: undefined
  UnAuthorizedError: {
    isExpiredToken: boolean
  }
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
  UnAuthorizedError: {
    statusCode: 401,
    message: 'UnAuthorizedError',
  },
}

export class AppError extends Error {
  public statusCode: number

  constructor(name: ErrorName, public payload?: ErrorPayloads[ErrorName]) {
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

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function createAppErrorSchema<T, S>(example: T, payloadSchema?: S) {
  return {
    type: 'object',
    properties: {
      ...appErrorSchema.properties,
      ...(payloadSchema ? { payload: payloadSchema } : {}),
    },
    example,
  }
}
