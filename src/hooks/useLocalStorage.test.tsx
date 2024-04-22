import { renderHook, waitFor } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";
import { describe, test, expect } from "vitest";

const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (): string | null => "",
    length: Object.keys(store).length,
  };
})();

let originalLocalStorage: Storage;

beforeAll((): void => {
  originalLocalStorage = window.localStorage;
  window.localStorage = localStorageMock;
});

afterAll((): void => {
  window.localStorage = originalLocalStorage;
});

describe("useLocalStorage", () => {
  test("should return the value from localStorage", async () => {
    const key = "test1";
    const initialValue = "testValue";
    localStorageMock.setItem(key, initialValue);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    await waitFor(() => expect(result.current[0]).toBe(initialValue));
  });

  test("should update the value in localStorage when set", async () => {
    const key = "test2";
    const initialValue = "testValue";
    const newValue = "newValue";
    localStorageMock.setItem(key, initialValue);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    await waitFor(() => expect(result.current[0]).toBe(initialValue));

    result.current[1](newValue);

    await waitFor(() => expect(result.current[0]).toBe(newValue));
    await waitFor(() => expect(localStorageMock.getItem(key)).toBe(newValue));
  });

  test("should remove the value from localStorage when set to null", async () => {
    const key = "test3";
    const initialValue = "testValue";
    localStorageMock.setItem(key, initialValue);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    await waitFor(() => expect(result.current[0]).toBe(initialValue));

    result.current[1](null);

    await waitFor(() => expect(result.current[0]).toBe(null));
    await waitFor(() => expect(localStorageMock.getItem(key)).toBe(null));
  });
});
