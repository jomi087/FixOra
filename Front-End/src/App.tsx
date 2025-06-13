import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoutes';
import { Provider } from 'react-redux';
import appStore from './store/appStore';


function App() {
  return (
    <>
      <Provider store = {appStore}>
        <ToastContainer
          theme="dark" 
          position="top-right" 
          autoClose={3000} 
          closeOnClick
        />
        <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
