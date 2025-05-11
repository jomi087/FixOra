import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoutes';


function App() {
  return (
    <>
      <ToastContainer
        theme="dark" 
        position="top-right" 
        autoClose={3000} 
        closeOnClick
      />
      <RouterProvider router= {router} />
    </>
  )
}

export default App
