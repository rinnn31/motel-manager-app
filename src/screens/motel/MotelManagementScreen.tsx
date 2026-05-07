import React, { useState, useCallback, useEffect } from "react";
import { 
    LayoutAnimation, View, StatusBar, Platform, Text, Pressable, 
    FlatList, RefreshControl, Modal, TextInput, KeyboardAvoidingView, 
    Alert
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MotelCard from "../../components/modules/motel/MotelCard";
import { MotelInfo } from "../../types/motelTypes";
import motelService from "../../services/motelService";
import Header from "../../components/common/Header";
import ErrorLayout from "../../components/common/ErrorLayout";

export default function MotelManagementScreen({ navigation }) {
    const [motels, setMotels] = useState<MotelInfo[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    
    // Modal States gống RoomManagement
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [motelName, setMotelName] = useState("");
    const [updateError, setUpdateError] = useState<string | null>(null);

    useEffect(() => {
        onRefresh();
    }, []);

    const handleFetchMotels = async () => {
        try {
            const data = await motelService.getAllMotels();
            setMotels(data);
            setError(false);
        } catch (err) {
            setError(true);
            setMotels([]);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleFetchMotels().then(() => setRefreshing(false));
    }, []);

    const handleAddNewMotel = async () => {
        if (!motelName.trim()) {
            setUpdateError("Vui lòng nhập tên nhà trọ");
            return;
        }

        try {
            await motelService.createMotel({ displayName: motelName });
            setMotelName("");
            setIsModalVisible(false);
            setUpdateError(null);
            handleFetchMotels();
        } catch (err: any) {
            setUpdateError(err.response?.data?.message || "Tạo nhà trọ thất bại. Vui lòng thử lại.");
        }
    };

    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xoá nhà trọ này? Hành động này không thể hoàn tác.",
            [
                { text: "Huỷ", style: "cancel" },
                { text: "Xoá", style: "destructive", onPress: async () => {
                    try {
                        await motelService.deleteMotel(id);
                        setMotels((prev) => prev.filter((motel) => motel.id !== id));
                    } catch (err: any) {
                        Alert.alert("Lỗi", err.response?.data?.message || "Xoá nhà trọ thất bại. Vui lòng thử lại.");
                    }
                } }
            ]
        );
    };

    const openAddModal = () => {
        setMotelName("");
        setUpdateError(null);
        setIsModalVisible(true);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                <Header 
                    title="Quản lý nhà trọ"
                    iconName="house"
                    iconColor="#4F46E5"
                    customRightComponent={(
                        <Pressable
                            onPress={openAddModal}
                            className="w-10 h-8 items-center justify-center rounded-full active:bg-gray-100"
                        >
                            <MaterialIcons name="add" size={28} color="#1F2937" />
                        </Pressable>
                    )}
                />

                {error && (
                    <ErrorLayout onRetry={onRefresh} />
                )}

                <FlatList
                    data={motels}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MotelCard 
                            item={item} 
                            onDelete={handleDelete} 
                            onSelect={() => {
                                navigation.navigate("MotelInfo", { motelId: item.id });
                            }} 
                        />
                    )}
                    contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center pt-20 px-10">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="domain-disabled" size={40} color="#cbd5e1" />
                            </View>
                            <Text className="text-slate-900 font-bold text-lg">Danh sách trống</Text>
                            <Text className="text-slate-400 text-center mt-2 leading-5">
                                Bạn chưa quản lý cơ sở nào. Bấm nút + để thêm nhà trọ mới.
                            </Text>
                        </View>
                    }
                />

                {/* MODAL THÊM MỚI THEO STYLE ROOM MANAGEMENT */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
                                {/* Modal Handle Bar */}
                                <View className="absolute top-4 self-center w-12 h-1.5 bg-slate-200 rounded-full" />

                                <View className="flex-row justify-between items-center mb-8">
                                    <Text className="text-2xl font-bold text-slate-900">
                                        Thêm nhà trọ mới
                                    </Text>
                                    <Pressable onPress={() => setIsModalVisible(false)}>
                                        <FontAwesome6 name="xmark" size={24} color="#94A3B8" />
                                    </Pressable>
                                </View>

                                {updateError && (
                                    <Text className="text-rose-600 text-sm mb-5">{updateError}</Text>
                                )}

                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Tên nhà trọ / Khu vực
                                </Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-8 font-semibold text-slate-900"
                                    placeholder="Ví dụ: Nhà trọ Sunshine"
                                    value={motelName}
                                    onChangeText={setMotelName}
                                    autoFocus={true}
                                />

                                <View className="flex-row">
                                    <Pressable
                                        onPress={handleAddNewMotel}
                                        className="flex-1 bg-indigo-600 p-4 rounded-2xl items-center shadow-md shadow-indigo-200 active:bg-indigo-700"
                                    >
                                        <Text className="text-white font-bold text-lg">
                                            Tạo nhà trọ
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            </View>
        </GestureHandlerRootView>
    );
}