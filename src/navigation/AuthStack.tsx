import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetPasswordPhoneScreen from "../screens/auth/ResetPasswordPhoneScreen";
import ResetPasswordOtpScreen from "../screens/auth/ResetPasswordOtpScreen";
import ResetPasswordNewPassScreen from "../screens/auth/ResetPasswordNewPassScreen";

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