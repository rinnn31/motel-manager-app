import React, { useState, useEffect } from 'react';
import {
    View, Text, StatusBar, Platform, FlatList,
    RefreshControl, Pressable, ScrollView, Modal,
    Dimensions
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MonthYearPicker from '../../components/common/MonthYearPicker';
import Header from '../../components/common/Header';
import invoiceService from '../../services/invoiceService';
import { InvoiceInfo, RoomInfo } from '../../types/motelTypes';
import roomService from '../../services/roomService';


export default function InvoiceListView({ route, navigation }: any) {
    const { motelId, isOwner, joinedRoom } = route?.params || {};

    // States bộ lọc
    const [selectedDate, setSelectedDate] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });
    const [selectedRoom, setSelectedRoom] = useState<RoomInfo>();
    const [rooms, setRooms] = useState<RoomInfo[]>([]);
    // States điều khiển UI
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showRoomPicker, setShowRoomPicker] = useState(false);
    const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInvoices = async () => {
        if (!selectedRoom) return;
        setRefreshing(true);
        const firstDayOfMonth = new Date(selectedDate.year, selectedDate.month - 1, 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(selectedDate.year, selectedDate.month, 0).toISOString().split('T')[0];
        try {
            const data = await invoiceService.getInvoices(selectedRoom!.id, firstDayOfMonth, lastDayOfMonth);
            setInvoices(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!isOwner) {
            setSelectedRoom(joinedRoom);
            return;
        }
        const fetchRooms = async () => {
            try {
                const rooms = await roomService.getRooms(motelId);
                setSelectedRoom(rooms[0]);
                setRooms(rooms);
            }
            catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, [motelId]);

    useEffect(() => { fetchInvoices(); }, [selectedDate, selectedRoom]);

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => navigation.navigate("InvoiceDetail", { invoiceInfo: item, room: selectedRoom, isOwner })}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
            <View className="bg-white border border-slate-100 rounded-2xl mx-5 mb-3 p-4 shadow-slate-200/40">
                <View className="flex-row justify-between items-center mb-3">
                    {/* BÊN TRÁI: NGÀY TẠO */}
                    <View className="flex-row items-center">
                        <FontAwesome6 name="clock" size={14} color="#94A3B8" />
                        <Text className="ml-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Ngày tạo: {new Date(item.createdAt).toLocaleString()}
                        </Text>
                    </View>

                    {/* BÊN PHẢI: TRẠNG THÁI */}
                    <View className={`px-2.5 py-1 rounded-lg ${item.isPaid ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                        <Text className={`text-[10px] font-black uppercase ${item.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.isPaid ? 'Đã thu' : 'Chờ thu'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-lg font-black text-slate-800">{item.details.reduce((total, x) => total + x.unitPrice * x.amount, 0).toLocaleString()}đ</Text>
                    <FontAwesome6 name="chevron-right" size={20} color="#CBD5E1" />
                </View>
            </View>
        </Pressable >
    );

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            <Header
                title="Hóa đơn"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />
            {/* HEADER */}
            <View style={{ paddingTop: Platform.OS === 'ios' ? 50 : 20 }} className="bg-white border-b border-slate-100 pb-3">
                {/* FILTER CONTROLS */}
                <View className="px-5 flex-row space-x-3 gap-x-4">
                    {/* Select Box Phòng */}
                    <Pressable
                        disabled={!isOwner}
                        onPress={() => setShowRoomPicker(true)}
                        className="flex-1 bg-slate-50 border border-slate-200 h-14 rounded-xl px-3 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center">
                            <FontAwesome6 name="door-open" size={16} color="#64748B" />
                            <Text className="ml-2 text-slate-700 font-bold text-lg" numberOfLines={1}>{"Phòng: " + selectedRoom?.roomNumber}</Text>
                        </View>
                        <FontAwesome6 name="angle-down" size={20} color="#64748B" />
                    </Pressable>

                    {/* Calendar Button */}
                    <Pressable
                        onPress={() => setShowMonthPicker(true)}
                        className="bg-indigo-50 border border-indigo-100 h-14 px-4 rounded-xl flex-row items-center"
                    >
                        <FontAwesome6 name="calendar" size={16} color="#4F46E5" />
                        <Text className="ml-2 text-indigo-600 font-bold text-lg">T{selectedDate.month}/{selectedDate.year}</Text>
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={invoices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 15 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchInvoices} tintColor="#4F46E5" />}
            />

            {/* MODALS */}
            <MonthYearPicker
                onClose={() => setShowMonthPicker(false)}
                visible={showMonthPicker}
                selectedDate={selectedDate}
                onSelect={(month, year) => {
                    setSelectedDate({ month, year });
                    setShowMonthPicker(false);
                }} {...() => setShowMonthPicker(false)}
            />
            {isOwner && (
                <Pressable
                    onPress={() => navigation.navigate("CreateInvoice", { motelId, rooms })}
                    className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 items-center justify-center rounded-full shadow-lg shadow-indigo-400"
                >
                    <FontAwesome6 name="plus" size={24} color="white" />
                </Pressable>
            )}
            {/* Room Picker Modal */}
            <Modal visible={showRoomPicker} transparent animationType="slide">
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-[32px] p-6 max-h-[70%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-lg font-black text-slate-900">Chọn phòng</Text>
                            <Pressable onPress={() => setShowRoomPicker(false)}><FontAwesome6 name="xmark" size={24} /></Pressable>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {rooms.map(r => (
                                <Pressable
                                    key={r.id}
                                    onPress={() => { setSelectedRoom(r); setShowRoomPicker(false); }}
                                    className={`p-4 mb-2 rounded-2xl flex-row justify-between items-center ${selectedRoom!.id === r.id ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}
                                >
                                    <Text className={`font-bold ${selectedRoom!.id === r.id ? 'text-indigo-600' : 'text-slate-600'}`}>{r.roomNumber}</Text>
                                    {selectedRoom!.id === r.id && <FontAwesome6 name="check" size={20} color="#4F46E5" />}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}