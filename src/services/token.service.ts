import {
  signAccessToken,
  signRefreshToken
} from "../utils/jwt";

export const generateTokens = (user: any) => ({
  accessToken: signAccessToken({
    id: user.id,
    role: user.role
  }),
  refreshToken: signRefreshToken({
    id: user.id
  })
});
