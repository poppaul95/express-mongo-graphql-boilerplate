import { IUser } from '../models/User';
import { isEmpty } from 'lodash';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Roles } from '../schemas/role';

export const hasUserAccess = (user: IUser, appToken?: string) => {
    if (!appToken) {
        if (isEmpty(user)) {
            throw new AuthenticationError('Not Authenticated');
        } else if (
            user.role !== Roles.user.type &&
            user.role !== Roles.editor.type &&
            user.role !== Roles.admin.type
        ) {
            throw new ForbiddenError('Not Authorised');
        }
    }
};

export const hasEditorAccess = (user: IUser, appToken?: string) => {
    if (!appToken) {
        if (isEmpty(user)) {
            throw new AuthenticationError('Not Authenticated');
        } else if (
            user.role !== Roles.editor.type &&
            user.role !== Roles.admin.type
        ) {
            throw new ForbiddenError('Not Authorised');
        }
    }
};

export const hasAdminAccess = (user: IUser, appToken?: string) => {
    if (!appToken) {
        if (isEmpty(user)) {
            throw new AuthenticationError('Not Authenticated');
        } else if (user.role !== Roles.admin.type) {
            throw new ForbiddenError('Not Authorised');
        }
    }
};
