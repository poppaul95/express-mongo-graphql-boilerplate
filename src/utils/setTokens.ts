import { sign } from 'jsonwebtoken';
import { appConfig } from '../config';

const setTokens = (user) => {
  const sevenDays = 60 * 60 * 24 * 7 * 1000;
  const fifteenMins = 60 * 15 * 1000;
  const accessUser = {
    email: user.email,
    role: user.role
  };
  const accessToken = sign(
    { user: accessUser },
    appConfig.accessTokenSecret,
    {
      expiresIn: fifteenMins
    }
  );
  const refreshUser = {
    email: user.email,
    count: user.tokenCount,
    role: user.role
  };
  const refreshToken = sign(
    { user: refreshUser },
    appConfig.refreshTokenSecret,
    {
      expiresIn: sevenDays
    }
  );

  return { accessToken, refreshToken };
}

export default setTokens;