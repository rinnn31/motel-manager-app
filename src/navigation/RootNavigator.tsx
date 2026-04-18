import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { selectIsLoggedIn } from "../features/auth/store/auth.selector";
import { useAppSelector } from "../store/hooks";
import AppTab from "./AppTab";

export default function RootNavigator() {
    const isAuthenticated = useAppSelector(selectIsLoggedIn);
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppTab /> : <AuthStack />}
        </NavigationContainer>
    )
}