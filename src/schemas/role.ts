import { gql } from 'apollo-server-express';

export const Roles = {
    admin: {
        type: 'A',
        name: 'Admin'
    },
    editor: {
        type: 'E',
        name: 'Editor'
    },
    user: {
        type: 'U',
        name: 'User'
    }
};

const role = gql`
    type Role {
        type: String
        name: String
    }
    extend type Query {
        getRoles: [Role]
        getRole(type: String!): Role
    }
    extend type Mutation {
        addRole(type: String!, name: String!): Role
    }
`;

export default role;
