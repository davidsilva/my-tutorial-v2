/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getProduct = /* GraphQL */ `query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    name
    description
    price
    isArchived
    reviews {
      nextToken
      __typename
    }
    image
    stripePriceId
    stripeProductId
    cartItems {
      nextToken
      __typename
    }
    orderItems {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProductQueryVariables,
  APITypes.GetProductQuery
>;
export const listProducts = /* GraphQL */ `query ListProducts(
  $filter: ModelProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      price
      isArchived
      image
      stripePriceId
      stripeProductId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProductsQueryVariables,
  APITypes.ListProductsQuery
>;
export const getReview = /* GraphQL */ `query GetReview($id: ID!) {
  getReview(id: $id) {
    id
    product {
      id
      name
      description
      price
      isArchived
      image
      stripePriceId
      stripeProductId
      createdAt
      updatedAt
      owner
      __typename
    }
    rating
    content
    isArchived
    user {
      id
      userId
      username
      firstName
      lastName
      isArchived
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    productReviewsId
    userReviewsId
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetReviewQueryVariables, APITypes.GetReviewQuery>;
export const listReviews = /* GraphQL */ `query ListReviews(
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      rating
      content
      isArchived
      createdAt
      updatedAt
      productReviewsId
      userReviewsId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReviewsQueryVariables,
  APITypes.ListReviewsQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    userId
    username
    firstName
    lastName
    isArchived
    reviews {
      nextToken
      __typename
    }
    sessions {
      nextToken
      __typename
    }
    orders {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      username
      firstName
      lastName
      isArchived
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getSession = /* GraphQL */ `query GetSession($id: ID!) {
  getSession(id: $id) {
    id
    userId
    cartItems {
      nextToken
      __typename
    }
    user {
      id
      userId
      username
      firstName
      lastName
      isArchived
      createdAt
      updatedAt
      owner
      __typename
    }
    deletedAt
    createdAt
    updatedAt
    userSessionsId
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSessionQueryVariables,
  APITypes.GetSessionQuery
>;
export const listSessions = /* GraphQL */ `query ListSessions(
  $filter: ModelSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      deletedAt
      createdAt
      updatedAt
      userSessionsId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSessionsQueryVariables,
  APITypes.ListSessionsQuery
>;
export const getCartItem = /* GraphQL */ `query GetCartItem($id: ID!) {
  getCartItem(id: $id) {
    id
    sessionId
    productId
    quantity
    session {
      id
      userId
      deletedAt
      createdAt
      updatedAt
      userSessionsId
      owner
      __typename
    }
    product {
      id
      name
      description
      price
      isArchived
      image
      stripePriceId
      stripeProductId
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    productCartItemsId
    sessionCartItemsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCartItemQueryVariables,
  APITypes.GetCartItemQuery
>;
export const listCartItems = /* GraphQL */ `query ListCartItems(
  $filter: ModelCartItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listCartItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      sessionId
      productId
      quantity
      createdAt
      updatedAt
      productCartItemsId
      sessionCartItemsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCartItemsQueryVariables,
  APITypes.ListCartItemsQuery
>;
export const getOrder = /* GraphQL */ `query GetOrder($id: ID!) {
  getOrder(id: $id) {
    id
    userId
    total
    status
    user {
      id
      userId
      username
      firstName
      lastName
      isArchived
      createdAt
      updatedAt
      owner
      __typename
    }
    items {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    userOrdersId
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetOrderQueryVariables, APITypes.GetOrderQuery>;
export const listOrders = /* GraphQL */ `query ListOrders(
  $filter: ModelOrderFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      total
      status
      createdAt
      updatedAt
      userOrdersId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrdersQueryVariables,
  APITypes.ListOrdersQuery
>;
export const getOrderItem = /* GraphQL */ `query GetOrderItem($id: ID!) {
  getOrderItem(id: $id) {
    id
    orderId
    productId
    quantity
    price
    order {
      id
      userId
      total
      status
      createdAt
      updatedAt
      userOrdersId
      owner
      __typename
    }
    product {
      id
      name
      description
      price
      isArchived
      image
      stripePriceId
      stripeProductId
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    productOrderItemsId
    orderItemsId
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOrderItemQueryVariables,
  APITypes.GetOrderItemQuery
>;
export const listOrderItems = /* GraphQL */ `query ListOrderItems(
  $filter: ModelOrderItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrderItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      orderId
      productId
      quantity
      price
      createdAt
      updatedAt
      productOrderItemsId
      orderItemsId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrderItemsQueryVariables,
  APITypes.ListOrderItemsQuery
>;
