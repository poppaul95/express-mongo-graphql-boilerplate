import Role, { IRole } from '@models/Role';
import _ from 'lodash';
import { hasAdminAccess, hasUserAccess } from '../utils/verifyAccess';
import { CustomError, ErrorTypes } from '@utils/errors'

const roleResolver = {
    Query: {
        getRoles: (parent, args, { req }) => {
            hasUserAccess(req.user);
            return Role.find({});
        },
        getRole: (parent, args, { req }) => {
            hasUserAccess(req.user);
            return Role.findOne({ email: args.email });
        }
    },
    Mutation: {
        addRole: async (parent, args, { req }) => {
            try {
                hasAdminAccess(req.user);

                const newRole: IRole = new Role(args);

                const role = await Role.create(newRole);

                return role;
            } catch (error) {
                throw new CustomError('Could not add role', ErrorTypes.internalError);
            }
        }
    }
};

export default roleResolver;
