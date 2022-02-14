import { gql } from 'apollo-server-express';

export const types = gql`
    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
`;
