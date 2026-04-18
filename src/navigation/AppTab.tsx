import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
const Tab = createBottomTabNavigator();

export default function AppTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeStack" component={HomeStack} />
        </Tab.Navigator>
    )
}