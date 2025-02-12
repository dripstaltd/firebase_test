import { useSignIn } from "../../contexts/UserContext";

export const SignInButton = () => {
  const { signIn } = useSignIn();

  return (
    <button
      onClick={signIn}
      type="button"
      className="btn btn-primary normal-case min-w-60"
    >
      Sign In With Google
    </button>
  );
};
