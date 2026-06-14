import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setupApiAuth } from "../api/client.js";

export default function ApiProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    setupApiAuth(getToken);
  }, [getToken, isLoaded, isSignedIn]);

  return children;
}
