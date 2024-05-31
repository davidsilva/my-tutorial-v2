import { Product, User, Review, Session, CartItem } from "./API";
import { AuthUser } from "aws-amplify/auth";

export type SessionType = Session | null;

export type ProductWithReviews = Product & {
  reviewCount: number;
};

export type ListProductsQueryWithReviews = {
  listProducts: {
    items: Product[];
    nextToken: string;
  };
};

export enum AsyncProcessStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface AsyncProcessBase {
  status: AsyncProcessStatus;
}

export interface AsyncProcessNone extends AsyncProcessBase {
  status: AsyncProcessStatus.NONE;
}

export interface AsyncProcessPending<T> extends AsyncProcessBase {
  status: AsyncProcessStatus.PENDING;
  value?: T;
}

export interface AsyncProcessError<T, E> extends AsyncProcessBase {
  status: AsyncProcessStatus.ERROR;
  error: E;
  value?: T;
}

export interface AsyncProcessSuccess<T> extends AsyncProcessBase {
  status: AsyncProcessStatus.SUCCESS;
  value: T;
}

export type AsyncProcess<T, E> =
  | AsyncProcessNone
  | AsyncProcessPending<T>
  | AsyncProcessError<T, E>
  | AsyncProcessSuccess<T>;

export interface SessionCheckResult {
  session: SessionType;
}

export interface SessionCheckError {
  message: string;
}

export interface CartItemsResult {
  items: CartItem[];
}

export interface CartItemsError {
  message: string;
}

export type CartItemsAsyncProcess = AsyncProcess<
  { items: CartItem[] },
  CartItemsError
>;

export type UserWithReviews = User & {
  reviews?: {
    items: Review[];
  };
};

export type Status = "loading" | "error" | "success";

export interface UserCheckResult {
  user: AuthUser | null;
}

export interface UserCheckError {
  message: string;
}
