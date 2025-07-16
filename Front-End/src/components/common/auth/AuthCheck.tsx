import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { logout, Userinfo } from '../../../store/userSlice';
import AuthService from '../../../services/AuthService';

const AuthCheck = ({ onComplete }: { onComplete: () => void }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await AuthService.checkAuthStatusApi();
                if (response.status === 200) {
                    dispatch(Userinfo({ user: response.data.user }));
                }
            } catch (error) {
                dispatch(logout());
                console.log("user is not logged in",error)
            } finally {
                onComplete(); 
            }
        };
        verifyAuth();
    }, [dispatch]);

    return null;
};

export default AuthCheck; 