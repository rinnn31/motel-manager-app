import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountSettingsStack from "./AccountSettingsStack";
import MotelStack from "./MotelStack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Platform, View } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();


export default function AppTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                const hideScreens = ["ChangeNumber", "InputOTP", "ChangePassword", "EditName", "EditGender"];

                return {
                    tabBarIcon: ({ focused, color }) => {
                        let iconName = route.name === "Motel" ? "home-work" : "person";
                        return (
                            <MaterialIcons name={iconName} size={focused ? 26 : 24} color={color} />
                        );
                    },
                    tabBarActiveTintColor: "#4F46E5",
                    tabBarInactiveTintColor: "#9CA3AF",
                    headerShown: false,

                    tabBarStyle: {
                        display: hideScreens.includes(routeName) ? 'none' : 'flex',
                        backgroundColor: '#ffffff',
                        height: Platform.OS === 'ios' ? 88 : 64,
                        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#F3F4F6',
                    },

                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    }
                };
            }}
        >
            <Tab.Screen name="Motel" component={MotelStack} options={{tabBarLabel: "Nhà trọ"}}/>
            <Tab.Screen name="Account" component={AccountSettingsStack} options={{tabBarLabel: "Tài khoản"}} />
        </Tab.Navigator>
    );
}