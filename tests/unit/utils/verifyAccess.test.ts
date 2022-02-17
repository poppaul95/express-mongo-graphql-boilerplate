import { hasAdminAccess, hasEditorAccess, hasUserAccess } from '../../../src/utils/verifyAccess'

describe('verifyAccess', () => {
    it('throws not authenticated error', () => {
        const user = {};
        // @ts-ignore
        expect(() => hasUserAccess(user)).toThrow('Not Authenticated')
        // @ts-ignore
        expect(() => hasEditorAccess(user)).toThrow('Not Authenticated')
        // @ts-ignore
        expect(() => hasAdminAccess(user)).toThrow('Not Authenticated')
    })
    it('throws forbidden error', () => {
        const user = {};
        // @ts-ignore
        expect(() => hasUserAccess({ role: "non existing role" })).toThrow('Not Authorised')
        // @ts-ignore
        expect(() => hasEditorAccess({ role: "U" })).toThrow('Not Authorised')
        // @ts-ignore
        expect(() => hasAdminAccess({ role: 'U' })).toThrow('Not Authorised')
    })
})