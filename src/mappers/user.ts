import User, { IUser } from '@models/User';
import { Roles } from '@schemas/role';
import { getAll } from '@/utils/database'
import { CustomError, ErrorTypes } from '@utils/errors'

class UserMapperClass {
    public async getUsers() {
        try {
            return await getAll(User);
        } catch (error) {
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
        User.findOneAndUpdate(query, data, { upsert: true }, (error, doc) => {
            if (error) {
                throw new CustomError(`${error}`, ErrorTypes.internalError)
            }
            return 'Succesfully saved.';
        });
    }

    public async deleteUser(query) {
        User.findOneAndDelete(query, (error, doc) => {
            if (error) {
                throw new CustomError(`${error}`, ErrorTypes.internalError)
            }
            return 'Succesfully deleted.';
        });
    }

    private getData(filter) {
        return User.findOne(filter);
    }
}

export const UsersMapper = new UserMapperClass();
