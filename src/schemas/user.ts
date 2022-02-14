import { gql } from 'apollo-server-express';

const user = gql`
    input editUserInput {
        role: String
        name: String
    }
    type AuthResponse {
        id: String
        email: String
        accessToken: String
        refreshToken: String
        name: String
        role: String
    }

    type User {
        id: String
        email: String
        name: String
        password: String
        role: String
        tokenCount: Int
    }

    extend type Query {
        getUsers: [User]
        getUser(id: String!): User
    }
    extend type Mutation {
        signup(email: String!, password: String!, name: String!): AuthResponse
        login(email: String!, password: String!): AuthResponse
        editUser(id: String!, data: editUserInput): String
        deleteUser(id: String!): String
    }
`;

export default user;
