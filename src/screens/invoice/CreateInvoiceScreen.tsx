import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    TextInput, StatusBar, Platform, Alert, KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import feeService from "../../services/feeService";
import Header from '../../components/common/Header';
import invoiceService from '../../services/invoiceService';
import { InvoiceDetail } from '../../types/motelTypes';

const CALC_TYPES = [
    { label: 'Cố định', value: 'FIXED', icon: 'push-pin' },
    { label: 'Theo người', value: 'PER_PERSON', icon: 'people' },
    { label: 'Số lượng', value: 'PER_UNIT', icon: 'straighten' },
];

export default function CreateInvoiceScreen({ route, navigation }: any) {
    const { motelId, rooms } = route.params || {};

    const [availableFees, setAvailableFees] = useState<any[]>([]); // Lưu trữ phí gốc từ API
    const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [showRoomSelect, setShowRoomSelect] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const fees = await feeService.getAllFees(motelId);
            setAvailableFees(fees);
        } catch (err) {
            Alert.alert("Lỗi", "Không thể tải danh sách phí");
        }
    };

    // Mỗi khi chọn phòng, render lại danh sách các khoản phí
    useEffect(() => {
        if (selectedRoomId) {
            const selectedRoom = rooms?.find((r: any) => r.id === selectedRoomId);

            // 1. Khoản tiền phòng (Cố định)
            const roomFee = {
                id: 'ROOM_PRICE', // ID đặc biệt để nhận diện
                name: "Tiền thuê phòng",
                unitPrice: selectedRoom?.price || 0,
                calculationType: 'FIXED',
                quantity: 1,
                selected: true,
                isSystem: true // Đánh dấu là khoản hệ thống, không cho sửa tên/giá
            };

            // 2. Định dạng lại các khoản phí từ API
            const formattedFees = availableFees.map((f: any) => ({
                id: f.id,
                name: f.name,
                unitPrice: f.unitPrice,
                calculationType: f.calculationType || 'FIXED',
                quantity: 1,
                selected: false,
                isSystem: true // Phí từ danh sách cũng không cho sửa giá
            }));

            setInvoiceItems([roomFee, ...formattedFees]);
        }
    }, [selectedRoomId, availableFees]);

    const handleSelectRoom = (id: string) => {
        setSelectedRoomId(id);
        setShowRoomSelect(false);
    };

    const handleCreateInvoice = async () => {
        if (!selectedRoomId) {
            Alert.alert("Lỗi", "Vui lòng chọn phòng áp dụng");
            return;
        }
        if (invoiceItems.filter(item => item.selected).length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất một khoản phí");
            return;
        }
        setIsCreating(true);
        try {
            await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Giả lập delay

            const details: InvoiceDetail[] = invoiceItems
                .filter(item => item.selected)
                .map(item => ({
                    name: item.name,
                    unitPrice: item.unitPrice,
                    calculationType: item.calculationType,
                    amount: item.calculationType === 'FIXED' ? 1 : item.quantity
                }));
            await invoiceService.createInvoice(selectedRoomId!, { details });
            Alert.alert("Thành công", "Hóa đơn đã được tạo");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Lỗi", "Không thể tạo hóa đơn");
        } finally {
            setIsCreating(false);
        }
    };


    const toggleSelectFee = (index: number) => {
        const newItems = [...invoiceItems];
        // Không cho phép bỏ chọn Tiền phòng
        if (newItems[index].id === 'ROOM_PRICE') return;

        newItems[index].selected = !newItems[index].selected;
        setInvoiceItems(newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...invoiceItems];
        if (field === 'name') {
            newItems[index][field] = value;
        } else if (field === 'calculationType') {
            newItems[index][field] = value;
            if (value === 'FIXED') newItems[index].quantity = 1;
        } else {
            newItems[index][field] = parseFloat(value) || 0;
        }
        setInvoiceItems(newItems);
    };

    const addNewCustomFee = () => {
        setInvoiceItems([...invoiceItems, {
            id: `CUSTOM_${Date.now()}`,
            name: "Phí phát sinh",
            unitPrice: 0,
            calculationType: 'FIXED',
            quantity: 1,
            selected: true,
            isSystem: false // Phí thủ công cho phép sửa tên và giá
        }]);
    };

    const totalAmount = invoiceItems
        .filter(item => item.selected)
        .reduce((sum, item) => {
            const q = item.calculationType === 'FIXED' ? 1 : item.quantity;
            return sum + (q * item.unitPrice);
        }, 0);

    const selectedRoom = rooms?.find((r: any) => r.id === selectedRoomId);

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />
            <Header title="Tạo hóa đơn" showBackButton onBackPress={() => navigation.goBack()} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                    {/* CHỌN PHÒNG */}
                    <Text className="text-indigo-600 text-[12px] font-black uppercase tracking-widest mt-6 mb-3 ml-1">Chọn phòng áp dụng</Text>
                    <TouchableOpacity
                        onPress={() => setShowRoomSelect(!showRoomSelect)}
                        className={`bg-white border ${selectedRoomId ? 'border-indigo-500' : 'border-slate-200'} rounded-2xl p-4 flex-row justify-between items-center `}
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons name="meeting-room" size={20} color={selectedRoomId ? "#4F46E5" : "#94A3B8"} />
                            <Text className={`ml-3 font-bold text-base ${selectedRoomId ? 'text-slate-900' : 'text-slate-400'}`}>
                                {selectedRoom ? `Phòng ${selectedRoom.roomNumber}` : "Bấm để chọn phòng..."}
                            </Text>
                        </View>
                        <MaterialIcons name={showRoomSelect ? "expand-less" : "expand-more"} size={24} color="#64748B" />
                    </TouchableOpacity>

                    {showRoomSelect && (
                        <View className="bg-white border-x border-b border-slate-100 rounded-b-2xl p-4 mt-[-10] z-[-1] pt-6 flex-row flex-wrap">
                            {rooms?.map((room: any) => (
                                <TouchableOpacity
                                    key={room.id}
                                    onPress={() => handleSelectRoom(room.id)}
                                    className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${selectedRoomId === room.id ? 'bg-indigo-600 border-indigo-600 shadow-md' : 'bg-white border-slate-200'}`}
                                >
                                    <Text className={`text-sm font-bold ${selectedRoomId === room.id ? 'text-white' : 'text-slate-600'}`}>{room.roomNumber}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* DANH MỤC PHÍ */}
                    {selectedRoomId && (
                        <>
                            <View className="flex-row justify-between items-center mt-8 mb-3">
                                <Text className="text-indigo-600 text-[12px] font-black uppercase tracking-widest">Chi tiết hóa đơn</Text>
                                <TouchableOpacity onPress={addNewCustomFee} className="flex-row items-center bg-indigo-50 px-3 py-1.5 rounded-lg">
                                    <MaterialIcons name="add" size={18} color="#4F46E5" />
                                    <Text className="text-indigo-600 text-[11px] font-bold ml-1 uppercase">Thêm phí</Text>
                                </TouchableOpacity>
                            </View>

                            {invoiceItems.map((item, index) => (
                                <View key={item.id} className={`bg-white rounded-[24px] p-5 mb-4 border ${item.selected ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-100 '}`}>
                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            onPress={() => toggleSelectFee(index)}
                                            disabled={item.id === 'ROOM_PRICE'}
                                            className={`w-7 h-7 rounded-lg items-center justify-center border ${item.selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}
                                        >
                                            {item.selected && <MaterialIcons name="check" size={20} color="white" />}
                                        </TouchableOpacity>

                                        <View className="flex-1 ml-4">
                                            <TextInput
                                                value={item.name}
                                                editable={!item.isSystem} // Không cho sửa tên nếu là phí hệ thống
                                                onChangeText={(val) => updateItem(index, 'name', val)}
                                                className={`font-black text-base p-0 ${item.selected ? 'text-slate-900' : 'text-slate-400'}`}
                                            />
                                        </View>
                                        {item.isSystem && <MaterialIcons name="lock-outline" size={16} color="#94A3B8" />}
                                    </View>

                                    {item.selected && (
                                        <View className="mt-4 pt-4 border-t border-indigo-100">
                                            {item.id !== 'ROOM_PRICE' && (
                                                <View className="flex-row bg-slate-100 p-1 rounded-xl mb-4">
                                                    {CALC_TYPES.map((type) => {
                                                        const isCurrentType = item.calculationType === type.value;
                                                        return (
                                                            <TouchableOpacity
                                                                key={type.value}
                                                                // KHÓA Ở ĐÂY: Nếu là phí hệ thống thì không cho onPress
                                                                onPress={() => !item.isSystem && updateItem(index, 'calculationType', type.value)}
                                                                disabled={item.isSystem}
                                                                className={`flex-1 flex-row items-center justify-center py-2 rounded-lg 
                                ${isCurrentType ? 'bg-white shadow-sm' : ''} 
                                ${item.isSystem && !isCurrentType ? 'opacity-40' : ''}`} // Làm mờ các lựa chọn không được chọn nếu bị khóa
                                                            >
                                                                <Text className={`text-[11px] font-bold ${isCurrentType ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                    {type.label}
                                                                </Text>
                                                                {/* Hiện icon khóa nhỏ nếu là phí hệ thống */}
                                                                {item.isSystem && isCurrentType && (
                                                                    <MaterialIcons name="lock" size={10} color="#6366f1" style={{ marginLeft: 4 }} />
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}

                                            <View className="flex-row items-center space-x-3 gap-x-3">
                                                {/* ĐƠN GIÁ */}
                                                <View className="flex-1">
                                                    <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Đơn giá</Text>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        value={item.unitPrice.toString()}
                                                        editable={!item.isSystem} // KHÔNG CHO SỬA GIÁ NẾU LẤY TỪ FEE HOẶC ROOM
                                                        onChangeText={(val) => updateItem(index, 'unitPrice', val)}
                                                        className={`bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold ${item.isSystem ? 'text-slate-400 bg-slate-50' : 'text-slate-800'}`}
                                                    />
                                                </View>

                                                {/* SỐ LƯỢNG */}
                                                {item.calculationType !== 'FIXED' && (
                                                    <View className="flex-1">
                                                        <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Số lượng</Text>
                                                        <TextInput
                                                            keyboardType="numeric"
                                                            value={item.quantity.toString()}
                                                            onChangeText={(val) => updateItem(index, 'quantity', val)}
                                                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800"
                                                        />
                                                    </View>
                                                )}

                                                <View className="flex-[1.2] items-end">
                                                    <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 mr-1">Thành tiền</Text>
                                                    <Text className="text-indigo-600 font-black text-lg">
                                                        {(item.unitPrice * (item.calculationType === 'FIXED' ? 1 : item.quantity)).toLocaleString()}đ
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                    <View className="h-10" />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* BOTTOM BAR */}
            <View className="bg-white px-6 pt-5 pb-10 border-t border-slate-100 shadow-2xl">
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1">Tổng cộng hóa đơn</Text>
                        <Text className="text-2xl font-black text-slate-900">{totalAmount.toLocaleString()}đ</Text>
                    </View>
                    <TouchableOpacity
                        disabled={!selectedRoomId}
                        onPress={handleCreateInvoice}
                        className={`px-8 h-16 w-48 rounded-2xl items-center justify-center flex-row ${!selectedRoomId ? 'bg-slate-300' : 'bg-indigo-600 active:bg-indigo-700'}`}
                    >
                        {isCreating ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <MaterialIcons name="check" size={20} color="white" />
                                <Text className="text-white font-bold text-lg ml-2 uppercase">Xác nhận</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}