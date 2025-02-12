import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import { auth } from "../../lib/firebase";
import {
  onAuthStateChanged,
  getRedirectResult,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from "firebase/auth";

// Auth State
type AuthState =
  | { state: "SIGNED_IN"; currentUser: User }
  | { state: "SIGNED_OUT" }
  | { state: "UNKNOWN" };

type AuthActions =
  | { type: "SIGN_IN"; payload: { user: User } }
  | { type: "SIGN_OUT" };

// Reducer
const AuthReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case "SIGN_IN":
      return { state: "SIGNED_IN", currentUser: action.payload.user };
    case "SIGN_OUT":
      return { state: "SIGNED_OUT" };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<{ state: AuthState; dispatch: (value: AuthActions) => void }>({
  state: { state: "UNKNOWN" },
  dispatch: () => {}
});

// ✅ AuthProvider (Prevents Redirect Loops)
// ✅ AuthProvider (Fixing Redirect Order)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, { state: "UNKNOWN" });

  useEffect(() => {
    console.log("🔍 Checking authentication state...");

    // ✅ Handle Firebase Redirect Result **Before** Listening for Auth State Changes
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("✅ User signed in via redirect:", result.user);
          dispatch({ type: "SIGN_IN", payload: { user: result.user } });
        } else {
          console.log("⚠️ No user returned from redirect.");
        }
      })
      .catch((error) => console.error("❌ Error handling sign-in redirect:", error));

    // ✅ Listen for Auth State Changes After Handling Redirect
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("👤 Auth state changed:", user);
      if (user) {
        dispatch({ type: "SIGN_IN", payload: { user } });
      } else {
        dispatch({ type: "SIGN_OUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};


// ✅ Hook: Get Current Auth State
export const useAuthState = () => {
  const { state } = useContext(AuthContext);
  return { state };
};

export const useSignIn = () => {
  return {
    signIn: async () => {
      if (auth.currentUser) {
        console.log("🚀 User already signed in:", auth.currentUser);
        return;
      }

      console.log("🖼️ Using popup for Google login...");
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Signed in with popup:", result.user);
      } catch (error) {
        console.error("❌ Error during sign-in popup:", error);
      }
    }
  };
};




// ✅ Hook: Sign Out
export const useSignOut = () => {
  const { dispatch } = useContext(AuthContext);

  return {
    signOut: async () => {
      await signOut(auth);
      dispatch({ type: "SIGN_OUT" });
    }
  };
};
