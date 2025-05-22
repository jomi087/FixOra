
import { BGImage_404 } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import ResetPassword from "../../components/common/Others/ResetPassword";


const ResetPasswordPage: React.FC = () => {
 

    return (
        <>
            <Header className="md:text-start" />
            <div className="flex justify-center items-center min-h-screen " style={{ backgroundImage: BGImage_404 }}>
                <ResetPassword/>
            </div>
        </>
    );
};

export default ResetPasswordPage;