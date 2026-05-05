import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectAuthData, selectIsLoggedIn } from "../store/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectAccountError, selectIsAccountLoading, selectIsAccountVerified, selectUser } from "../store/account/accountSelectors";
import AppTab from "./AppTab";
import VerificationStack from "./VerificationStack";
import { useEffect, useRef } from "react";
import { fetchUserInfo } from "../store/account/accountSlice";
import { ActivityIndicator, View } from "react-native";
import ErrorLayout from "../components/common/ErrorLayout";
import messaging from "@react-native-firebase/messaging";
import authService from "../services/authService";

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    const authData = useAppSelector(selectAuthData);
    const userData = useAppSelector(selectUser);
    const isAccountLoading = useAppSelector(selectIsAccountLoading);
    const hasLoadingAccountError = useAppSelector(selectAccountError);

    const fcmTokenRef = useRef<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && !userData) {
            dispatch(fetchUserInfo());
        }
    }, [isAuthenticated, userData]);
    
    useEffect(() => {
        const fetchFCMToken = async () => {
            if (authData === null) return;
            try {
                await messaging().requestPermission();
                const token = await messaging().getToken();
                if (token && token !== fcmTokenRef.current) {
                    fcmTokenRef.current = token;
                    await authService.registerDeviceToken({
                        sessionToken: authData!.refreshToken!,
                        deviceToken: token
                    });
                }
            } catch (error) {
                console.error("Error fetching FCM token:", error);
            }
        }
        fetchFCMToken();
    }, [authData]);

    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh(async (token) => {
            if (userData && token && token !== fcmTokenRef.current) {
                fcmTokenRef.current = token;
                try {
                    await authService.registerDeviceToken({
                        sessionToken: authData!.refreshToken!,
                        deviceToken: token
                    });
                } catch (error) {
                    console.error("Error updating FCM token:", error);
                }
            }
        });

        return () => {
            unsubscribe();
        }   
    }, [authData, userData]);

    useEffect(() => {
        if (!isAuthenticated) {
            messaging()
                .deleteToken()
                .then(() => {
                    fcmTokenRef.current = null;
                    console.log("FCM token deleted");
                })
                .catch(() => {});
        }
    }, [isAuthenticated]);

    let content;

    if (!isAuthenticated) {
        content = <AuthStack />;
    }else if (isAccountLoading || !userData) {
        content = (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        )
    } else if (hasLoadingAccountError) {
        content = (
            <ErrorLayout
                onRetry={() => dispatch(fetchUserInfo())}
                errorMessage="Không thể tải thông tin người dùng"
                errorIconName="error"
            />
        )
    } else if (!userData?.isVerified) {
        content = <VerificationStack/>
    } else {
        content = <AppTab />;
    }
    
    return (
        <NavigationContainer>
            {content}
        </NavigationContainer>
    );
    
}