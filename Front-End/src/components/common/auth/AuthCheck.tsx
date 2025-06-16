import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { Userinfo } from '../../../store/userSlice';
import AuthService from '../../../services/AuthService';

const AuthCheck = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await AuthService.checkAuthStatus();
                if (response.status === 200) {
                    dispatch(Userinfo({ user: response.data.user }));
                }
            } catch (error) {

                //dispatch(Userinfo({ user: null }));
                console.log("user is not logged in",error)
            }
        };

        verifyAuth();
    }, [dispatch]);

    return null;
};

export default AuthCheck; 