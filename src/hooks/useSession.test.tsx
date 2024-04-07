import { renderHook, waitFor } from "@testing-library/react";
import { post, get, patch } from "aws-amplify/api";
import useSession from "./useSession";
import { describe, test, expect, vi } from "vitest";
import { UpdateSessionInput, Session, User } from "../API";

type SessionType = Session | null;

const { localStorageMock } = vi.hoisted(() => {
  let store: { [key: string]: string } = { sessionId: "sessionId123" };
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
  let localStorageSessionId = localStorageMock.getItem("sessionId");
  const setLocalStorageSessionId = vi
    .fn()
    .mockImplementation((id: string | null) => {
      if (id === null) {
        localStorageMock.removeItem("sessionId");
      } else {
        localStorageMock.setItem("sessionId", id);
      }
      localStorageSessionId = id;
    });
  return {
    default: vi
      .fn()
      .mockReturnValue([localStorageSessionId, setLocalStorageSessionId]),
    setLocalStorageSessionId,
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

const { mockSession } = vi.hoisted(() => {
  return {
    mockSession: {
      __typename: "Session",
      id: "sessionId123",
      userId: "userId123",
      user: mockUser,
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as SessionType,
  };
});

vi.mock("aws-amplify/api", () => {
  return {
    post: vi.fn().mockResolvedValue({
      response: { body: { json: vi.fn().mockResolvedValue(mockSession) } },
    }),
    get: vi.fn().mockResolvedValue({
      response: Promise.resolve({
        body: {
          json: vi.fn().mockResolvedValue(mockSession),
        },
      }),
    }),
    patch: vi.fn().mockResolvedValue({
      response: { body: { json: vi.fn().mockResolvedValue(mockSession) } },
    }),
  };
});

describe("useSession", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    localStorageMock.setItem("sessionId", "hello");
  });
  test("should get session corresponding to sessionId in localStorage", async () => {
    const { result } = renderHook(() => useSession());
    await waitFor(async () => {
      await result.current.getSession(mockUser);
      expect(result.current.session).toBe(mockSession);
    });
    localStorageMock.setItem("cat", "agatha");
    console.log("cat", localStorageMock.getItem("cat"));
  });
});
