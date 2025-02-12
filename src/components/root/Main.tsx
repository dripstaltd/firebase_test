import { Router } from "../router/Router";
import { useSignIn, useSignOut } from "../contexts/UserContext"; // ✅ Ensure Correct Import
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Main() {
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  useEffect(() => {
    const auth = getAuth();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        signIn(user);
      } else {
        signOut();
      }
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }, []);

  return (
    <main>
      <Router />
    </main>
  );
}

export default Main;

