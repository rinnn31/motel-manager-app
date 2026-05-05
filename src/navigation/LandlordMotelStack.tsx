import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MotelManagementScreen from "../screens/motel/MotelManagementScreen";
import MotelInfoScreen from "../screens/motel/MotelInfoScreen";
import MemberListScreen from "../screens/motel/MemberListScreen";
import MessageManagementScreen from "../screens/message/MessageManagementScreen";
import MessageViewScreen from "../screens/message/MessageViewScreen";
import AddMessageScreen from "../screens/message/AddMessageScreen";
import RoomManagementScreen from "../screens/motel/RoomManagementScreen";
import FeeListScreen from "../screens/motel/FeeListScreen";
import InvoiceListView from "../screens/invoice/InvoiceListScreen";
import InvoiceDetailScreen from "../screens/invoice/InvoiceDetail";
import CreateInvoiceScreen from "../screens/invoice/CreateInvoiceScreen";

const Stack = createNativeStackNavigator();

export default function LandlordMotelStack({ navigation }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="MotelManagement" component={MotelManagementScreen}/>
            <Stack.Screen name="MotelInfo" component={MotelInfoScreen}/>
            <Stack.Screen name="MemberList" component={MemberListScreen} />
            <Stack.Screen name="FeeList" component={FeeListScreen} />
            <Stack.Screen name="MessageManagement" component={MessageManagementScreen} />
            <Stack.Screen name="AddMessage" component={AddMessageScreen} />
            <Stack.Screen name="MessageView" component={MessageViewScreen} />
            <Stack.Screen name="RoomManagement" component={RoomManagementScreen} />
            <Stack.Screen name="InvoiceList" component={InvoiceListView} />
            <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
            <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        </Stack.Navigator>
    )
}