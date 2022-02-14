import { verify } from 'jsonwebtoken';
import { appConfig } from '../config';

const validateAccessToken = (token: string) => {
  try {
    return verify(token, appConfig.accessTokenSecret);
  } catch {
    return null;
  }
}

const validateRefreshToken = (token: string) => {
  try {
    return verify(token, appConfig.refreshTokenSecret);
  } catch {
    return null;
  }
}

export { validateAccessToken, validateRefreshToken }