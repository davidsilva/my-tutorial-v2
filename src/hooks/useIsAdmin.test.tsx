import { renderHook, waitFor } from "@testing-library/react";
import { fetchAuthSession } from "aws-amplify/auth";
import useIsAdmin from "./useIsAdmin";
import { describe, test, expect, vi } from "vitest";

vi.mock("aws-amplify/auth");

describe("useIsAdmin", () => {
  test("should set isAdmin to true if user is an admin, and isLoading to false, and isCheckRun to true", async () => {
    // Mock the fetchAuthSession function to return a session with admin group
    vi.mocked(fetchAuthSession).mockResolvedValueOnce({
      tokens: {
        accessToken: {
          payload: {
            "cognito:groups": ["adminUsers"],
          },
        },
      },
    });

    const { result } = renderHook(() => useIsAdmin());

    await waitFor(() => expect(result.current.isAdmin).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.isCheckRun).toBe(true));
  });

  test("should set isAdmin to false if user is not an admin, and isLoading to false, and isCheckRun to true", async () => {
    // Mock the fetchAuthSession function to return a session without admin group
    vi.mocked(fetchAuthSession).mockResolvedValueOnce({
      tokens: {
        accessToken: {
          payload: {
            "cognito:groups": [],
          },
        },
      },
    });

    const { result } = renderHook(() => useIsAdmin());

    await waitFor(() => expect(result.current.isAdmin).toBe(false));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.isCheckRun).toBe(true));
  });
  test("should set isAdmin to false if user is not signed in, and isLoading to false, and isCheckRun to true", async () => {
    // Mock the fetchAuthSession function to throw an error
    vi.mocked(fetchAuthSession).mockRejectedValueOnce(
      new Error("User is not signed in")
    );

    const { result } = renderHook(() => useIsAdmin());

    await waitFor(() => expect(result.current.isAdmin).toBe(false));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.isCheckRun).toBe(true));
  });
});
