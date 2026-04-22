import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectIsLoggedIn } from "../store/auth/authSelectors";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectAccountError, selectIsAccountLoading, selectIsAccountVerified, selectUser } from "../store/account/accountSelectors";
import AppTab from "./AppTab";
import VerificationStack from "./VerificationStack";
import { useEffect } from "react";
import { fetchUserInfo } from "../store/account/accountSlice";
import { ActivityIndicator, View } from "react-native";
import ErrorLayout from "../components/common/ErrorLayout";

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    const userData = useAppSelector(selectUser);
    const isAccountLoading = useAppSelector(selectIsAccountLoading);
    const hasLoadingAccountError = useAppSelector(selectAccountError);

    useEffect(() => {
        if (isAuthenticated && !userData) {
            dispatch(fetchUserInfo());
        }
    }, [isAuthenticated, userData]);
    
    if (!isAuthenticated) {
        return (
            <NavigationContainer>
                <AuthStack />
            </NavigationContainer>
        )
    }

    if (isAccountLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        )
    }

    if (hasLoadingAccountError) {
        return (
            <ErrorLayout
                onRetry={() => dispatch(fetchUserInfo())}
                errorMessage="Không thể tải thông tin người dùng"
                errorIconName="error"
            />
        )
    }

    if (!userData?.isVerified) {
        return (
            <NavigationContainer>
                <VerificationStack/>
            </NavigationContainer>
        )
    }
    
    return (
        <NavigationContainer>
            <AppTab />
        </NavigationContainer>
    );
    
}