import Header from "@/components/common/layout/Header";
import VerifictionForm from "@/components/client/providersSection/providerApplication/VerifictionForm";
import { BGImage_404 } from "@/utils/constant";
import { useState } from "react";
import VerifyProfile from "@/components/client/providersSection/providerApplication/VerifyProfile";


const VerifictionPage = () => {
  const [next,setNext] = useState(false);
  return (
    <>
      <div className = 'flex flex-col items-center min-h-screen sm:px-4  bg-cover bg-center overflow-auto' style = {{ backgroundImage: BGImage_404 }}>
        <Header className={"md:text-start"} />
        <div className="w-full max-w-lg bg-primary-foreground text-primary p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl my-10 shadow-xl shadow-black " >
          <h1 className="text-xl sm:text-2xl text-center font-semibold font-mono pb-5">
            VERIFICATION FORM
          </h1>
          { next ?
            <VerifictionForm toggle={setNext}/>   // Form created with React-hook-form 
            :
            <VerifyProfile toggle={setNext}  />
          }
        </div>
      </div>
    </>

  );
};

export default VerifictionPage;