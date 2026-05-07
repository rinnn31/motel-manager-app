import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/account/accountSelectors";
import { navigationRef } from "../navigation/RootNavigator";
import { store } from "../store";
import roomService from "../services/roomService";
import { Alert } from "react-native";
import { RoomInfo } from "../types/motelTypes";

export async function handleNotification(notificationType: string, data: any) {
    if (navigationRef.isReady()) {
        let navigation = navigationRef as any;
        const state = store.getState();
        const user = selectUser(state);
        if (!data) return true;

        console.log("Handling notification of type:", notificationType, "with data:", data);
        switch (notificationType) {
            case "MESSAGE":
                navigation.navigate("Motel", { screen: "MessageView", params: { messageId: data.id } });
                break;
            case "MOTEL_INFO_CHANGED":
            case "MOTEL_FEE_CHANGED":
            case "MOTEL_NAME_CHANGED":
            case "ROOM_INFO_CHANGED":
                navigation.navigate("Motel", { screen: "MotelInfo", params: { motelId: data.motelId } });
                break;
            case "ROOM_MEMBER_CHANGED":
                navigation.navigate("Motel", { 
                    screen:"MemberList", 
                    params: { target: user?.role === "LANDLORD" ? "motel" : "room", targetId: user?.role === "LANDLORD" ? data.motelId : data.roomId, isOwner: user?.role === "LANDLORD" }
                });
                break;
            case "INVOICE_UPDATED":
            case "INVOICE_DELETED":
                let joinedRoom : RoomInfo | undefined = undefined;
                console.log("User role:", user?.role);
                if (user?.role === "TENANT") {
                    try {
                        joinedRoom = await roomService.getRoomById(data.roomId);
                    } catch (error) {
                        console.error("Error fetching joined room for tenant:", error);
                        Alert.alert("Lỗi", "Không thể truy cập thông tin phòng trọ. Vui lòng thử lại sau.");
                        return;
                    }
                }
                navigation.navigate("Motel", {
                    screen: "InvoiceList",
                    params: { motelId: data.motelId, isOwner: user?.role === "LANDLORD", joinedRoom: joinedRoom}
                });
                break;
        }

        return true;
    }

    return false;
}