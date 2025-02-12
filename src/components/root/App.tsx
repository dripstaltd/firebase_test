import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import Main from "../root/Main";

export const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};


