/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Product = {
  __typename: "Product",
  id: string,
  name: string,
  description: string,
  price: number,
  isArchived?: boolean | null,
  reviews?: ModelReviewConnection | null,
  image?: string | null,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
  cartItems?: ModelCartItemConnection | null,
  orderItems?: ModelOrderItemConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items:  Array<Review | null >,
  nextToken?: string | null,
};

export type Review = {
  __typename: "Review",
  id: string,
  product?: Product | null,
  rating?: number | null,
  content?: string | null,
  isArchived?: boolean | null,
  user?: User | null,
  createdAt: string,
  updatedAt: string,
  productReviewsId?: string | null,
  userReviewsId?: string | null,
  owner?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  userId: string,
  username: string,
  firstName?: string | null,
  lastName?: string | null,
  isArchived?: boolean | null,
  reviews?: ModelReviewConnection | null,
  sessions?: ModelSessionConnection | null,
  orders?: ModelOrderConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items:  Array<Session | null >,
  nextToken?: string | null,
};

export type Session = {
  __typename: "Session",
  id: string,
  userId?: string | null,
  cartItems?: ModelCartItemConnection | null,
  user?: User | null,
  deletedAt?: string | null,
  createdAt: string,
  updatedAt: string,
  userSessionsId?: string | null,
};

export type ModelCartItemConnection = {
  __typename: "ModelCartItemConnection",
  items:  Array<CartItem | null >,
  nextToken?: string | null,
};

export type CartItem = {
  __typename: "CartItem",
  id: string,
  sessionId: string,
  productId: string,
  quantity: number,
  session?: Session | null,
  product?: Product | null,
  createdAt: string,
  updatedAt: string,
  productCartItemsId?: string | null,
  sessionCartItemsId?: string | null,
};

export type ModelOrderConnection = {
  __typename: "ModelOrderConnection",
  items:  Array<Order | null >,
  nextToken?: string | null,
};

export type Order = {
  __typename: "Order",
  id: string,
  userId: string,
  total: number,
  status: OrderStatus,
  user?: User | null,
  items?: ModelOrderItemConnection | null,
  createdAt: string,
  updatedAt: string,
  userOrdersId?: string | null,
  owner?: string | null,
};

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}


export type ModelOrderItemConnection = {
  __typename: "ModelOrderItemConnection",
  items:  Array<OrderItem | null >,
  nextToken?: string | null,
};

export type OrderItem = {
  __typename: "OrderItem",
  id: string,
  orderId: string,
  productId: string,
  quantity: number,
  price: number,
  order?: Order | null,
  product?: Product | null,
  createdAt: string,
  updatedAt: string,
  productOrderItemsId?: string | null,
  orderItemsId?: string | null,
  owner?: string | null,
};

export type ModelProductFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  price?: ModelIntInput | null,
  isArchived?: ModelBooleanInput | null,
  image?: ModelStringInput | null,
  stripePriceId?: ModelStringInput | null,
  stripeProductId?: ModelStringInput | null,
  and?: Array< ModelProductFilterInput | null > | null,
  or?: Array< ModelProductFilterInput | null > | null,
  not?: ModelProductFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelProductConnection = {
  __typename: "ModelProductConnection",
  items:  Array<Product | null >,
  nextToken?: string | null,
};

export type ProcessOrderInput = {
  id: string,
  cart?: Array< CartItemInput | null > | null,
  total: number,
  token: string,
  address?: string | null,
};

export type CartItemInput = {
  id: string,
  name?: string | null,
  price: number,
  quantity: number,
};

export type CreateSessionInput = {
  id?: string | null,
  userId?: string | null,
  deletedAt?: string | null,
  userSessionsId?: string | null,
};

export type ModelSessionConditionInput = {
  userId?: ModelIDInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelSessionConditionInput | null > | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  not?: ModelSessionConditionInput | null,
  userSessionsId?: ModelIDInput | null,
};

export type UpdateSessionInput = {
  id: string,
  userId?: string | null,
  deletedAt?: string | null,
  userSessionsId?: string | null,
};

export type DeleteSessionInput = {
  id: string,
};

export type CreateProductInput = {
  id?: string | null,
  name: string,
  description: string,
  price: number,
  isArchived?: boolean | null,
  image?: string | null,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
};

export type ModelProductConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  price?: ModelIntInput | null,
  isArchived?: ModelBooleanInput | null,
  image?: ModelStringInput | null,
  stripePriceId?: ModelStringInput | null,
  stripeProductId?: ModelStringInput | null,
  and?: Array< ModelProductConditionInput | null > | null,
  or?: Array< ModelProductConditionInput | null > | null,
  not?: ModelProductConditionInput | null,
};

export type UpdateProductInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  price?: number | null,
  isArchived?: boolean | null,
  image?: string | null,
  stripePriceId?: string | null,
  stripeProductId?: string | null,
};

export type DeleteProductInput = {
  id: string,
};

export type CreateReviewInput = {
  id?: string | null,
  rating?: number | null,
  content?: string | null,
  isArchived?: boolean | null,
  productReviewsId?: string | null,
  userReviewsId?: string | null,
};

export type ModelReviewConditionInput = {
  rating?: ModelIntInput | null,
  content?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  and?: Array< ModelReviewConditionInput | null > | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  not?: ModelReviewConditionInput | null,
  productReviewsId?: ModelIDInput | null,
  userReviewsId?: ModelIDInput | null,
};

export type UpdateReviewInput = {
  id: string,
  rating?: number | null,
  content?: string | null,
  isArchived?: boolean | null,
  productReviewsId?: string | null,
  userReviewsId?: string | null,
};

export type DeleteReviewInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  userId: string,
  username: string,
  firstName?: string | null,
  lastName?: string | null,
  isArchived?: boolean | null,
};

export type ModelUserConditionInput = {
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type UpdateUserInput = {
  id: string,
  userId?: string | null,
  username?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  isArchived?: boolean | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateCartItemInput = {
  id?: string | null,
  sessionId: string,
  productId: string,
  quantity: number,
  productCartItemsId?: string | null,
  sessionCartItemsId?: string | null,
};

export type ModelCartItemConditionInput = {
  sessionId?: ModelIDInput | null,
  productId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  and?: Array< ModelCartItemConditionInput | null > | null,
  or?: Array< ModelCartItemConditionInput | null > | null,
  not?: ModelCartItemConditionInput | null,
  productCartItemsId?: ModelIDInput | null,
  sessionCartItemsId?: ModelIDInput | null,
};

export type UpdateCartItemInput = {
  id: string,
  sessionId?: string | null,
  productId?: string | null,
  quantity?: number | null,
  productCartItemsId?: string | null,
  sessionCartItemsId?: string | null,
};

export type DeleteCartItemInput = {
  id: string,
};

export type CreateOrderInput = {
  id?: string | null,
  userId: string,
  total: number,
  status: OrderStatus,
  userOrdersId?: string | null,
};

export type ModelOrderConditionInput = {
  userId?: ModelIDInput | null,
  total?: ModelIntInput | null,
  status?: ModelOrderStatusInput | null,
  and?: Array< ModelOrderConditionInput | null > | null,
  or?: Array< ModelOrderConditionInput | null > | null,
  not?: ModelOrderConditionInput | null,
  userOrdersId?: ModelIDInput | null,
};

export type ModelOrderStatusInput = {
  eq?: OrderStatus | null,
  ne?: OrderStatus | null,
};

export type UpdateOrderInput = {
  id: string,
  userId?: string | null,
  total?: number | null,
  status?: OrderStatus | null,
  userOrdersId?: string | null,
};

export type DeleteOrderInput = {
  id: string,
};

export type CreateOrderItemInput = {
  id?: string | null,
  orderId: string,
  productId: string,
  quantity: number,
  price: number,
  productOrderItemsId?: string | null,
  orderItemsId?: string | null,
};

export type ModelOrderItemConditionInput = {
  orderId?: ModelIDInput | null,
  productId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  price?: ModelIntInput | null,
  and?: Array< ModelOrderItemConditionInput | null > | null,
  or?: Array< ModelOrderItemConditionInput | null > | null,
  not?: ModelOrderItemConditionInput | null,
  productOrderItemsId?: ModelIDInput | null,
  orderItemsId?: ModelIDInput | null,
};

export type UpdateOrderItemInput = {
  id: string,
  orderId?: string | null,
  productId?: string | null,
  quantity?: number | null,
  price?: number | null,
  productOrderItemsId?: string | null,
  orderItemsId?: string | null,
};

export type DeleteOrderItemInput = {
  id: string,
};

export type ModelSessionFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  deletedAt?: ModelStringInput | null,
  and?: Array< ModelSessionFilterInput | null > | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  not?: ModelSessionFilterInput | null,
  userSessionsId?: ModelIDInput | null,
};

export type ModelReviewFilterInput = {
  id?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  content?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  and?: Array< ModelReviewFilterInput | null > | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  not?: ModelReviewFilterInput | null,
  productReviewsId?: ModelIDInput | null,
  userReviewsId?: ModelIDInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelCartItemFilterInput = {
  id?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  productId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  and?: Array< ModelCartItemFilterInput | null > | null,
  or?: Array< ModelCartItemFilterInput | null > | null,
  not?: ModelCartItemFilterInput | null,
  productCartItemsId?: ModelIDInput | null,
  sessionCartItemsId?: ModelIDInput | null,
};

export type ModelOrderFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  total?: ModelIntInput | null,
  status?: ModelOrderStatusInput | null,
  and?: Array< ModelOrderFilterInput | null > | null,
  or?: Array< ModelOrderFilterInput | null > | null,
  not?: ModelOrderFilterInput | null,
  userOrdersId?: ModelIDInput | null,
};

export type ModelOrderItemFilterInput = {
  id?: ModelIDInput | null,
  orderId?: ModelIDInput | null,
  productId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  price?: ModelIntInput | null,
  and?: Array< ModelOrderItemFilterInput | null > | null,
  or?: Array< ModelOrderItemFilterInput | null > | null,
  not?: ModelOrderItemFilterInput | null,
  productOrderItemsId?: ModelIDInput | null,
  orderItemsId?: ModelIDInput | null,
};

export type ModelSubscriptionSessionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  deletedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionSessionFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionProductFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  price?: ModelSubscriptionIntInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  image?: ModelSubscriptionStringInput | null,
  stripePriceId?: ModelSubscriptionStringInput | null,
  stripeProductId?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProductFilterInput | null > | null,
  or?: Array< ModelSubscriptionProductFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionReviewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  rating?: ModelSubscriptionIntInput | null,
  content?: ModelSubscriptionStringInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  or?: Array< ModelSubscriptionReviewFilterInput | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionCartItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  productId?: ModelSubscriptionIDInput | null,
  quantity?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionCartItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionCartItemFilterInput | null > | null,
};

export type ModelSubscriptionOrderFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  total?: ModelSubscriptionIntInput | null,
  status?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionOrderFilterInput | null > | null,
  or?: Array< ModelSubscriptionOrderFilterInput | null > | null,
};

export type ModelSubscriptionOrderItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  orderId?: ModelSubscriptionIDInput | null,
  productId?: ModelSubscriptionIDInput | null,
  quantity?: ModelSubscriptionIntInput | null,
  price?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionOrderItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionOrderItemFilterInput | null > | null,
};

export type ArchiveProductMutationVariables = {
  id: string,
};

export type ArchiveProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id: string,
    isArchived?: boolean | null,
  } | null,
};

export type RestoreProductMutationVariables = {
  id: string,
};

export type RestoreProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id: string,
    isArchived?: boolean | null,
  } | null,
};

export type ListProductsWithReviewsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsWithReviewsQuery = {
  listProducts?:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      isArchived?: boolean | null,
      image?: string | null,
      reviews?:  {
        __typename: "ModelReviewConnection",
        items:  Array< {
          __typename: "Review",
          id: string,
          rating?: number | null,
          content?: string | null,
          isArchived?: boolean | null,
          user?:  {
            __typename: "User",
            id: string,
            username: string,
            isArchived?: boolean | null,
          } | null,
        } | null >,
        nextToken?: string | null,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProductWithReviewsQueryVariables = {
  id: string,
};

export type GetProductWithReviewsQuery = {
  getProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    image?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      items:  Array< {
        __typename: "Review",
        id: string,
        rating?: number | null,
        content?: string | null,
        isArchived?: boolean | null,
        createdAt: string,
        updatedAt: string,
        productReviewsId?: string | null,
        userReviewsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetUserWithReviewsQueryVariables = {
  id: string,
};

export type GetUserWithReviewsQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      items:  Array< {
        __typename: "Review",
        id: string,
        rating?: number | null,
        content?: string | null,
        isArchived?: boolean | null,
        createdAt: string,
        updatedAt: string,
        productReviewsId?: string | null,
        userReviewsId?: string | null,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ProcessOrderMutationVariables = {
  input: ProcessOrderInput,
};

export type ProcessOrderMutation = {
  processOrder?: OrderStatus | null,
};

export type CreateSessionMutationVariables = {
  input: CreateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type CreateSessionMutation = {
  createSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type UpdateSessionMutationVariables = {
  input: UpdateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type UpdateSessionMutation = {
  updateSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type DeleteSessionMutationVariables = {
  input: DeleteSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type DeleteSessionMutation = {
  deleteSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type CreateProductMutationVariables = {
  input: CreateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type CreateProductMutation = {
  createProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateProductMutationVariables = {
  input: UpdateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type UpdateProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput,
  condition?: ModelProductConditionInput | null,
};

export type DeleteProductMutation = {
  deleteProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateReviewMutationVariables = {
  input: CreateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type CreateReviewMutation = {
  createReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateReviewMutationVariables = {
  input: UpdateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type UpdateReviewMutation = {
  updateReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteReviewMutationVariables = {
  input: DeleteReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type DeleteReviewMutation = {
  deleteReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateCartItemMutationVariables = {
  input: CreateCartItemInput,
  condition?: ModelCartItemConditionInput | null,
};

export type CreateCartItemMutation = {
  createCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type UpdateCartItemMutationVariables = {
  input: UpdateCartItemInput,
  condition?: ModelCartItemConditionInput | null,
};

export type UpdateCartItemMutation = {
  updateCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type DeleteCartItemMutationVariables = {
  input: DeleteCartItemInput,
  condition?: ModelCartItemConditionInput | null,
};

export type DeleteCartItemMutation = {
  deleteCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type CreateOrderMutationVariables = {
  input: CreateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type CreateOrderMutation = {
  createOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateOrderMutationVariables = {
  input: UpdateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type UpdateOrderMutation = {
  updateOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteOrderMutationVariables = {
  input: DeleteOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type DeleteOrderMutation = {
  deleteOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateOrderItemMutationVariables = {
  input: CreateOrderItemInput,
  condition?: ModelOrderItemConditionInput | null,
};

export type CreateOrderItemMutation = {
  createOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateOrderItemMutationVariables = {
  input: UpdateOrderItemInput,
  condition?: ModelOrderItemConditionInput | null,
};

export type UpdateOrderItemMutation = {
  updateOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteOrderItemMutationVariables = {
  input: DeleteOrderItemInput,
  condition?: ModelOrderItemConditionInput | null,
};

export type DeleteOrderItemMutation = {
  deleteOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type GetSessionQueryVariables = {
  id: string,
};

export type GetSessionQuery = {
  getSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type ListSessionsQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts?:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetReviewQueryVariables = {
  id: string,
};

export type GetReviewQuery = {
  getReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListReviewsQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  listReviews?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      id: string,
      rating?: number | null,
      content?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      productReviewsId?: string | null,
      userReviewsId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCartItemQueryVariables = {
  id: string,
};

export type GetCartItemQuery = {
  getCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type ListCartItemsQueryVariables = {
  filter?: ModelCartItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCartItemsQuery = {
  listCartItems?:  {
    __typename: "ModelCartItemConnection",
    items:  Array< {
      __typename: "CartItem",
      id: string,
      sessionId: string,
      productId: string,
      quantity: number,
      createdAt: string,
      updatedAt: string,
      productCartItemsId?: string | null,
      sessionCartItemsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOrderQueryVariables = {
  id: string,
};

export type GetOrderQuery = {
  getOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListOrdersQueryVariables = {
  filter?: ModelOrderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrdersQuery = {
  listOrders?:  {
    __typename: "ModelOrderConnection",
    items:  Array< {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOrderItemQueryVariables = {
  id: string,
};

export type GetOrderItemQuery = {
  getOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListOrderItemsQueryVariables = {
  filter?: ModelOrderItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrderItemsQuery = {
  listOrderItems?:  {
    __typename: "ModelOrderItemConnection",
    items:  Array< {
      __typename: "OrderItem",
      id: string,
      orderId: string,
      productId: string,
      quantity: number,
      price: number,
      createdAt: string,
      updatedAt: string,
      productOrderItemsId?: string | null,
      orderItemsId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnCreateSessionSubscription = {
  onCreateSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type OnUpdateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnUpdateSessionSubscription = {
  onUpdateSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type OnDeleteSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnDeleteSessionSubscription = {
  onDeleteSession?:  {
    __typename: "Session",
    id: string,
    userId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    deletedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    userSessionsId?: string | null,
  } | null,
};

export type OnCreateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
  owner?: string | null,
};

export type OnCreateProductSubscription = {
  onCreateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
  owner?: string | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
  owner?: string | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    description: string,
    price: number,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    image?: string | null,
    stripePriceId?: string | null,
    stripeProductId?: string | null,
    cartItems?:  {
      __typename: "ModelCartItemConnection",
      nextToken?: string | null,
    } | null,
    orderItems?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnCreateReviewSubscription = {
  onCreateReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReviewSubscription = {
  onUpdateReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReviewSubscription = {
  onDeleteReview?:  {
    __typename: "Review",
    id: string,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    rating?: number | null,
    content?: string | null,
    isArchived?: boolean | null,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productReviewsId?: string | null,
    userReviewsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    userId: string,
    username: string,
    firstName?: string | null,
    lastName?: string | null,
    isArchived?: boolean | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    orders?:  {
      __typename: "ModelOrderConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateCartItemSubscriptionVariables = {
  filter?: ModelSubscriptionCartItemFilterInput | null,
};

export type OnCreateCartItemSubscription = {
  onCreateCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type OnUpdateCartItemSubscriptionVariables = {
  filter?: ModelSubscriptionCartItemFilterInput | null,
};

export type OnUpdateCartItemSubscription = {
  onUpdateCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type OnDeleteCartItemSubscriptionVariables = {
  filter?: ModelSubscriptionCartItemFilterInput | null,
};

export type OnDeleteCartItemSubscription = {
  onDeleteCartItem?:  {
    __typename: "CartItem",
    id: string,
    sessionId: string,
    productId: string,
    quantity: number,
    session?:  {
      __typename: "Session",
      id: string,
      userId?: string | null,
      deletedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      userSessionsId?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productCartItemsId?: string | null,
    sessionCartItemsId?: string | null,
  } | null,
};

export type OnCreateOrderSubscriptionVariables = {
  filter?: ModelSubscriptionOrderFilterInput | null,
  owner?: string | null,
};

export type OnCreateOrderSubscription = {
  onCreateOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateOrderSubscriptionVariables = {
  filter?: ModelSubscriptionOrderFilterInput | null,
  owner?: string | null,
};

export type OnUpdateOrderSubscription = {
  onUpdateOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteOrderSubscriptionVariables = {
  filter?: ModelSubscriptionOrderFilterInput | null,
  owner?: string | null,
};

export type OnDeleteOrderSubscription = {
  onDeleteOrder?:  {
    __typename: "Order",
    id: string,
    userId: string,
    total: number,
    status: OrderStatus,
    user?:  {
      __typename: "User",
      id: string,
      userId: string,
      username: string,
      firstName?: string | null,
      lastName?: string | null,
      isArchived?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    items?:  {
      __typename: "ModelOrderItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    userOrdersId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateOrderItemSubscriptionVariables = {
  filter?: ModelSubscriptionOrderItemFilterInput | null,
  owner?: string | null,
};

export type OnCreateOrderItemSubscription = {
  onCreateOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateOrderItemSubscriptionVariables = {
  filter?: ModelSubscriptionOrderItemFilterInput | null,
  owner?: string | null,
};

export type OnUpdateOrderItemSubscription = {
  onUpdateOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteOrderItemSubscriptionVariables = {
  filter?: ModelSubscriptionOrderItemFilterInput | null,
  owner?: string | null,
};

export type OnDeleteOrderItemSubscription = {
  onDeleteOrderItem?:  {
    __typename: "OrderItem",
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
    order?:  {
      __typename: "Order",
      id: string,
      userId: string,
      total: number,
      status: OrderStatus,
      createdAt: string,
      updatedAt: string,
      userOrdersId?: string | null,
      owner?: string | null,
    } | null,
    product?:  {
      __typename: "Product",
      id: string,
      name: string,
      description: string,
      price: number,
      isArchived?: boolean | null,
      image?: string | null,
      stripePriceId?: string | null,
      stripeProductId?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    productOrderItemsId?: string | null,
    orderItemsId?: string | null,
    owner?: string | null,
  } | null,
};
