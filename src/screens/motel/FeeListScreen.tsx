import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StatusBar, Platform, FlatList,
    RefreshControl, Pressable, Modal, TextInput,
    KeyboardAvoidingView, Alert
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import feeService from "../../services/feeService"; // Giả định đường dẫn import
import { FeeInfo } from "../../types/motelTypes"; // Giả định đường dẫn import
import Header from "../../components/common/Header";

// Danh sách các cách tính phí
const CALCULATION_TYPES = [
    { id: "PER_PERSON", label: "Theo người" },
    { id: "PER_UNIT", label: "Theo đơn vị" },
    { id: "FIXED", label: "Cố định" },
];

export default function FeeListScreen({ route, navigation }: any) {
    const { motelId, isOwner } = route.params;

    const [fees, setFees] = useState<FeeInfo[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Modal States
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
    const [selectedFee, setSelectedFee] = useState<FeeInfo | null>(null);

    // Form States
    const [name, setName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [calculationType, setCalculationType] = useState("PER_UNIT");

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const data = await feeService.getAllFees(motelId);
            setFees(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách phí:", err);
            Alert.alert("Lỗi", "Không thể tải danh sách phí.");
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFees().finally(() => setRefreshing(false));
    }, []);

    // --- Modal Handlers ---

    const openAddModal = () => {
        setModalType("add");
        setSelectedFee(null);
        setName("");
        setUnitPrice("");
        setCalculationType("PER_UNIT"); // Default
        setModalVisible(true);
    };

    const openEditModal = (fee: FeeInfo) => {
        setModalType("edit");
        setSelectedFee(fee);
        setName(fee.name); // Không cho sửa nhưng vẫn hiển thị
        setUnitPrice(fee.unitPrice.toString());
        setCalculationType(fee.calculationType);
        setModalVisible(true);
    };

    const handleDelete = (feeId: string) => {
        Alert.alert(
            "Xác nhận xoá",
            "Bạn có chắc chắn muốn xoá loại phí này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xoá",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await feeService.deleteFee(feeId);
                            fetchFees();
                        } catch (err) {
                            Alert.alert("Lỗi", "Không thể xoá phí này.");
                        }
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        if (!unitPrice || !calculationType || (modalType === "add" && !name)) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const priceNum = parseInt(unitPrice, 10);
        if (isNaN(priceNum) || priceNum < 0) {
            Alert.alert("Lỗi", "Đơn giá không hợp lệ.");
            return;
        }

        try {
            if (modalType === "add") {
                await feeService.addFee(motelId, {
                    name,
                    unitPrice: priceNum,
                    calculationType
                });
            } else if (modalType === "edit" && selectedFee) {
                await feeService.updateFee(selectedFee.id, {
                    unitPrice: priceNum,
                    calculationType
                });
            }
            setModalVisible(false);
            fetchFees();
        } catch (err) {
            Alert.alert("Lỗi", "Không thể lưu thông tin phí.");
        }
    };

    // --- Renders ---

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN") + "đ";
    };

    const getCalcTypeLabel = (type: string) => {
        return CALCULATION_TYPES.find(t => t.id === type)?.label || type;
    };

    const renderFeeItem = ({ item }: { item: FeeInfo }) => (
        <View className="bg-white border border-slate-100 rounded-2xl mx-6 mb-4 p-5 shadow-sm shadow-slate-200/50">
            <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-4">
                    <Text className="text-lg font-bold text-slate-900 mb-1">{item.name}</Text>
                    <View className="flex-row items-center mb-1">
                        <FontAwesome6 name="dollar-sign" size={16} color="#64748B" />
                        <Text className="text-slate-600 font-semibold ml-2">
                            {formatCurrency(item.unitPrice)}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome6 name="calculator" size={16} color="#64748B" />
                        <Text className="text-slate-500 text-sm ml-2">
                            Cách tính: <Text className="font-medium text-slate-700">{getCalcTypeLabel(item.calculationType)}</Text>
                        </Text>
                    </View>
                </View>

                {isOwner && (
                    <View className="flex-column items-center gap-y-2">
                        <Pressable
                            onPress={() => openEditModal(item)}
                            className="p-3 bg-indigo-50 rounded-full"
                        >
                            <FontAwesome6 name="pen" size={15} color="#4F46E5" />
                        </Pressable>
                        <Pressable
                            onPress={() => handleDelete(item.id)}
                            className="p-2 bg-red-50 rounded-full"
                        >
                            <FontAwesome6 name="trash-can" size={20} color="#EF4444" />
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                {/* HEADER */}
                <Header
                    showBackButton
                    title="Danh sách phí chung"
                    onBackPress={() => navigation.goBack()}
                />

                {/* LIST */}
                <FlatList
                    data={fees}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFeeItem}
                    contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center pt-24 px-10">
                            <View className="bg-slate-100 p-6 rounded-full mb-4">
                                <FontAwesome6 name="receipt" size={48} color="#CBD5E1" />
                            </View>
                            <Text className="text-slate-900 font-bold text-lg">Chưa có khoản phí nào</Text>
                            <Text className="text-slate-400 text-center mt-2 leading-5">
                                {isOwner
                                    ? "Nhấn vào nút '+' ở góc trên để thêm phí điện, nước, rác..."
                                    : "Chủ trọ chưa thiết lập các khoản phí chung."}
                            </Text>
                        </View>
                    }
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
                                <View className="absolute top-4 self-center w-12 h-1.5 bg-slate-200 rounded-full" />

                                <View className="flex-row justify-between items-center mb-8">
                                    <Text className="text-2xl font-bold text-slate-900">
                                        {modalType === "add" ? "Thêm phí mới" : "Chỉnh sửa phí"}
                                    </Text>
                                    <Pressable onPress={() => setModalVisible(false)} className="p-1">
                                        <FontAwesome6 name="xmark" size={24} color="#94A3B8" />
                                    </Pressable>
                                </View>

                                {/* TÊN PHÍ */}
                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Tên loại phí
                                </Text>
                                <TextInput
                                    className={`border border-slate-100 p-4 rounded-2xl mb-5 font-semibold text-slate-900 ${modalType === "edit" ? "bg-slate-100 text-slate-500" : "bg-slate-50"
                                        }`}
                                    placeholder="Ví dụ: Phí rác sinh hoạt"
                                    value={name}
                                    onChangeText={setName}
                                    editable={modalType === "add"} // Chỉ cho phép sửa khi thêm mới
                                />

                                {/* ĐƠN GIÁ */}
                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Đơn giá (VNĐ)
                                </Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6 font-semibold text-slate-900"
                                    placeholder="Ví dụ: 50000"
                                    keyboardType="numeric"
                                    value={unitPrice}
                                    onChangeText={setUnitPrice}
                                />

                                {/* CÁCH TÍNH */}
                                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 ml-1">
                                    Cách tính phí
                                </Text>
                                <View className="flex-row flex-wrap space-x-2 space-y-2 mb-8 items-center gap-5">
                                    {/* Dummy view to push the first pill to the right spot since space-x/y applies margin */}
                                    <View className="hidden" />
                                    {CALCULATION_TYPES.map((type) => {
                                        const isSelected = calculationType === type.id;
                                        return (
                                            <Pressable
                                                key={type.id}
                                                onPress={() => setCalculationType(type.id)}
                                                className={`px-4 py-3 rounded-xl border ${isSelected
                                                    ? "bg-indigo-50 border-indigo-200"
                                                    : "bg-white border-slate-200"
                                                    }`}
                                            >
                                                <Text className={`font-semibold ${isSelected ? "text-indigo-700" : "text-slate-600"
                                                    }`}>
                                                    {type.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                {/* NÚT LƯU */}
                                <Pressable
                                    onPress={handleSave}
                                    className="bg-indigo-600 p-4 rounded-2xl items-center shadow-md shadow-indigo-200"
                                >
                                    <Text className="text-white font-bold text-lg">
                                        {modalType === "add" ? "Tạo phí" : "Lưu thay đổi"}
                                    </Text>
                                </Pressable>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {isOwner && (
                    <Pressable
                        onPress={() => openAddModal()}
                        className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 items-center justify-center rounded-full shadow-lg shadow-indigo-400"
                    >
                        <FontAwesome6 name="plus" size={24} color="white" />
                    </Pressable>
                )}

            </View>
        </GestureHandlerRootView>
    );
}