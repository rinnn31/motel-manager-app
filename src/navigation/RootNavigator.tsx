import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectAuthData, selectIsLoggedIn } from "../features/auth/store/auth.selector";
import { useAppSelector } from "../store/hooks";
import AccountSettingsStack from "./AccountSettingsStack";
import { selectIsAccountVerified } from "../features/account/store/account.selector";
import AppTab from "./AppTab";
import VerificationStack from "./VerificationStack";

export default function RootNavigator() {
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    const isVerified = useAppSelector(selectIsAccountVerified);

    console.log("RootNavigator - isAuthenticated:", isAuthenticated);
    console.log("RootNavigator - isVerified:", isVerified);
    
    if (isAuthenticated && isVerified) {
        return (
            <NavigationContainer>
                <AppTab />
            </NavigationContainer>
        )
    }
    if (isAuthenticated && !isVerified) {
        return (
            <NavigationContainer>
                <VerificationStack />
            </NavigationContainer>
        )
    }
    
    return (
        <NavigationContainer>
            <AuthStack />
        </NavigationContainer>
    )
}