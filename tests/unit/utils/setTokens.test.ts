import { sign } from 'jsonwebtoken';
import setTokens from '../../../src/utils/setTokens'
import { appConfig } from '../../../src/config'

const sevenDays = 60 * 60 * 24 * 7 * 1000;
const fifteenMins = 60 * 15 * 1000;

describe('setTokens', () => {
    it('correctly sets user tokens', () => {
        const signesAccessToken = sign(
            {
                user: {
                    email: 'test@test.com',
                    role: 'A'
                }
            },
            appConfig.accessTokenSecret,
            {
                expiresIn: fifteenMins
            }
        )
        const signesRefreshToken = sign(
            {
                user: {
                    email: 'test@test.com',
                    count: 0,
                    role: 'A'
                }
            },
            appConfig.refreshTokenSecret,
            {
                expiresIn: sevenDays
            }
        )
        const { accessToken, refreshToken } = setTokens({ email: 'test@test.com', role: 'A', tokenCount: 0 })
        expect(accessToken).toEqual(signesAccessToken)
        expect(refreshToken).toEqual(signesRefreshToken)
    })
})