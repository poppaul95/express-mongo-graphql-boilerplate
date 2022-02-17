import User, { IUser } from '@models/User';
import { Roles } from '@schemas/role';
import { getAll } from '@/utils/database'
import { CustomError, ErrorTypes } from '@utils/errors'
import { locatedError } from 'graphql';

class UserMapperClass {
    public async getUsers() {
        try {
            console.log('ok1')
            return await getAll(User);

        } catch (error) {
            console.log('ok2')
            throw new CustomError(`${error}`, ErrorTypes.internalError)
        }
    }

    public async getUser(filter) {
        try {
            return this.getData(filter);
        } catch (error) {
            throw new CustomError(`${error}`, ErrorTypes.internalError)
        }
    }

    public async createUser(data) {
        const newUser: IUser = new User(data);
        newUser.password = newUser.hashPassword(data.password);
        newUser.role = Roles.user.type;
        try {
            return User.create(newUser);
        } catch (error) {
            throw new CustomError(`${error}`, ErrorTypes.internalError)
        }
    }

    public async updateUser(query, data) {
        const updatedUser = await User.findOneAndUpdate(query, data, { upsert: true })
        return updatedUser || new CustomError('Could not update the user', ErrorTypes.internalError)
    }

    public async deleteUser(query) {
        const deletedUser = await User.findOneAndDelete(query)
        return deletedUser ? 'Succesfully Deleted.' : new CustomError('Could not update the user', ErrorTypes.internalError)
    }

    private getData(filter) {
        return User.findOne(filter);
    }
}

export const UsersMapper = new UserMapperClass();
