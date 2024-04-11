import { renderHook, waitFor } from "@testing-library/react";
import { getCurrentUser, AuthUser, AuthError } from "aws-amplify/auth";
import useCheckForUser from "./useCheckForUser";
import { describe, test, expect, vi } from "vitest";
import { AsyncProcessStatus } from "../types";

vi.mock("aws-amplify/auth");

describe("useCheckForUser", () => {
  test("should set userCheck to SUCCESS, with user as value returned by getCurrentUser", async () => {
    const mockUser: AuthUser = { username: "test", userId: "123" };

    vi.mocked(getCurrentUser).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useCheckForUser());

    await waitFor(() =>
      expect(result.current.userCheck).toEqual({
        status: AsyncProcessStatus.SUCCESS,
        value: { user: mockUser },
      })
    );
  });

  test("should set userCheck to SUCCESS, with user as null, when getCurrentUser rejects because the user is not signed in", async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new AuthError({
        message: "Error checking for user",
        underlyingError: new Error("Test error"),
        recoverySuggestion: "Try again",
        name: "TestError",
      })
    );

    const { result } = renderHook(() => useCheckForUser());

    await waitFor(() =>
      expect(result.current.userCheck).toEqual({
        status: AsyncProcessStatus.SUCCESS,
        value: { user: null },
      })
    );
  });
});
