import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectIsLoggedIn } from "../store/auth/authSelectors";
import { useAppSelector } from "../store/hooks";
import { selectIsAccountVerified } from "../store/account/accountSelectors";
import AppTab from "./AppTab";
import VerificationStack from "./VerificationStack";

export default function RootNavigator() {
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    const isVerified = useAppSelector(selectIsAccountVerified);
    
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