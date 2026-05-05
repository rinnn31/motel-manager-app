import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AccountSettingsScreen from "../screens/account/AccountSettingsScreen";
import ChangeNumberScreen from "../screens/account/ChangeNumberScreen";
import ChangePasswordScreen from "../screens/account/ChangePasswordScreen";
import EditGenderScreen from "../screens/account/EditGenderScreen";
import EditNameScreen from "../screens/account/EditNameScreen";
import InputOTPScreen from "../screens/account/InputOtpScreen";

const Stack = createNativeStackNavigator();

export default function AccountSettingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
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