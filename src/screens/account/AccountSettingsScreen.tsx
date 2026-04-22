import React from "react";
import { View, Text, Alert, ScrollView, Pressable, Image, Platform } from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LabelValueSettingItem from "../../components/modules/account/LabelValueSettingItem";
import SettingEntryItem from "../../components/modules/account/SettingEntryItem";
import { selectUser } from "../../store/account/accountSelectors";
import { selectAuthData } from "../../store/auth/authSelectors";
import { logout } from "../../store/auth/authSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import ChooseItemModal from "../../components/common/ChooseItemModal";
import { resolveMedia } from "../../utils/serverMediaResolver";
import accountService from "../../services/accountService";
import { updateProfile } from "../../store/account/accountSlice";
import AppHeader from "../../components/common/AppHeader";
import { hidePhoneNumber } from "../../utils/formats";

export default function AccountSettingsScreen({ navigation }) {
    const user = useAppSelector(selectUser);
    const authData = useAppSelector(selectAuthData);
    const dispatch = useAppDispatch();

    const genderLabel = user?.gender === 0 ? "Nam" : user?.gender === 1 ? "Nữ" : "Khác";

    /* AVATAR PICKER */
    const [isAvatarPickerVisible, setAvatarPickerVisible] = React.useState(false);
    const items = [
        { key: "camera", label: "Chụp ảnh mới", iconName: "camera-alt" },
        { key: "gallery", label: "Chọn từ thư viện", iconName: "photo-library" },
    ];

    const requiredPermissions = async (type: "camera" | "gallery") => {
        let permission;
        if (type === "camera") {
            permission = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        } else {
            permission = Platform.OS === "ios" ?
                PERMISSIONS.IOS.PHOTO_LIBRARY :
                Platform.Version as number >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }

        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
            return true;
        } else {
            const requestResult = await request(permission);
            return requestResult === RESULTS.GRANTED;
        }
    };

    const handleAvatarPicker = async (key: string) => {
        if (!await requiredPermissions(key as "camera" | "gallery")) {
            return;
        }

        const options = {
            width: 512,
            height: 512,
            cropping: true,
        };
        let result: ImageOrVideo;
        try {
            result = key === "camera" ? await ImagePicker.openCamera(options) : await ImagePicker.openPicker(options);
        } catch (err) {
            console.log("ImagePicker Error: ", err);
            return;
        }

        try {
            const avatarKey = await accountService.uploadAvatar(result.path, result.mime);
            dispatch(updateProfile({ avatarUrl: avatarKey }));
        } catch (err) {
            console.error("Failed to upload avatar: ", err);
            Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
        }
    }

    /* LOGOUT & DELETE ACCOUNT */
    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Đăng xuất",
                style: "destructive",
                onPress: () => dispatch(logout({ refreshToken: authData.refreshToken! }))
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
            <AppHeader title="Cài đặt tài khoản" />

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                {/* HEADER: Updated to Flat Square Style */}
                <View className="items-center mb-8 mt-4">
                    <Pressable
                        onPress={() => setAvatarPickerVisible(true)}
                        className="w-24 h-24 bg-white items-center justify-center border border-gray-200 active:opacity-80 rounded"
                    >
                        {user?.avatarUrl ? (
                            <Image
                                source={{ uri: resolveMedia(user.avatarUrl) }}
                                style={{ width: '100%', height: '100%' }} // Dùng style trực tiếp cho chắc chắn
                                resizeMode="cover"
                                onLoadStart={() => console.log("Bắt đầu tải:", resolveMedia(user?.avatarUrl!))}
                                onError={(e) => console.log("Lỗi tải ảnh:", e.nativeEvent.error)}
                            />
                        ) : (
                            <FontAwesome name="user" size={40} color="#4F46E5" />
                        )}

                        {/* Edit Overlay Label */}
                        <View className="absolute bottom-0 w-full bg-black/40 py-1">
                            <Text className="text-[10px] text-white text-center font-bold">SỬA</Text>
                        </View>
                    </Pressable>

                    <Text className="text-xl font-bold text-gray-900 mt-4">
                        {user?.fullName || "Người dùng"}
                    </Text>
                </View>

                {/* SECTION: INFO */}
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                    Thông tin tài khoản
                </Text>
                <View className="bg-white border border-gray-100 mb-6">
                    <LabelValueSettingItem
                        label="Số điện thoại"
                        value={hidePhoneNumber(user?.phoneNumber || "")}
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
                <View className="bg-white border border-gray-100 mb-6">
                    <Pressable
                        onPress={() => navigation.navigate("ChangePassword")}
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
                <View className="bg-white border border-gray-100">
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
            <ChooseItemModal
                visible={isAvatarPickerVisible}
                title="Cập nhật ảnh đại diện"
                actions={items}
                onItemSelected={handleAvatarPicker}
                onClose={() => setAvatarPickerVisible(false)}
            />

        </View>
    );
}