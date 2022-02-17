import { UsersMapper } from '../../../src/mappers';
import { gql } from 'apollo-server-core';
import { createTestClient, ApolloServerTestClient } from '../../base';
import * as setToken from '../../../src/utils/setTokens';

describe('User mapper class', () => {
    let testServer: ApolloServerTestClient;
    beforeAll(async () => {
        testServer = await createTestClient();
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
    it('gets all users', async () => {
        const query = gql`
        {
            getUsers {
              email
              name
              id
              role
            }
        }
        `;

        jest.spyOn(UsersMapper, 'getUsers').mockReturnValue(Promise.resolve([{
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        }, {
            id: 2,
            name: 'test name2',
            email: 'test2@test.com',
            role: 'E'
        }]))

        const result = await testServer.query({ query });
        expect(result.errors).toBeUndefined();
        expect(result.data?.getUsers).toEqual([{
            id: '1',
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        }, {
            id: '2',
            name: 'test name2',
            email: 'test2@test.com',
            role: 'E'
        }]);
    })

    it('gets a user by id', async () => {
        const query = gql`
        {
            getUser(id: "1") {
              email
              name
              id
              role
            }
        }
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        }))

        const result = await testServer.query({ query });
        expect(result.errors).toBeUndefined();
        expect(result.data?.getUser).toEqual({
            id: '1',
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        });
    })

    it('signs-up a user', async () => {
        const mutation = gql`
            mutation {
                signup(name: "test", email: "test@testss.com",password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve(null))

        //@ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'createUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        }))

        jest.spyOn(setToken, 'default').mockReturnValue({
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        })

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toBeUndefined();
        expect(result.data?.signup).toEqual({
            id: '1',
            email: 'test@test.com',
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        });
    })
    it('logins a user', async () => {
        const mutation = gql`
            mutation {
                login(email: "test@test.com",password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A',
            verifyPassword: jest.fn
        }))


        jest.spyOn(setToken, 'default').mockReturnValue({
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        })

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toBeUndefined();
        expect(result.data?.login).toEqual({
            id: '1',
            email: 'test@test.com',
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        });
    })
    it('edits a user', async () => {
        const mutation = gql`
            mutation {
                editUser(id: "1", data: {
                    name: "test2"
                }) {
              email
              id
              name
              role
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'updateUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A',
        }))



        const result = await testServer.mutate({ mutation });
        expect(result.errors).toBeUndefined();
        expect(result.data?.editUser).toEqual({
            id: '1',
            name: 'test name',
            email: 'test@test.com',
            role: 'A',
        });
    })
    it('delets a user', async () => {
        const mutation = gql`
            mutation {
                deleteUser(id: "1",) }
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'deleteUser').mockReturnValue(Promise.resolve([]))



        const result = await testServer.mutate({ mutation });
        expect(result.errors).toBeUndefined();
        expect(result.data?.deleteUser).toEqual("Succesfully deleted.");
    })
    it('throws email duplicate error', async () => {
        const mutation = gql`
            mutation {
                signup(name: "test", email: "test@test.com", password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A'
        }))

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "DUPLICATE_EMAIL"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Email already esists",
            path: ["signup"]
        }]);
        expect(result.data?.signup).toEqual(null);
    })
    it('throws email invalid error', async () => {
        const mutation = gql`
            mutation {
                signup(name: "test", email: "test", password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "INVALID_USERNAME_PASSWORD"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Invalid email address",
            path: ["signup"]
        }]);
        expect(result.data?.signup).toEqual(null);
    })
    it('thros not registered error', async () => {
        const mutation = gql`
            mutation {
                login(email: "test@test.com",password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve(null))

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "INVALID_USERNAME_PASSWORD"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Email not registered",
            path: ["login"]
        }]);
        expect(result.data?.signup).toEqual(undefined);
    })
    it('logins a user', async () => {
        const mutation = gql`
            mutation {
                login(email: "test@test.com",password: "123456") {
              email
              id
              accessToken
              refreshToken
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve({
            id: 1,
            name: 'test name',
            email: 'test@test.com',
            role: 'A',
            verifyPassword: () => false
        }))


        jest.spyOn(setToken, 'default').mockReturnValue({
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        })

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "INVALID_USERNAME_PASSWORD"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Invalid login credentials",
            path: ["login"]
        }]);
        expect(result.data?.signup).toEqual(undefined);
    })

    it('throws user not found on edit', async () => {
        const mutation = gql`
            mutation {
                editUser(id: "1",data: {name: "test name"}) {
              email
              id
              name
              role
            }}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve(null))


        jest.spyOn(setToken, 'default').mockReturnValue({
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        })

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "INTERNAL_SERVER_ERROR"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Could not edit user",
            path: ["editUser"]
        }]);
        expect(result.data?.editUser).toEqual(null);
    })
    it('throws user not found on delete', async () => {
        const mutation = gql`
            mutation {
                deleteUser(id: "1")}
        `;

        // @ts-ignore We do not need all the fields in tests
        jest.spyOn(UsersMapper, 'getUser').mockReturnValue(Promise.resolve(null))


        jest.spyOn(setToken, 'default').mockReturnValue({
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token'
        })

        const result = await testServer.mutate({ mutation });
        expect(result.errors).toEqual([{
            extensions: {
                code: "INTERNAL_SERVER_ERROR"
            },
            locations: [{
                column: 3,
                line: 2
            }],
            message: "Could not delete user",
            path: ["deleteUser"]
        }]);
        expect(result.data?.deleteUser).toEqual(null);
    })
})