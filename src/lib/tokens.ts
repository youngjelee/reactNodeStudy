import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'DevSecretKey'
export const ACCESS_TOKEN_DURATION = '1h'
export const REFESH_TOKEN_DURATION = '7d'
export const tokenDuration = {
  accessToken: '1h',
  refreshToken: '7d',
}

export interface AccessTokenPayload {
  type: 'accessToken'
  userId: number
  tokenId: number
  username: string
}

export interface RefreshTokenPayload {
  type: 'refreshToken'
  tokenId: number
  rotationCounter: number
}

type TokenPayload = AccessTokenPayload | RefreshTokenPayload

type DecodedToken<T> = {
  iat: number
  exp: number
} & T

if (process.env.JWT_SECRET === undefined) {
  console.warn('JWT_SECRET is not defined in .env file')
}

//토큰을 생성한다.
export function generateToken(payload: TokenPayload) {
  const { type, ...rest } = payload

  return new Promise<string>((res, rej) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: tokenDuration[payload.type],
      },
      (err, token) => {
        if (err || !token) {
          rej(err)
          return
        }
        res(token)
      },
    )
  })
}

export function validateToken<T>(token: string) {
  return new Promise<DecodedToken<T>>((res, rej) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        rej(err)
      }
      res(decoded as DecodedToken<T>)
    })
  })
}
