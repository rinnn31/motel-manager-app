import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectAuthData, selectIsLoggedIn } from "../store/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectAccountError, selectIsAccountLoading, selectIsAccountVerified, selectUser } from "../store/account/accountSelectors";
import AppTab from "./AppTab";
import VerificationStack from "./VerificationStack";
import { use, useEffect, useRef } from "react";
import { fetchUserInfo } from "../store/account/accountSlice";
import { ActivityIndicator, Alert, View } from "react-native";
import ErrorLayout from "../components/common/ErrorLayout";
import messaging from "@react-native-firebase/messaging";
import authService from "../services/authService";
import { handleNotification } from "../utils/notificationHandler";

export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    const authData = useAppSelector(selectAuthData);
    const userData = useAppSelector(selectUser);
    const isAccountLoading = useAppSelector(selectIsAccountLoading);
    const hasLoadingAccountError = useAppSelector(selectAccountError);

    const fcmTokenRef = useRef<string | null>(null);
    const pendingNotificationRef = useRef<any>(null);

    const handleNotificationClick = async (remoteMessage: any) => {
        if (!remoteMessage || !remoteMessage.data) return;
        try {
            const type = pendingNotificationRef.current.data?.type;
            const payload = JSON.parse(pendingNotificationRef.current.data?.payload || "{}");

            if (await handleNotification(type, payload)) pendingNotificationRef.current = null;
        } catch (error) {
            console.error("Error handling notification click:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
            if (isAuthenticated && userData?.isVerified) {
                handleNotificationClick(remoteMessage);
            } else {
                pendingNotificationRef.current = remoteMessage;
            }
        })
        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                if (isAuthenticated && userData?.isVerified) {
                    handleNotificationClick(remoteMessage);
                } else {
                    pendingNotificationRef.current = remoteMessage;
                }
            }
        });

        return unsubscribe;
    }, [isAuthenticated, userData?.isVerified]);

    useEffect(() => {
        if (isAuthenticated && userData?.isVerified && pendingNotificationRef.current) {
            const timer = setTimeout(() => {
                handleNotificationClick(pendingNotificationRef.current);
            }, 1000);
            return () => clearTimeout(timer);
        }

    }, [isAuthenticated, userData?.isVerified]);

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
            if (authData && token && token !== fcmTokenRef.current) {
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
    }, [authData]);

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
        <NavigationContainer ref={navigationRef}> 
            {content}
        </NavigationContainer>
    );
    
}