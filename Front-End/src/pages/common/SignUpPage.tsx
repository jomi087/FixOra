import { useState } from "react";
import { BGImage_404 } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import SignUp from "../../components/common/auth/SignUp";
import type { user } from "../../Types/user";
import { toast } from "react-toastify";


const SignUpPage : React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(formData:user) => {

    setLoading(true)
    try {
      console.log("creating user ", formData)
    } catch (err:unknown) {  const [loading, setLoading] = useState(false);
      toast.error("email verification failed");
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-cover " style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-start"} />
      <SignUp signUpSubmit={handleSubmit} loading={loading} />
    </main>
  );
};

export default SignUpPage;



