import { User } from '../../../src/models'

describe('UserModel', () => {
    it('verifiy the password', () => {
        const user = new User({
            name: 'test',
            email: "test@test.com"
        })

        user.password = user.hashPassword('password');
        const isValid = user.verifyPassword('password');
        expect(isValid).toBe(true)
    })
})