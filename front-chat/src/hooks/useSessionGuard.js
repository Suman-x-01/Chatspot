import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function useSessionGuard(user, onInvalidSession) {
  useEffect(() => {
    if (!user?.username || !user?.sessionToken) return;

    const validate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/session/validate/${user.username}/${user.sessionToken}`,
        );

        if (!res.data.valid) {
          toast.error("⚠️ You were logged in from another browser!");
          onInvalidSession(); // kick out
        }
      } catch {
        // network error — don't kick out, just skip
      }
    };

    validate(); // check immediately on mount
    const interval = setInterval(validate, 10000); // check every 10 seconds
    return () => clearInterval(interval);
  }, [user]);
}
