import React from "react";
import { View, Text, Alert, ScrollView, Pressable } from "react-native";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { selectUser } from "../store/account.selector";
import { logout } from "../../auth/store/auth.slice"; // Giả sử đường dẫn này
import LabelValueSettingItem from "../components/LabelValueSettingItem";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { selectAuthData } from "../../auth/store/auth.selector";
import SettingEntryItem from "../components/SettingEntryItem";

export default function AccountSettingsScreen({ navigation }) {
    const user = useAppSelector(selectUser);
    const authData = useAppSelector(selectAuthData);
    const dispatch = useAppDispatch();

    const maskPhone = (phone: string) => {
        if (!phone) return "";
        return "*** *** " + phone.slice(-3);
    };

    const genderLabel =
        user?.gender === 0 ? "Nam" : user?.gender === 1 ? "Nữ" : "Khác";

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Đăng xuất", 
                style: "destructive", 
                onPress: () => dispatch(logout({refreshToken: authData.refreshToken!}))
            },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Xoá tài khoản",
            "Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xoá vĩnh viễn.",
            [
                { text: "Hủy" },
                {
                    text: "Xoá vĩnh viễn",
                    style: "destructive",
                    onPress: () => console.log("delete request"),
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                {/* HEADER */}
                <View className="items-center mb-6 mt-4">
                    <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-2 border border-indigo-100">
                        <FontAwesome name="user" size={36} color="#4F46E5" />
                    </View>
                    <Text className="text-xl font-bold text-gray-900">
                        {user?.fullName || "Người dùng"}
                    </Text>
                </View>

                {/* SECTION: INFO */}
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                    Thông tin tài khoản
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
                    <LabelValueSettingItem
                        label="Số điện thoại"
                        value={maskPhone(user?.phoneNumber || "")}
                        onPress={() => navigation.navigate("ChangeNumber", { isFromVerification: false })}
                    />
                    <LabelValueSettingItem
                        label="Họ tên"
                        value={user?.fullName || ""}
                        onPress={() => navigation.navigate("EditName")}
                    />
                    <LabelValueSettingItem
                        label="Giới tính"
                        value={genderLabel}
                        onPress={() => navigation.navigate("EditGender")}
                    />
                </View>

                {/* SECTION: SECURITY */}
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                    Bảo mật
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
                <Pressable 
                        onPress={handleLogout}
                        className="flex-row items-center justify-between px-4 py-4 active:bg-gray-50 border-b border-gray-50"
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons name="password" size={22} color="#4B5563" />
                            <Text className="ml-3 text-gray-700 font-medium">Đổi mật khẩu</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                    </Pressable>
                </View>

                {/* SECTION: ACTIONS */}
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                    Hệ thống
                </Text>
                <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <SettingEntryItem 
                        label="Đăng xuất"
                        materialIconName="logout"
                        onPress={handleLogout}
                    />

                    <SettingEntryItem 
                        label="Xoá tài khoản"
                        materialIconName="delete-outline"
                        onPress={handleDeleteAccount}
                        materialIconColor="#EF4444"
                        labelColor="#EF4444"
                    />
                </View>

                <Text className="text-[10px] text-gray-400 text-center mt-8 uppercase tracking-widest">
                    Phiên bản 1.0.0
                </Text>

            </ScrollView>
        </View>
    );
}