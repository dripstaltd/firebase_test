import { useSignOut } from "../../contexts/UserContext";

export const SignOutButton = () => {
  const { signOut } = useSignOut();

  return (
    <button
      onClick={signOut}
      type="button"
      className="btn normal-case"
    >
      Sign Out
    </button>
  );
};
