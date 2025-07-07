import ResetPassword from "../../components/common/auth/ResetPassword";
import Nav from "@/components/common/layout/Nav";
import { useChangePasswordLogic } from "@/hooks/useChangePasswordLogic ";


const ChangePasswordPage: React.FC = () => {
    const { loading, handleSubmit } =  useChangePasswordLogic()

    return (
        <>
            <Nav className='bg-nav-background text-nav-text' />
            <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background  justify-center items-center">
                <ResetPassword passwordResetbutton={handleSubmit} loading={loading}  />
            </div>
        </>
    );
};

export default ChangePasswordPage;