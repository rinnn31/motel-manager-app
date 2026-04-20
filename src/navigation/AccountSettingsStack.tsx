import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AccountSettingsScreen from "../features/account/screens/AccountSettingsScreen";
import EditNameScreen from "../features/account/screens/EditNameScreen";
import EditGenderScreen from "../features/account/screens/EditGenderScreen";
import ChangeNumberScreen from "../features/account/screens/ChangeNumberScreen";
import InputOTPScreen from "../features/account/screens/InputOtpScreen";
import ChangePasswordScreen from "../features/account/screens/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

export default function AccountSettingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
            <Stack.Screen name="EditName" component={EditNameScreen} />
            <Stack.Screen name="EditGender" component={EditGenderScreen} />
            <Stack.Screen name="ChangeNumber" component={ChangeNumberScreen} />
            <Stack.Screen name="InputOTP" component={InputOTPScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
    )
}