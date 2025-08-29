import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
    msg ?: string;
}

const ErrorPage:React.FC<ErrorPageProps> = ({ msg = "Something went wrong." }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
          <BiError className="text-red-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{msg}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
                        Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
