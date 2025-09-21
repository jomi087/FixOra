import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import AuthCheck from "./components/common/auth/AuthCheck";
import { useState } from "react";
import PageLoader from "./components/common/Others/PageLoader";
import ToastConfig from "./components/common/Others/ToastConfig";
import SocketWrapper from "./pages/common/SocketWrapper";



function App() {
  const [authChecked, setAuthChecked] = useState(false);
  


  return (
    <>
      <Provider store={appStore}>
        <ToastConfig />
        {!authChecked ? (
          <PageLoader />
        ) : (
          <SocketWrapper>
            <RouterProvider router={router} />
          </SocketWrapper>
        )}
        <AuthCheck onComplete={() => setAuthChecked(true)} />
      </Provider>

    </>
  );
}

export default App;
