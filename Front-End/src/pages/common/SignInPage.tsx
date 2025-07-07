import { BGImage_404, SingInThemeImage } from "@/utils/constant";
import Header from "@/components/common/layout/Header";
import SignIn from "@/components/common/auth/SignIn";
import { RoleEnum } from "@/shared/enums/roles";
import { useSignInLogic } from "@/hooks/useSignInLogic";

const SignInPage: React.FC = () => {
  
  const { handleLogin,handleForgotPassword,loginWithGoogle,loading,userRole } =  useSignInLogic() 

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-end"} />
      <SignIn
        singInThemeImage={SingInThemeImage}
        signInSubmit={handleLogin}
        forgotPassword={handleForgotPassword}
        loading={loading}
        googleSignin={loginWithGoogle}
        role={userRole||RoleEnum.CUSTOMER} // Default to CUSTOMER if role is not provided
      />
    </main>
  );
};

export default SignInPage;

