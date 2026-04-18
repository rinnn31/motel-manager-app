import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";
import ResetPasswordPhoneScreen from "../features/auth/screens/ResetPasswordPhoneScreen";
import ResetPasswordOtpScreen from "../features/auth/screens/ResetPasswordOtpScreen";
import ResetPasswordNewPassScreen from "../features/auth/screens/ResetPasswordNewPassScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {    
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="ResetPasswordPhone" component={ResetPasswordPhoneScreen}/>
            <Stack.Screen name="ResetPasswordOtp" component={ResetPasswordOtpScreen}/> 
            <Stack.Screen name="ResetPasswordNewPass" component={ResetPasswordNewPassScreen}/>
        </Stack.Navigator>
    );

}