import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView, Platform, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { MotelInfo } from "../../types/motelTypes";
import motelService from "../../services/motelService";
import ErrorLayout from "../../components/common/ErrorLayout";
import MotelNameModal from "../../components/modules/motel/MotelNameModal";
import Header from "../../components/common/Header";

export default function MotelInfoScreen({ route, navigation }: any) {
    const { motelId } = route.params;
    const [motelInfo, setMotelInfo] = React.useState<MotelInfo>();
    const [fetchMotelError, setFetchMotelError] = React.useState(false);

    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [updateNameError, setUpdateNameError] = React.useState<string>();

    const handleUpdateMotelName = async (newName: string) => {
        try {
            await motelService.updateMotelName(motelId, { newName: newName });
            setMotelInfo((prev) => prev ? { ...prev, name: newName } : prev);
            setIsModalVisible(false);
        } catch (err) {
            setUpdateNameError("Cập nhật tên thất bại. Vui lòng thử lại.");
        }
    };

    const fetchMotelInfo = async () => {
        try {
            const data = await motelService.getMotelById(motelId);
            setMotelInfo(data);
            setFetchMotelError(false);
        } catch (err) {
            console.error("Failed to fetch motel info: ", err);
            setMotelInfo(undefined);
            setFetchMotelError(true);
        }
    };

    useEffect(() => {
        fetchMotelInfo();
    }, [motelId]);

    const menuItems = [
        { title: "Quản lý phòng", icon: "door-open", color: "#4F46E5", onPress: () => navigation.navigate("RoomManagement", { motelId }) },
        { title: "Thành viên", icon: "users", color: "#EC4899", onPress: () => navigation.navigate("MemberList", { targetId: motelId, target: "motel", isOwner: true }) },
        { title: "Tin nhắn", icon: "comments", color: "#10B981", onPress: () => navigation.navigate("MessageManagement", { objectId: motelId, objectType: 'motel', motelId }) },
        { title: "Quản lý chi phí chung", icon: "hand-holding-dollar", color: "#F59E0B", onPress: () => navigation.navigate("FeeList", { motelId, isOwner: true }) },
        { title: "Quản lí hoá đơn tiền trọ", icon: "file-invoice-dollar", color: "#3B82F6", onPress: () => navigation.navigate("InvoiceList", { motelId, isOwner: true }) },
    ];

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            <SafeAreaView edges={['top']}>
                {motelInfo &&
                    <Header
                        showBackButton
                        title={motelInfo.name}
                        onBackPress={() => navigation.goBack()}
                        customRightComponent={
                            <Pressable
                                className="bg-slate-100 p-3 rounded-2xl active:bg-slate-200"
                                onPress={() => setIsModalVisible(true)}
                            >
                                <FontAwesome6 name="pen" size={20} color="#4F46E5" />
                            </Pressable>
                        }
                    />
                }
            </SafeAreaView>

            {fetchMotelError ? (
                <ErrorLayout
                    onRetry={fetchMotelInfo}
                    errorMessage="Không thể tải thông tin cơ sở"
                    errorIconName="domain-disabled"
                />
            ) : (
                motelInfo === undefined ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                ) : (

                    <ScrollView
                        className="flex-1 px-4 mt-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-slate-900 font-bold text-lg ml-2 mb-4">Chức năng</Text>

                        <View className="flex-row flex-wrap">
                            {menuItems.map((item, index) => (
                                <View className="w-1/2 p-2">
                                    <Pressable
                                        onPress={item.onPress}
                                        className="bg-white p-6 rounded-3xl items-center justify-center border border-slate-100 shadow-sm active:bg-slate-50"
                                    >
                                        <View style={{ backgroundColor: `${item.color}15` }} className="p-4 rounded-2xl mb-3">
                                            <FontAwesome6 name={item.icon} size={30} color={item.color} />
                                        </View>
                                        <Text className="text-slate-900 font-bold text-center">{item.title}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>

                        <View className="h-20" />
                    </ScrollView>
                )
            )}

            <MotelNameModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleUpdateMotelName}
                error={updateNameError}
                isAddMode={false}
            />
        </View>
    );
}