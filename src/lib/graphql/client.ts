import { GraphQLClient } from 'graphql-request';

// Initialize GraphQL client for WooCommerce
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://your-site.com/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client with session token (for authenticated requests)
export const getAuthenticatedClient = (sessionToken?: string) => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(sessionToken && { 'woocommerce-session': `Session ${sessionToken}` }),
    },
  });
};
