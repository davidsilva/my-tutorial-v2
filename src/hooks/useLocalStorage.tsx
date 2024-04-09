import { useState, useEffect } from "react";

type UseLocalStorageReturn = [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
];

const useLocalStorage = (
  key: string,
  initialValue: string | null = null
): UseLocalStorageReturn => {
  const [value, setValue] = useState<string | null>(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  useEffect(() => {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
