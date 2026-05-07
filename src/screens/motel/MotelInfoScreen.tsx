import React, { useEffect, useState } from "react";
import { 
    View, Text, Pressable, ScrollView, Platform, StatusBar, 
    ActivityIndicator, Modal, TextInput, KeyboardAvoidingView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { MotelInfo } from "../../types/motelTypes";
import motelService from "../../services/motelService";
import ErrorLayout from "../../components/common/ErrorLayout";
import Header from "../../components/common/Header";

export default function MotelInfoScreen({ route, navigation }: any) {
    const { motelId } = route.params;
    const [motelInfo, setMotelInfo] = useState<MotelInfo>();
    const [fetchMotelError, setFetchMotelError] = useState(false);

    // Modal States (Style đồng bộ)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [motelName, setMotelName] = useState("");
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchMotelInfo = async () => {
        try {
            const data = await motelService.getMotelById(motelId);
            setMotelInfo(data);
            setMotelName(data.name); // Set tên mặc định cho input edit
            setFetchMotelError(false);
        } catch (err) {
            console.error("Failed to fetch motel info: ", err);
            setFetchMotelError(true);
        }
    };

    useEffect(() => {
        fetchMotelInfo();
    }, [motelId]);

    const handleUpdateName = async () => {
        if (!motelName.trim()) {
            setUpdateError("Tên nhà trọ không được để trống");
            return;
        }
        try {
            await motelService.updateMotelName(motelId, { newName: motelName });
            setMotelInfo((prev) => prev ? { ...prev, name: motelName } : prev);
            setIsModalVisible(false);
            setUpdateError(null);
        } catch (err) {
            setUpdateError("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    const menuItems = [
        { title: "Quản lý phòng", icon: "door-open", color: "#4F46E5", onPress: () => navigation.navigate("RoomManagement", { motelId }) },
        { title: "Thành viên", icon: "users", color: "#EC4899", onPress: () => navigation.navigate("MemberList", { targetId: motelId, target: "motel", isOwner: true }) },
        { title: "Tin nhắn", icon: "comments", color: "#10B981", onPress: () => navigation.navigate("MessageManagement", { objectId: motelId, objectType: 'motel', motelId }) },
        { title: "Chi phí chung", icon: "hand-holding-dollar", color: "#F59E0B", onPress: () => navigation.navigate("FeeList", { motelId, isOwner: true }) },
        { title: "Hoá đơn tiền trọ", icon: "file-invoice-dollar", color: "#3B82F6", onPress: () => navigation.navigate("InvoiceList", { motelId, isOwner: true }) },
    ];

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            {motelInfo && (
                <Header
                    showBackButton
                    title={motelInfo.name}
                    onBackPress={() => navigation.goBack()}
                    customRightComponent={
                        <Pressable
                            className="bg-indigo-50 w-8 h-8 items-center justify-center rounded-xl active:bg-indigo-100"
                            onPress={() => {
                                setUpdateError(null);
                                setIsModalVisible(true);
                            }}
                        >
                            <FontAwesome6 name="pen" size={16} color="#4F46E5" />
                        </Pressable>
                    }
                />
            )}

            {fetchMotelError ? (
                <ErrorLayout
                    onRetry={fetchMotelInfo}
                    errorMessage="Không thể tải thông tin cơ sở"
                    errorIconName="domain-disabled"
                />
            ) : !motelInfo ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
                >
                    <Text className="text-slate-900 font-bold text-lg mb-4 ml-1">Chức năng quản lý</Text>

                    <View className="flex-row flex-wrap justify-between">
                        {menuItems.map((item, index) => (
                            <View key={index} style={{ width: '48%' }} className="mb-4">
                                <Pressable
                                    onPress={item.onPress}
                                    className="bg-white p-5 rounded-[32px] items-center justify-center border border-slate-100 shadow-sm shadow-slate-200 active:scale-95 transition-all"
                                >
                                    <View 
                                        style={{ backgroundColor: `${item.color}10` }} 
                                        className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                                    >
                                        <FontAwesome6 name={item.icon} size={28} color={item.color} />
                                    </View>
                                    <Text className="text-slate-800 font-bold text-center text-[14px]">
                                        {item.title}
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* EDIT NAME MODAL (Đồng bộ style với các màn hình khác) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
                            {/* Handle Bar */}
                            <View className="absolute top-4 self-center w-12 h-1.5 bg-slate-200 rounded-full" />

                            <View className="flex-row justify-between items-center mb-8">
                                <Text className="text-2xl font-bold text-slate-900">Đổi tên nhà trọ</Text>
                                <Pressable onPress={() => setIsModalVisible(false)}>
                                    <FontAwesome6 name="xmark" size={24} color="#94A3B8" />
                                </Pressable>
                            </View>

                            {updateError && (
                                <Text className="text-rose-600 text-sm mb-5">{updateError}</Text>
                            )}

                            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                Tên nhà trọ mới
                            </Text>
                            <TextInput
                                className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-8 font-semibold text-slate-900"
                                placeholder="Nhập tên mới..."
                                value={motelName}
                                onChangeText={setMotelName}
                                autoFocus={true}
                            />

                            <Pressable
                                onPress={handleUpdateName}
                                className="bg-indigo-600 p-4 rounded-2xl items-center shadow-md shadow-indigo-200 active:bg-indigo-700"
                            >
                                <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}