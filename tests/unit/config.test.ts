import { appConfig, CREDENTIALS } from '../../src/config'
describe('Config', () => {
    it('receives process.env values', () => {
        expect(appConfig).toEqual({
            accessTokenSecret: "access token secret",
            appToken: "app token",
            dbUrl: "db url",
            nodeEnv: "test",
            origin: "*",
            port: "3000",
            refreshTokenSecret: "refresh token secret",
        })

        expect(CREDENTIALS).toEqual(false)
    })

})