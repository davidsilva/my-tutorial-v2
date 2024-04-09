import { renderHook, waitFor } from "@testing-library/react";
import { getCurrentUser, AuthUser, AuthError } from "aws-amplify/auth";
import useCheckForUser from "./useCheckForUser";
import { describe, test, expect, vi } from "vitest";

vi.mock("aws-amplify/auth");

describe("useCheckForUser", () => {
  test("should set user and isCheckRun to true when getCurrentUser resolves", async () => {
    const mockUser: AuthUser = { username: "test", userId: "123" };

    vi.mocked(getCurrentUser).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useCheckForUser());

    await waitFor(() => expect(result.current.user).toStrictEqual(mockUser));
    expect(result.current.isCheckRun).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  test("should set user to null and isCheckRun to true when getCurrentUser rejects", async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new AuthError({
        message: "Error checking for user",
        underlyingError: new Error("Test error"),
        recoverySuggestion: "Try again",
        name: "TestError",
      })
    );

    const { result } = renderHook(() => useCheckForUser());

    await waitFor(() => expect(result.current.user).toBe(null));
    expect(result.current.isCheckRun).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
