import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MemberListScreen from "../screens/motel/MemberListScreen";
import MessageManagementScreen from "../screens/message/MessageManagementScreen";
import MessageViewScreen from "../screens/message/MessageViewScreen";
import AddMessageScreen from "../screens/message/AddMessageScreen";
import FeeListScreen from "../screens/motel/FeeListScreen";
import TenantMotelScreen from "../screens/motel/TenantMotelScreen";
import InvoiceListView from "../screens/invoice/InvoiceListScreen";
import InvoiceDetailScreen from "../screens/invoice/InvoiceDetail";

const Stack = createNativeStackNavigator();

export default function TenantMotelStack({ navigation }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="TenantMotelInfo" component={TenantMotelScreen}/>
            <Stack.Screen name="MemberList" component={MemberListScreen} />
            <Stack.Screen name="FeeList" component={FeeListScreen} />
            <Stack.Screen name="MessageManagement" component={MessageManagementScreen} />
            <Stack.Screen name="AddMessage" component={AddMessageScreen} />
            <Stack.Screen name="MessageView" component={MessageViewScreen} />
            <Stack.Screen name="InvoiceList" component={InvoiceListView} />
            <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
        </Stack.Navigator>
    )
}