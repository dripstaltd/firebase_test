import { Outlet, RouteObject, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthState, useSignIn, useSignOut } from "../contexts/UserContext";

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;
const IndexScreen = lazy(() => import("../screens/Index"));
const Page404Screen = lazy(() => import("../screens/404"));

function Layout() {
  const { state } = useAuthState();
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  return (
    <div>
      {/* ✅ Header with a single Sign In/Out button */}
      <nav className="p-4 flex items-center justify-between bg-gray-900 text-white">
        <span className="text-lg font-bold">My App</span>
        <button
          onClick={state.state === "SIGNED_IN" ? signOut : signIn}
          className="btn btn-primary normal-case px-4 py-2 rounded-md"
        >
          {state.state === "SIGNED_IN" ? "Sign Out" : "Sign In"}
        </button>
      </nav>

      {/* Page Content */}
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <IndexScreen /> },
        { path: "*", element: <Page404Screen /> },
      ],
    },
  ];
  return useRoutes(routes);
};

export const Router = () => {
  return <InnerRouter />;
};
