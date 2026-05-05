import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Pressable, TextInput, RefreshControl, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Header from "../../components/common/Header";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MessageInfo, RoomInfo } from '../../types/motelTypes';
import messageService from '../../services/messageService';
import { formatDateISO, formatDateString } from '../../utils/formats';
import roomService from '../../services/roomService';

const PAGE_SIZE = 20;

export default function MessageManagementScreen({ route, navigation }) {
    const { objectId, objectType, motelId } = route.params;

    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [toDate, setToDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState<'from' | 'to' | null>(null);
    const [rooms, setRooms] = useState<RoomInfo[]>([]);

    // --- PHÂN TRANG STATE ---
    const [messages, setMessages] = useState<MessageInfo[]>([]);
    const [page, setPage] = useState(0); // messageService thường dùng offset hoặc page bắt đầu từ 0
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const isInitialMount = useRef(true);


    useEffect(() => {
        if (objectType === 'motel') {
            roomService.getRooms(objectId).then(setRooms).catch(err => console.error("Failed to fetch rooms for message screen: ", err));
        }
    }, []);

    // Hàm gọi API
    const fetchMessagesData = async (pageToFetch: number, isRefresh: boolean) => {
        try {
            let data: MessageInfo[] = [];
            const fromStr = formatDateISO(fromDate);
            const toStr = formatDateISO(toDate);
            console.log(`Fetching messages for ${objectType} ${objectId}, box: ${activeTab}, from: ${fromStr}, to: ${toStr}, page: ${pageToFetch}`);
            if (objectType === 'motel') {
                data = activeTab === 'received'
                    ? await messageService.getReceivedMessagesForMotel(objectId, fromStr, toStr, pageToFetch, PAGE_SIZE)
                    : await messageService.getSentMessagesForMotel(objectId, fromStr, toStr, pageToFetch, PAGE_SIZE);
            } else if (objectType === 'room') {
                data = activeTab === 'received'
                    ? await messageService.getReceivedMessagesForRoom(objectId, fromStr, toStr, pageToFetch, PAGE_SIZE)
                    : await messageService.getSentMessagesForRoom(objectId, fromStr, toStr, pageToFetch, PAGE_SIZE);
            }

            if (isRefresh) {
                setMessages(data);
                setPage(1);
                setIsEnd(data.length < PAGE_SIZE);
            } else {
                setMessages((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
                if (data.length < PAGE_SIZE) setIsEnd(true);
            }
        } catch (err) {
            console.error("Failed to fetch messages: ", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setRefreshing(true);
            await fetchMessagesData(0, true);
            setRefreshing(false);
            isInitialMount.current = false;
        };
        init();
    }, [activeTab, fromDate, toDate]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMessagesData(0, true);
        setRefreshing(false);
    }, [activeTab, fromDate, toDate]);

    const loadMore = async () => {
        if (loadingMore || isEnd || refreshing || isInitialMount.current) return;
        setLoadingMore(true);
        await fetchMessagesData(page, false);
        setLoadingMore(false);
    };

    // Logic filter tại chỗ cho Search Text (vì search text thường filter trên tập dữ liệu đã load)
    const filteredMessages = messages.filter(msg =>
        msg.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(null);
        if (selectedDate) {
            if (showPicker === 'from') setFromDate(selectedDate);
            else setToDate(selectedDate);
        }
    };

    const formatRecipients = (recipients: any[]) => {
        if (recipients.length === rooms.length) return "Tất cả phòng";
        if (recipients.length <= 2) return recipients.map(r => r.name).join(", ");
        return `${recipients[0].name}, ${recipients[1].name} và ${recipients.length - 2} phòng khác`;
    } 

    const renderMessageItem = ({ item }: { item: MessageInfo }) => (
        <Pressable
            onPress={() => navigation.navigate("MessageView", { messageId: item.id, objectType, objectId, rooms })}
            className="bg-white mx-4 mb-3 p-4 rounded-xl border border-slate-100 shadow-sm active:opacity-70"
        >
            <View className="flex-row justify-between items-start mb-1">
                <Text className="text-[15px] font-bold text-slate-800 flex-1 mr-3" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>
            <View className="flex-row justify-between items-center pt-3 border-t border-slate-50">
                <View className="flex-row items-center">
                    <Text className="text-xs text-slate-600">
                        {activeTab === 'received' ? 'Từ: ' : 'Đến: '}
                        <Text className="font-semibold text-slate-900">
                            {activeTab === 'received' ? item.sender.name : formatRecipients(item.recipients)}
                        </Text>
                    </Text>
                </View>
                <FontAwesome6 name="chevron-right" size={20} color="#CBD5E1" />
            </View>
        </Pressable>
    );

    const renderFooter = () => {
        if (!loadingMore) return <View className="h-10" />;
        return (
            <View className="py-6">
                <ActivityIndicator color="#4F46E5" />
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="light-content" />
                <Header title="Hộp thư" showBackButton onBackPress={() => navigation.goBack()} />

                {/* SEARCH BAR */}
                <View className="px-4 py-3 bg-white">
                    <View className="flex-row items-center bg-slate-100 px-4 rounded-2xl border border-slate-200">
                        <FontAwesome6 name="magnifying-glass" size={20} color="#64748B" />
                        <TextInput
                            className="flex-1 h-11 ml-2 text-[15px] text-slate-800"
                            placeholder="Tìm kiếm tiêu đề..."
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>

                {/* TABS */}
                <View className="flex-row bg-white px-4 pb-3">
                    <View className="flex-row flex-1 bg-slate-100 p-1 rounded-xl">
                        {(['received', 'sent'] as const).map((tab) => (
                            <Pressable
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-lg items-center ${activeTab === tab ? 'bg-white' : ''}`}
                            >
                                <Text className={`text-[13px] font-bold ${activeTab === tab ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {tab === 'received' ? 'Tin nhận' : 'Tin gửi'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* DATE RANGE PICKER */}
                <View className="bg-white px-4 pb-4 border-b border-slate-100">
                    <View className="flex-row items-center justify-between bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                        <Pressable onPress={() => setShowPicker('from')} className="flex-1 items-center">
                            <Text className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Từ ngày</Text>
                            <Text className="text-slate-900 font-bold">{formatDateString(fromDate)}</Text>
                        </Pressable>
                        <View className="h-8 w-[1px] bg-indigo-200" />
                        <Pressable onPress={() => setShowPicker('to')} className="flex-1 items-center">
                            <Text className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Đến ngày</Text>
                            <Text className="text-slate-900 font-bold">{formatDateString(toDate)}</Text>
                        </Pressable>
                    </View>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={showPicker === 'from' ? fromDate : toDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                <FlatList
                    data={filteredMessages}
                    renderItem={renderMessageItem}
                    keyExtractor={(item) => item.id}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
                    }
                    ListEmptyComponent={
                        !refreshing ? (
                            <View className="items-center justify-center pt-20 px-10 text-center">
                                <FontAwesome6 name="event-busy" size={48} color="#CBD5E1" />
                                <Text className="text-slate-900 font-bold text-lg mt-4">Không có tin nhắn</Text>
                                <Text className="text-slate-400 text-center mt-2">Không tìm thấy dữ liệu trong khoảng thời gian này.</Text>
                            </View>
                        ) : null
                    }
                />

                <Pressable
                    onPress={() => navigation.navigate("AddMessage", { motelId, objectType, roomInfos: rooms })}
                    className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 items-center justify-center rounded-full shadow-lg shadow-indigo-400"
                >
                    <FontAwesome6 name="plus" size={24} color="white" />
                </Pressable>
            </View>
        </GestureHandlerRootView>
    );
}