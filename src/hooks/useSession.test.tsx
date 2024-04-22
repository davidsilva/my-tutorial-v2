import { renderHook, waitFor } from "@testing-library/react";
import { post, get, patch } from "aws-amplify/api";
import useSession from "./useSession";
import { describe, test, expect, vi } from "vitest";
import { Session, User } from "../API";
import { AsyncProcessStatus } from "../types";

type SessionType = Session | null;

const { localStorageMock } = vi.hoisted(() => {
  let store: { [key: string]: string } = {};
  return {
    localStorageMock: {
      getItem: vi.fn().mockImplementation((key: string) => store[key] || null),
      setItem: vi.fn().mockImplementation((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn().mockImplementation(() => {
        store = {};
      }),
      removeItem: vi.fn().mockImplementation((key: string) => {
        delete store[key];
      }),
    },
  };
});

vi.mock("./useLocalStorage", () => {
  return {
    default: (key: string, initialValue: string | null = null) => {
      let localStorageValue = localStorageMock.getItem(key) || initialValue;
      const setLocalStorageValue = vi
        .fn()
        .mockImplementation((newValue: string) => {
          if (newValue === null) {
            localStorageMock.removeItem(key);
          } else {
            localStorageMock.setItem(key, newValue);
          }
          localStorageValue = newValue;
        });
      return [localStorageValue, setLocalStorageValue];
    },
  };
});

const { mockUser } = vi.hoisted(() => {
  return {
    mockUser: {
      __typename: "User",
      id: "userId123",
      username: "testuser",
      userId: "userId123",
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as User,
  };
});

const { mockSessionWithoutUser } = vi.hoisted(() => {
  return {
    mockSessionWithoutUser: {
      __typename: "Session",
      id: "sessionId123",
      userId: null,
      user: null,
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as SessionType,
  };
});

const { mockSessionWithUser } = vi.hoisted(() => {
  return {
    mockSessionWithUser: {
      __typename: "Session",
      id: "sessionId123",
      userId: mockUser.userId,
      user: mockUser,
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as SessionType,
  };
});

vi.mock("aws-amplify/api", () => {
  return {
    post: vi.fn().mockImplementation(({ path }) => {
      if (path === `/session?userId=${encodeURIComponent(mockUser.userId)}`) {
        const mockSessionWithUserId = {
          ...mockSessionWithoutUser,
          user: mockUser,
          userId: mockUser.userId,
        };
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithUserId),
            },
          }),
        };
      } else {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithoutUser),
            },
          }),
        };
      }
    }),
    get: vi.fn().mockImplementation(({ path }) => {
      if (path === `/session/${mockSessionWithoutUser?.id}`) {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithoutUser),
            },
          }),
        };
      } else {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(null),
            },
          }),
        };
      }
    }),
    patch: vi.fn().mockImplementation(({ options }) => {
      const updates = options.body;
      return {
        response: Promise.resolve({
          body: {
            json: vi.fn().mockResolvedValue(updates),
          },
        }),
      };
    }),
  };
});

describe("useSession", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  test("should get session corresponding to sessionId in localStorage", async () => {
    localStorageMock.setItem("sessionId", "sessionId123");
    const { result } = renderHook(() => useSession());
    await waitFor(async () => {
      await result.current.getSession(mockUser);
      expect(result.current.sessionCheck).toEqual({
        status: AsyncProcessStatus.SUCCESS,
        value: { session: mockSessionWithUser },
      });
      expect(get).toHaveBeenCalled();
      expect(patch).toHaveBeenCalled();
      expect(post).not.toHaveBeenCalled();
    });
  });

  /*
   If there is no sessionId in localStorage, a new session should be created. The session should have a userId if the user is signed in.
   */
  test("should create a new session if there is no sessionId in localStorage", async () => {
    /*     
    post should be called. sessionId should not exist in localStorage. session should be set to the response from post.
    get(null) will return mockSessionWithoutUser.
    */
    expect(localStorageMock.getItem("sessionId")).toBe(null);
    const { result } = renderHook(() => useSession());
    await waitFor(async () => {
      await result.current.getSession(null);
      expect(result.current.sessionCheck).toEqual({
        status: AsyncProcessStatus.SUCCESS,
        value: { session: mockSessionWithoutUser },
      });
      expect(get).toHaveBeenCalled();
      expect(post).toHaveBeenCalled();
      expect(patch).not.toHaveBeenCalled();
    });
  });

  /* 
  If there is a sessionId in localStorage, but the session does not have a userId, the session should be updated with the userId of the signed-in user. 
  */
  test("should update the session with the userId of the signed-in user if the session does not have a userId", async () => {
    // patch should be called.
    // get() will return mockSessionWithoutUser.
    // patch() will return mockSessionWithUser.
    localStorageMock.setItem("sessionId", "sessionId123");
    const { result } = renderHook(() => useSession());
    await waitFor(async () => {
      await result.current.getSession(mockUser);
      expect(result.current.sessionCheck).toEqual({
        status: AsyncProcessStatus.SUCCESS,
        value: { session: mockSessionWithUser },
      });
      expect(get).toHaveBeenCalled();
      expect(patch).toHaveBeenCalled();
      expect(post).not.toHaveBeenCalled();
    });
  });
});
