import { useState } from "react";
import { toast } from "react-toastify";

interface User {
  email: string;
  password: string;
  token?: string;
}

export const VALID_EMAIL = "muskan123@gmail.com";
export const VALID_PASSWORD = "muskan@123";

export function useLocalStorage(key: string, initialValue: User | null): [User | null, (value: User) => boolean] {
  const [storedValue, setStoredValue] = useState<User | null>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as User) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: User): boolean => {
    if (
      value.email === VALID_EMAIL &&
      value.password === VALID_PASSWORD
    ) {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
        return true; 
      } catch (error) {
        console.error("Error setting localStorage key:", key, error);
      }
    } else {
      toast.error("Invalid email or password!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    return false; 
  };

  return [storedValue, setValue];
}
