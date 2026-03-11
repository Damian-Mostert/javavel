import Hook from "@/client/hook";
import { useEffect } from "react";
const AuthHook = Hook<{
  user: user | null;
}>({
  initialState: {
    user: null,
  },
  render(state, updateState, children) {
    useEffect(() => {
      
    }, []);
    return <>{children}</>;
  },
});

export default AuthHook;
