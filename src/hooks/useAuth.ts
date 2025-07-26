import { useEffect, useState } from "react";

export const VALID_USER = {
  email:  "muskan123@gmail.com",
  password:  "muskan@123",
};

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (
        parsedUser.email === VALID_USER.email &&
        parsedUser.password === VALID_USER.password
      ) {
        setAuthenticated(true);
      }
    }
  }, []);

  return { authenticated };
}
