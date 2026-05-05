import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StatusBar, Platform, FlatList,
    RefreshControl, Pressable, Modal, TextInput,
    KeyboardAvoidingView, Alert,
    TouchableOpacity
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import roomService from "../../services/roomService";
import { RoomInfo } from "../../types/motelTypes";
import Header from "../../components/common/Header";

export default function RoomManagementScreen({ route, navigation }) {
    const { motelId } = route.params;

    const [rooms, setRooms] = useState<RoomInfo[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [updateError, setUpdateError] = useState<string>();
    // Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomInfo | null>(null);

    // Form States
    const [roomName, setRoomName] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await roomService.getRooms(motelId);
            setRooms(data);
        } catch (err) {
            setRooms([]);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRooms().then(() => setRefreshing(false));
    }, []);

    const openAddModal = () => {
        setEditingRoom(null);
        setRoomName("");
        setPrice("");
        setModalVisible(true);
    };

    const openEditModal = (room: RoomInfo) => {
        setEditingRoom(room);
        setRoomName(room.roomNumber);
        setPrice(room.price ? room.price.toString() : "");
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!roomName || !price) {
            setUpdateError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        setUpdateError(undefined);
        try {
            if (editingRoom) {
                await roomService.updateRoom(editingRoom.id, { roomNumber: roomName, price: parseInt(price) });
            } else {
                await roomService.createRoom(motelId, { roomNumber: roomName, price: parseInt(price) });
            }
            setModalVisible(false);
            fetchRooms();
        } catch (err: any) {
            setUpdateError(err.response.data.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                <Header
                    showBackButton
                    title="Quản lý phòng"
                    onBackPress={() => navigation.goBack()}
                />
                {/* LIST */}
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="mx-4 my-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 flex-row items-center overflow-hidden">

                            {/* 1. ICON CÁI CỬA (Bên trái) */}
                            <View className="bg-indigo-50 w-14 h-14 items-center justify-center ml-4 rounded-xl">
                                <FontAwesome6 name="door-open" size={28} color="#4f46e5" />
                            </View>

                            {/* 2. PHẦN THÔNG TIN (Ở giữa) */}
                            <Pressable
                                onPress={() => {openEditModal(item)}}
                                className="flex-1 py-4 px-4"
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.7 : 1,
                                })}
                            >
                                <Text
                                    className="text-slate-900 font-bold text-lg mb-1"
                                    numberOfLines={1}
                                >
                                    {"Phòng " + item.roomNumber}
                                </Text>

                                <View className="flex-row items-center">
                                    <FontAwesome6 name="user-group" size={14} color="#94a3b8" />
                                    <Text className="text-slate-500 text-[13px] font-medium ml-2">
                                        {item.memberCount} thành viên
                                    </Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    Alert.alert("Xác nhận", "Bạn có chắc muốn xoá phòng này?", [
                                        { text: "Hủy", style: "cancel" },
                                        {
                                            text: "Xoá", style: "destructive", onPress: async () => {
                                                try {
                                                    await roomService.deleteRoom(item.id);
                                                    fetchRooms();
                                                } catch (err) {
                                                    Alert.alert("Lỗi", "Không thể xoá phòng này");
                                                }
                                            }
                                        },
                                    ]);
                                }}

                                className="p-4 items-center justify-center active:bg-rose-50"
                            >
                                <View className="bg-rose-50 p-2 rounded-full">
                                    <FontAwesome6 name="trash-can" size={20} color="#f43f5e" />
                                </View>
                            </Pressable>
                        </View>


                    )}
                    contentContainerStyle={{ paddingVertical: 12, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center pt-32 px-10">
                            <View className="bg-slate-100 p-6 rounded-full mb-4">
                                <FontAwesome6 name="door-open" size={48} color="#CBD5E1" />
                            </View>
                            <Text className="text-slate-900 font-bold text-lg">Chưa có phòng</Text>
                            <Text className="text-slate-400 text-center mt-2 leading-5">
                                Hãy bắt đầu bằng cách thêm phòng mới cho dãy trọ này.
                            </Text>
                        </View>
                    }
                />

                {/* ADD/EDIT MODAL */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
                                {/* Modal Handle Bar */}
                                <View className="absolute top-4 self-center w-12 h-1.5 bg-slate-200 rounded-full" />

                                <View className="flex-row justify-between items-center mb-8">
                                    <Text className="text-2xl font-bold text-slate-900">
                                        {editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
                                    </Text>
                                    <Pressable onPress={() => setModalVisible(false)}>
                                        <FontAwesome6 name="xmark" size={24} color="#94A3B8" />
                                    </Pressable>
                                </View>

                                {updateError && (
                                    <Text className="text-rose-600 text-sm mb-5">{updateError}</Text>
                                )}
                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Tên phòng
                                </Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 font-semibold text-slate-900"
                                    placeholder="Ví dụ: Phòng 101"
                                    value={roomName}
                                    onChangeText={setRoomName}
                                />

                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Giá thuê (VNĐ/Tháng)
                                </Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-8 font-semibold text-slate-900"
                                    placeholder="Ví dụ: 3500000"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />

                                <View className="flex-row space-x-4">
                                    <Pressable
                                        onPress={handleSave}
                                        className="flex-1 bg-indigo-600 p-4 rounded-2xl items-center shadow-md shadow-indigo-200"
                                    >
                                        <Text className="text-white font-bold text-lg">
                                            {editingRoom ? "Lưu thay đổi" : "Tạo phòng"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                <TouchableOpacity
                    onPress={openAddModal}
                    className="absolute bottom-8 right-6 w-16 h-16 rounded-full bg-indigo-600 items-center justify-center shadow-2xl shadow-indigo-400 active:scale-95"
                    style={{ elevation: 8 }}
                >
                    <FontAwesome6 name="plus" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}