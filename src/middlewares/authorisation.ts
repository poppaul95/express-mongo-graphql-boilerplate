import {
    validateAccessToken,
    validateRefreshToken,
} from '@utils/validateTokens';
import { User } from '@models/index';
import setTokens from '@utils/setTokens';
import { appConfig } from '../config';

const validateTokensMiddleware = async (req, res, next) => {
    const refreshToken = req.headers['x-refresh-token'];
    const accessToken = req.headers['x-access-token'];
    const appToken = req.headers['x-app-token'];

    if (!accessToken && !refreshToken && !appToken) {
        return next();
    }
    if (appToken === appConfig.appToken) {
        return next();
    } else {
        const decodedAccessToken = validateAccessToken(accessToken);

        if (decodedAccessToken && !(decodedAccessToken as any).user) {
            req.user = (decodedAccessToken as any).user;
            return next()
        }

        const decodedRefreshToken = validateRefreshToken(refreshToken);
        if (decodedRefreshToken && (decodedRefreshToken as any).user) {
            // valid refresh token
            const user = await User.findOne({
                email: (decodedRefreshToken as any).user.email,
            });
            // valid user and user token not invalidated
            if (
                !user ||
                user.tokenCount !== (decodedRefreshToken as any).user.count
            ) {
                return next();
            }
            req.user = (decodedRefreshToken as any).user;
            // refresh the tokens
            const userTokens = setTokens(user);
            res.set({
                'Access-Control-Expose-Headers':
                    'x-access-token,x-refresh-token',
                'x-access-token': userTokens.accessToken,
                'x-refresh-token': userTokens.refreshToken,
            });
            return next();
        }
    }
    next();
};

export default validateTokensMiddleware;
