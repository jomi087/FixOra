import { BGImage_404 } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import SignUp from "../../components/common/auth/SignUp";
import { useSignUpLogic } from "@/hooks/useSignUpLogic";


const SignUpPage : React.FC = () => {

  const {loading, handleSubmit} = useSignUpLogic()

  return (
    <main className="min-h-screen flex flex-col bg-cover " style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-start"} />
      <SignUp signUpSubmit={handleSubmit} loading={loading} />
    </main>
  );
};

export default SignUpPage;



