/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const processOrder = /* GraphQL */ `mutation ProcessOrder($input: ProcessOrderInput!) {
  processOrder(input: $input)
}
` as GeneratedMutation<
  APITypes.ProcessOrderMutationVariables,
  APITypes.ProcessOrderMutation
>;
export const createProduct = /* GraphQL */ `mutation CreateProduct(
  $input: CreateProductInput!
  $condition: ModelProductConditionInput
) {
  createProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProductMutationVariables,
  APITypes.CreateProductMutation
>;
export const updateProduct = /* GraphQL */ `mutation UpdateProduct(
  $input: UpdateProductInput!
  $condition: ModelProductConditionInput
) {
  updateProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProductMutationVariables,
  APITypes.UpdateProductMutation
>;
export const deleteProduct = /* GraphQL */ `mutation DeleteProduct(
  $input: DeleteProductInput!
  $condition: ModelProductConditionInput
) {
  deleteProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProductMutationVariables,
  APITypes.DeleteProductMutation
>;
export const createReview = /* GraphQL */ `mutation CreateReview(
  $input: CreateReviewInput!
  $condition: ModelReviewConditionInput
) {
  createReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateReviewMutationVariables,
  APITypes.CreateReviewMutation
>;
export const updateReview = /* GraphQL */ `mutation UpdateReview(
  $input: UpdateReviewInput!
  $condition: ModelReviewConditionInput
) {
  updateReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateReviewMutationVariables,
  APITypes.UpdateReviewMutation
>;
export const deleteReview = /* GraphQL */ `mutation DeleteReview(
  $input: DeleteReviewInput!
  $condition: ModelReviewConditionInput
) {
  deleteReview(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteReviewMutationVariables,
  APITypes.DeleteReviewMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createSession = /* GraphQL */ `mutation CreateSession(
  $input: CreateSessionInput!
  $condition: ModelSessionConditionInput
) {
  createSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSessionMutationVariables,
  APITypes.CreateSessionMutation
>;
export const updateSession = /* GraphQL */ `mutation UpdateSession(
  $input: UpdateSessionInput!
  $condition: ModelSessionConditionInput
) {
  updateSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSessionMutationVariables,
  APITypes.UpdateSessionMutation
>;
export const deleteSession = /* GraphQL */ `mutation DeleteSession(
  $input: DeleteSessionInput!
  $condition: ModelSessionConditionInput
) {
  deleteSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSessionMutationVariables,
  APITypes.DeleteSessionMutation
>;
export const createCartItem = /* GraphQL */ `mutation CreateCartItem(
  $input: CreateCartItemInput!
  $condition: ModelCartItemConditionInput
) {
  createCartItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCartItemMutationVariables,
  APITypes.CreateCartItemMutation
>;
export const updateCartItem = /* GraphQL */ `mutation UpdateCartItem(
  $input: UpdateCartItemInput!
  $condition: ModelCartItemConditionInput
) {
  updateCartItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCartItemMutationVariables,
  APITypes.UpdateCartItemMutation
>;
export const deleteCartItem = /* GraphQL */ `mutation DeleteCartItem(
  $input: DeleteCartItemInput!
  $condition: ModelCartItemConditionInput
) {
  deleteCartItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCartItemMutationVariables,
  APITypes.DeleteCartItemMutation
>;
export const createOrder = /* GraphQL */ `mutation CreateOrder(
  $input: CreateOrderInput!
  $condition: ModelOrderConditionInput
) {
  createOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateOrderMutationVariables,
  APITypes.CreateOrderMutation
>;
export const updateOrder = /* GraphQL */ `mutation UpdateOrder(
  $input: UpdateOrderInput!
  $condition: ModelOrderConditionInput
) {
  updateOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateOrderMutationVariables,
  APITypes.UpdateOrderMutation
>;
export const deleteOrder = /* GraphQL */ `mutation DeleteOrder(
  $input: DeleteOrderInput!
  $condition: ModelOrderConditionInput
) {
  deleteOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteOrderMutationVariables,
  APITypes.DeleteOrderMutation
>;
export const createOrderItem = /* GraphQL */ `mutation CreateOrderItem(
  $input: CreateOrderItemInput!
  $condition: ModelOrderItemConditionInput
) {
  createOrderItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateOrderItemMutationVariables,
  APITypes.CreateOrderItemMutation
>;
export const updateOrderItem = /* GraphQL */ `mutation UpdateOrderItem(
  $input: UpdateOrderItemInput!
  $condition: ModelOrderItemConditionInput
) {
  updateOrderItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateOrderItemMutationVariables,
  APITypes.UpdateOrderItemMutation
>;
export const deleteOrderItem = /* GraphQL */ `mutation DeleteOrderItem(
  $input: DeleteOrderItemInput!
  $condition: ModelOrderItemConditionInput
) {
  deleteOrderItem(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteOrderItemMutationVariables,
  APITypes.DeleteOrderItemMutation
>;
