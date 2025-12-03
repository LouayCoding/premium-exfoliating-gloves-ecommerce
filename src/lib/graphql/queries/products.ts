import { gql } from 'graphql-request';

/**
 * Query for product with bundle information
 * This assumes you have WPGraphQL for WooCommerce Product Bundles installed
 */
export const GET_PRODUCT_WITH_BUNDLES = gql`
  query GetProduct($id: ID!, $slug: String) {
    product(id: $id, idType: SLUG) {
      ... on SimpleProduct {
        id
        databaseId
        name
        slug
        description
        shortDescription
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        stockQuantity
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
      }
      ... on BundleProduct {
        id
        databaseId
        name
        slug
        description
        shortDescription
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        image {
          sourceUrl
          altText
        }
        bundledItems {
          bundledItemId
          productId
          quantity
          discount
          product {
            ... on SimpleProduct {
              id
              name
              price
              image {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Query for all products (for static generation)
 */
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int = 100) {
    products(first: $first, where: { status: "publish" }) {
      nodes {
        id
        databaseId
        slug
        name
        ... on SimpleProduct {
          price
        }
      }
    }
  }
`;

/**
 * Query for real-time product data (stock, price)
 */
export const GET_PRODUCT_LIVE_DATA = gql`
  query GetProductLiveData($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      ... on SimpleProduct {
        id
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        stockQuantity
      }
      ... on BundleProduct {
        id
        price
        regularPrice
        salePrice
        onSale
        stockStatus
      }
    }
  }
`;
