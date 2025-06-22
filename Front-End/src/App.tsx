import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoutes';
import { Provider } from 'react-redux';
import appStore from './store/appStore';
import AuthCheck from './components/common/auth/AuthCheck';


function App() {
  return (
    <>
      <Provider store = {appStore}>
        <AuthCheck />
        <ToastContainer
          theme="dark" 
          position="top-right" 
          autoClose={2000} 
          className="text-sm font-serif"
          closeOnClick
          hideProgressBar={true}
          draggable={true}
        />
        <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
