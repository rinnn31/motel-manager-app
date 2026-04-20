import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InputOTPScreen from "../screens/account/InputOtpScreen";
import ChangeNumberScreen from "../screens/account/ChangeNumberScreen";

const Stack = createNativeStackNavigator();

export default function VerificationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InputOTP" component={InputOTPScreen} initialParams={{isFromVerification: true}}/>
            <Stack.Screen name="ChangeNumber" component={ChangeNumberScreen}/>
        </Stack.Navigator>
    );
}