import { ToastContainer } from "react-toastify";

const ToastConfig = () => {
  return (
    <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        className="text-sm font-serif"
        closeOnClick
        hideProgressBar={true}
        draggable={true}
    />
  )
}

export default ToastConfig