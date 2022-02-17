import * as mockingoose from 'mockingoose';
import { UsersMapper } from '../../../src/mappers';
import { User } from '../../../src/models'
import mongoose from 'mongoose'
import * as getAll from '../../../src/utils/database'

describe('User mapper class', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });
    it('getUsers gets all users from db', async () => {
        mockingoose(User).toReturn([
            {
                id: '2',
                name: 'test',
                email: 't@t.com',
                role: 'A'
            },
            {
                id: '1',
                name: 'test2',
                email: 't@t.com',
                role: 'A'
            }
        ], 'find');

        const user = await UsersMapper.getUsers()
        expect(user[0].name).toEqual('test')
        expect(user[1].name).toEqual('test2')
    })

    it('getUser gets a users from db', async () => {
        mockingoose(User).toReturn(
            {
                id: '2',
                name: 'test',
                email: 't@t.com',
                role: 'A'
            }, 'findOne');

        const user = await UsersMapper.getUser({ _id: 2 })
        expect(user?.name).toEqual('test')
    })
    it('createUser updates a new user', async () => {
        mockingoose(User).toReturn(
            {
                id: '2',
                name: 'test update',
                email: 't@t.com',
                role: 'A'
            }, 'findOneAndUpdate');

        const user = await UsersMapper.updateUser({ _id: 2 }, { email: 't@t.com', name: "test update", role: 'A' })
        expect(user?.name).toEqual('test update')
    })
    it('deleteUser deletes a new user', async () => {
        mockingoose(User).toReturn(
            {
                id: '2',
                name: 'test',
                email: 't@t.com',
                role: 'A'
            }, 'findOneAndDelete');

        const user = await UsersMapper.deleteUser({ _id: 2 })
        expect(user).toEqual('Succesfully Deleted.')
    })
})