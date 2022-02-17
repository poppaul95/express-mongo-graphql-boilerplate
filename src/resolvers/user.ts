import { AuthenticationError } from 'apollo-server-express';
import setToken from '@utils/setTokens';
import { hasAdminAccess, hasUserAccess } from '@utils/verifyAccess';
import { UsersMapper } from '@mappers/index';
import { CustomError, ErrorTypes } from '@utils/errors'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userResolver = {
    Query: {
        getUsers: async (parent, args, { req }) => {
            hasUserAccess(req.user);
            return UsersMapper.getUsers();
        },
        getUser: (parent, args, { req }) => {
            hasUserAccess(req.user);
            return UsersMapper.getUser({ _id: args.id });
        },
    },
    Mutation: {
        signup: async (parent, args) => {
            const isEmailValid = args.email.toLowerCase().match(EMAIL_REGEX);

            if (!isEmailValid) {
                throw new CustomError('Invalid email address', ErrorTypes.invalidUsernamePassword);
            }

            const checkUniqueUser = await UsersMapper.getUser({
                email: args.email,
            });
            if (checkUniqueUser) {
                throw new CustomError('Email already esists', ErrorTypes.duplicateUsername);
            }
            const user = await UsersMapper.createUser(args);
            const response = setToken(user);
            return { ...response, ...user };
        },
        login: async (parent, args) => {
            const user = await UsersMapper.getUser({ email: args.email });
            if (!user) {
                throw new CustomError('Email not registered', ErrorTypes.invalidUsernamePassword);
            }
            if (!user.verifyPassword(args.password)) {
                throw new CustomError('Invalid login credentials', ErrorTypes.invalidUsernamePassword);
            }
            const response = setToken(user);
            return { ...response, name: user.name, role: user.role, id: user.id, email: user.email };
        },
        editUser: async (parent, args, { req }) => {
            try {
                hasAdminAccess(req.user);
                const user = await UsersMapper.getUser({ _id: args.id });

                if (!user) {
                    throw new CustomError('User not found', ErrorTypes.notFound);
                }

                return UsersMapper.updateUser({ _id: args.id }, args.data);
            } catch (error) {
                throw new CustomError('Could not edit user', ErrorTypes.internalError);
            }
        },
        deleteUser: async (parent, args, { req }) => {
            try {
                hasAdminAccess(req.user);
                const user = await UsersMapper.getUser({ _id: args.id });

                if (!user) {
                    throw new CustomError('User not found', ErrorTypes.notFound);
                }

                UsersMapper.deleteUser({ _id: args.id });
                return 'Succesfully deleted.';
            } catch (error) {
                throw new CustomError('Could not delete user', ErrorTypes.internalError);
            }
        },
    },
};

export default userResolver;
