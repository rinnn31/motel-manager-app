import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditGenderScreen from "../screens/account/EditGenderScreen";

const Stack = createNativeStackNavigator();

export default function MotelStack({ navigation }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="MotelList" component={EditGenderScreen} />
        </Stack.Navigator>
    )
}