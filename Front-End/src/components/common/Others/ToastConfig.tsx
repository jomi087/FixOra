import { ToastContainer } from "react-toastify";

const ToastConfig = () => {
  return (
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={3000} 
      className="text-sm font-serif"
      closeOnClick
      draggable={true}
    />
  );
};

export default ToastConfig;