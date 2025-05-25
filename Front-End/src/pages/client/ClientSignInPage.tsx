
import { BGImage_404, SingInThemeImage } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import SignIn from "../../components/common/auth/SignIn";
import { toast } from "react-toastify";
import { useState } from "react";


const ClientSignInPage: React.FC = () => {
  
  const [loading, setLoading] = useState(false);  

  const handleClientLogin = async (email: string, password: string) => {

    setLoading(true);
    try {
      console.log("Logging in", email, password);
      //validate
      //on success,  navigate to landlanding page or pervious page
    } catch (err: unknown) {
      toast.error("Login failed. Please try again Later");
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async (email: string) => {
    
    setLoading(true);
    try {
     console.log("VERIFIYING  EMAL BY ", email);
      //validate
      //on success,  navigate to otp page 
    } catch ( err: unknown ) {
      toast.error("email verification failed");
    } finally {
      setLoading(false)
    }
  }
    
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-end"} />
      <SignIn
        alternativeSideContent={SingInThemeImage}
        signInSubmit={handleClientLogin}
        verifyEmail={handleVerifyEmail}
        loading={loading} 
      />
    </main>
  );
};

export default ClientSignInPage;

