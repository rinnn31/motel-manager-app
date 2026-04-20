import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import storageService from "./services/storageService";
import { setHydrate } from "./store/auth/authSlice";
import { AUTH_DATA_KEY } from "./constants/storage.constants";
import accountService from "./services/accountService";
import { updateProfile } from "./store/account/accountSlice";

export default function AppBootstrap({ children }) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const authData = await storageService.getItem(AUTH_DATA_KEY);
            console.log("AppBootstrap - Loaded auth data from storage:", authData);
            try {
                if (authData?.accessToken && authData?.userId && authData?.refreshToken) { 
                    await dispatch(setHydrate({
                        refreshToken: authData.refreshToken,
                        accessToken: authData.accessToken,
                        userId: authData.userId,
                    }));

                    const userInfo = await accountService.getUserInfo();
                    // Update profile to trigger token refresh if access token is expired
                    await dispatch(updateProfile(userInfo));
                }
                
            } catch (error) {
                // Load user info failed, clear auth data to force re-login
                await storageService.removeItem(AUTH_DATA_KEY);
                await dispatch(setHydrate({
                    refreshToken: null,
                    accessToken: null,
                    userId: null,
                }));
            }
            
            setLoading(false);
        };

        init();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return children;
}