/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateProduct = /* GraphQL */ `subscription OnCreateProduct(
  $filter: ModelSubscriptionProductFilterInput
  $owner: String
) {
  onCreateProduct(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProductSubscriptionVariables,
  APITypes.OnCreateProductSubscription
>;
export const onUpdateProduct = /* GraphQL */ `subscription OnUpdateProduct(
  $filter: ModelSubscriptionProductFilterInput
  $owner: String
) {
  onUpdateProduct(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProductSubscriptionVariables,
  APITypes.OnUpdateProductSubscription
>;
export const onDeleteProduct = /* GraphQL */ `subscription OnDeleteProduct(
  $filter: ModelSubscriptionProductFilterInput
  $owner: String
) {
  onDeleteProduct(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProductSubscriptionVariables,
  APITypes.OnDeleteProductSubscription
>;
export const onCreateReview = /* GraphQL */ `subscription OnCreateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onCreateReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateReviewSubscriptionVariables,
  APITypes.OnCreateReviewSubscription
>;
export const onUpdateReview = /* GraphQL */ `subscription OnUpdateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onUpdateReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateReviewSubscriptionVariables,
  APITypes.OnUpdateReviewSubscription
>;
export const onDeleteReview = /* GraphQL */ `subscription OnDeleteReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onDeleteReview(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteReviewSubscriptionVariables,
  APITypes.OnDeleteReviewSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onCreateUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onUpdateUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onDeleteUser(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateSession = /* GraphQL */ `subscription OnCreateSession(
  $filter: ModelSubscriptionSessionFilterInput
  $owner: String
) {
  onCreateSession(filter: $filter, owner: $owner) {
    id
    userId
    sessionId
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
    createdAt
    updatedAt
    userSessionsId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateSessionSubscriptionVariables,
  APITypes.OnCreateSessionSubscription
>;
export const onUpdateSession = /* GraphQL */ `subscription OnUpdateSession(
  $filter: ModelSubscriptionSessionFilterInput
  $owner: String
) {
  onUpdateSession(filter: $filter, owner: $owner) {
    id
    userId
    sessionId
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
    createdAt
    updatedAt
    userSessionsId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateSessionSubscriptionVariables,
  APITypes.OnUpdateSessionSubscription
>;
export const onDeleteSession = /* GraphQL */ `subscription OnDeleteSession(
  $filter: ModelSubscriptionSessionFilterInput
  $owner: String
) {
  onDeleteSession(filter: $filter, owner: $owner) {
    id
    userId
    sessionId
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
    createdAt
    updatedAt
    userSessionsId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteSessionSubscriptionVariables,
  APITypes.OnDeleteSessionSubscription
>;
export const onCreateCartItem = /* GraphQL */ `subscription OnCreateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
  onCreateCartItem(filter: $filter) {
    id
    sessionId
    productId
    quantity
    session {
      id
      userId
      sessionId
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
` as GeneratedSubscription<
  APITypes.OnCreateCartItemSubscriptionVariables,
  APITypes.OnCreateCartItemSubscription
>;
export const onUpdateCartItem = /* GraphQL */ `subscription OnUpdateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
  onUpdateCartItem(filter: $filter) {
    id
    sessionId
    productId
    quantity
    session {
      id
      userId
      sessionId
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
` as GeneratedSubscription<
  APITypes.OnUpdateCartItemSubscriptionVariables,
  APITypes.OnUpdateCartItemSubscription
>;
export const onDeleteCartItem = /* GraphQL */ `subscription OnDeleteCartItem($filter: ModelSubscriptionCartItemFilterInput) {
  onDeleteCartItem(filter: $filter) {
    id
    sessionId
    productId
    quantity
    session {
      id
      userId
      sessionId
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
` as GeneratedSubscription<
  APITypes.OnDeleteCartItemSubscriptionVariables,
  APITypes.OnDeleteCartItemSubscription
>;
export const onCreateOrder = /* GraphQL */ `subscription OnCreateOrder(
  $filter: ModelSubscriptionOrderFilterInput
  $owner: String
) {
  onCreateOrder(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateOrderSubscriptionVariables,
  APITypes.OnCreateOrderSubscription
>;
export const onUpdateOrder = /* GraphQL */ `subscription OnUpdateOrder(
  $filter: ModelSubscriptionOrderFilterInput
  $owner: String
) {
  onUpdateOrder(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateOrderSubscriptionVariables,
  APITypes.OnUpdateOrderSubscription
>;
export const onDeleteOrder = /* GraphQL */ `subscription OnDeleteOrder(
  $filter: ModelSubscriptionOrderFilterInput
  $owner: String
) {
  onDeleteOrder(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteOrderSubscriptionVariables,
  APITypes.OnDeleteOrderSubscription
>;
export const onCreateOrderItem = /* GraphQL */ `subscription OnCreateOrderItem(
  $filter: ModelSubscriptionOrderItemFilterInput
  $owner: String
) {
  onCreateOrderItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateOrderItemSubscriptionVariables,
  APITypes.OnCreateOrderItemSubscription
>;
export const onUpdateOrderItem = /* GraphQL */ `subscription OnUpdateOrderItem(
  $filter: ModelSubscriptionOrderItemFilterInput
  $owner: String
) {
  onUpdateOrderItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateOrderItemSubscriptionVariables,
  APITypes.OnUpdateOrderItemSubscription
>;
export const onDeleteOrderItem = /* GraphQL */ `subscription OnDeleteOrderItem(
  $filter: ModelSubscriptionOrderItemFilterInput
  $owner: String
) {
  onDeleteOrderItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteOrderItemSubscriptionVariables,
  APITypes.OnDeleteOrderItemSubscription
>;
