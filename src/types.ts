import { Product, User, Review, Session } from "./API";
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

export interface AsyncProcessPending extends AsyncProcessBase {
  status: AsyncProcessStatus.PENDING;
}

export interface AsyncProcessError<E> extends AsyncProcessBase {
  status: AsyncProcessStatus.ERROR;
  error: E;
}

export interface AsyncProcessSuccess<T> extends AsyncProcessBase {
  status: AsyncProcessStatus.SUCCESS;
  value: T;
}

export type AsyncProcess<T, E> =
  | AsyncProcessNone
  | AsyncProcessPending
  | AsyncProcessError<E>
  | AsyncProcessSuccess<T>;

export interface SessionCheckResult {
  session: SessionType;
}

export interface SessionCheckError {
  message: string;
}

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
