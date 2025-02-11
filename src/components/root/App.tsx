import {HelmetProvider} from "react-helmet-async";
import {AuthProvider} from "../contexts/UserContext";
import Main from "../root/Main";

export const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </HelmetProvider>
  )
};
