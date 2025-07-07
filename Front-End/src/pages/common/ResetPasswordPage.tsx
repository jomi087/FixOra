import { BGImage_404 } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import ResetPassword from "../../components/common/auth/ResetPassword";
import { useResetPasswordLogic } from "@/hooks/useResetPasswordLogic";


const ResetPasswordPage: React.FC = () => {
    const { loading, handleSubmit } = useResetPasswordLogic()
    return (
        <>
            <Header className="md:text-start" />
            <div className="flex justify-center items-center min-h-screen " style={{ backgroundImage: BGImage_404 }}>
                <ResetPassword passwordResetbutton={handleSubmit} loading={loading}  />
            </div>
        </>
    );
};

export default ResetPasswordPage;