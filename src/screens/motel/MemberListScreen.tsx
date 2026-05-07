import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Pressable,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { MemberInfo, RoomInfo } from '../../types/motelTypes';
import memberService from '../../services/memberService';
import { useNavigation } from '@react-navigation/native';
import { resolveMedia } from '../../utils/serverMediaResolver';
import roomService from '../../services/roomService';
import Header from '../../components/common/Header';

export default function MemberListScreen({ route }: any) {
    const navigation = useNavigation();
    const { target, targetId, isOwner } = route.params;

    // States chính
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [members, setMembers] = useState<MemberInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState<RoomInfo[]>([]);

    // States cho Modal Thêm thành viên
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
    const [addMemberError, setAddMemberError] = useState<string>();
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    
    // State cho Combobox chọn phòng
    const [roomPickerVisible, setRoomPickerVisible] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = target === 'motel' ?
                await memberService.getMembersByMotelId(targetId) :
                await memberService.getMembersByRoomId(targetId);
            setMembers(data);
        } catch (err) {
            console.error("Fetch members error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (target === 'motel' && isOwner) {
            roomService.getRooms(targetId).then(setRooms).catch(console.error);
        }
    }, [targetId]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const handleAddMember = async () => {
        setAddMemberError(undefined);
        if (!newMemberPhone) return setAddMemberError("Vui lòng nhập số điện thoại");
        if (target === 'motel' && !selectedRoomId) return setAddMemberError("Vui lòng chọn phòng");

        try {
            const finalRoomId = target === 'room' ? targetId : selectedRoomId;
            await memberService.inviteMember(finalRoomId, newMemberPhone);
            
            // Reset và đóng modal
            setAddMemberModalVisible(false);
            setNewMemberPhone('');
            setSelectedRoomId('');
            fetchData();
        } catch (err: any) {
            setAddMemberError(err.response?.data?.message || "Không thể mời thành viên này");
        }
    };

    const getSelectedRoomName = () => {
        const room = rooms.find(r => r.id === selectedRoomId);
        return room ? `Phòng ${room.roomNumber}` : "Chọn phòng...";
    };

    const handleRemoveMember = async (targetId) => {
        try {
            await memberService.removeMember(targetId);
            fetchData();
        } catch (err) {
            console.error("Failed to remove member: ", err);
            Alert.alert("Lỗi", "Không thể xóa thành viên này. Vui lòng thử lại.");
        }
    };

    const renderMemberItem = ({ item }: { item: MemberInfo }) => (
        <View className="bg-white mx-6 mb-3 p-4 rounded-2xl border border-slate-100 flex-row items-center shadow-sm shadow-slate-200/50">
            <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mr-4 overflow-hidden">
                {item.user.avatarUrl ? (
                    <Image 
                        source={{ uri:  item.user.avatarUrl ? resolveMedia(item.user.avatarUrl) :
                            "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + encodeURIComponent(item.user.fullName)
                         }}
                        className="w-full h-full" 
                        resizeMode="cover"
                    />
                ) : (
                    <FontAwesome6 name="user" size={24} color="#64748B" />
                )}
            </View>
            <View className="flex-1">
                <Text className="text-slate-900 font-bold text-[15px]">{item.user.fullName}</Text>
                <Text className="text-slate-400 text-[13px] mt-0.5">{item.user.phoneNumber}</Text>
                {item.roomNumber && (
                    <Text className="text-indigo-600 text-[12px] font-black mt-1 uppercase tracking-wider">
                        P.{item.roomNumber}
                    </Text>
                )}
            </View>
            {isOwner && (
                <TouchableOpacity 
                    onPress={() => { handleRemoveMember(item.user.id); }}
                    className="p-2 bg-rose-50 rounded-xl active:bg-rose-100">
                    <FontAwesome6 name="user-minus" size={18} color="#F43F5E" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* HEADER */}
            <Header
                title={target === 'motel' ? "Thành viên nhà trọ" : "Thành viên phòng"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            {/* SEARCH BOX */}
            <View className="px-6 py-4 bg-white">
                <View className="flex-row items-center bg-slate-50 px-4 rounded-2xl border border-slate-100">
                    <FontAwesome6 name="magnifying-glass" size={20} color="#94A3B8" />
                    <TextInput
                        className="flex-1 h-12 ml-2 text-slate-900 font-medium"
                        placeholder="Tìm theo tên thành viên..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={members.filter(m => m.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))}
                    keyExtractor={(item) => item.user.id}
                    renderItem={renderMemberItem}
                    contentContainerStyle={{ paddingVertical: 20, paddingBottom: 120 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />}
                    ListEmptyComponent={
                        <View className="items-center mt-20 px-10">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <FontAwesome6 name="user" size={40} color="#CBD5E1" />
                            </View>
                            <Text className="text-slate-400 text-center font-medium">Chưa có thành viên nào trong danh sách này</Text>
                        </View>
                    }
                />
            )}

            {/* MODAL THÊM THÀNH VIÊN */}
            <Modal visible={addMemberModalVisible} transparent animationType="fade">
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 bg-black/60 justify-end">
                        <Pressable className="absolute inset-0" onPress={() => setAddMemberModalVisible(false)} />
                        
                        <View className="bg-white w-full px-6 pt-8 pb-12 rounded-t-[40px]">
                            <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-8" />
                            
                            <Text className="text-2xl font-black text-slate-900 mb-2">Mời người mới</Text>
                            <Text className="text-slate-500 mb-8">Hệ thống sẽ kết nối qua số điện thoại đăng ký.</Text>

                            {addMemberError && (
                                <Text className="text-rose-600 text-sm font-medium mb-4">{addMemberError}</Text>
                            )}

                            {/* Ô NHẬP SỐ ĐIỆN THOẠI */}
                            <Text className="text-[11px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Số điện thoại</Text>
                            <View className="w-full h-14 px-5 mb-6 bg-slate-50 border border-slate-100 rounded-2xl flex-row items-center">
                                <FontAwesome6 name="phone" size={20} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 text-slate-900 font-bold text-base"
                                    placeholder="Ví dụ: 0987654321"
                                    keyboardType="phone-pad"
                                    value={newMemberPhone}
                                    onChangeText={setNewMemberPhone}
                                />
                            </View>

                            {/* COMBOBOX CHỌN PHÒNG */}
                            {target === 'motel' && (
                                <View className="mb-8">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest">Phòng chỉ định</Text>
                                    <TouchableOpacity
                                        onPress={() => setRoomPickerVisible(true)}
                                        className="w-full h-14 px-5 flex-row items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl"
                                    >
                                        <View className="flex-row items-center">
                                            <FontAwesome6 name="door-open" size={20} color={selectedRoomId ? "#4F46E5" : "#94A3B8"} />
                                            <Text className={`ml-3 font-bold ${selectedRoomId ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {getSelectedRoomName()}
                                            </Text>
                                        </View>
                                        <FontAwesome6 name="bars" size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={handleAddMember}
                                className="w-full h-16 bg-indigo-600 rounded-2xl items-center justify-center shadow-indigo-200 active:opacity-90"
                            >
                                <Text className="text-white font-black uppercase tracking-widest text-base">Xác nhận thêm ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL PICKER COMBOBOX (Chọn phòng) */}
            <Modal visible={roomPickerVisible} transparent animationType="slide">
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-[40px] h-[65%]">
                        <View className="p-6 border-b border-slate-50 flex-row justify-between items-center">
                            <Text className="text-xl font-black text-slate-900">Danh sách phòng</Text>
                            <TouchableOpacity 
                                onPress={() => setRoomPickerVisible(false)}
                            >
                                <FontAwesome6 name="xmark" size={20} color="#1E293B" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={rooms}
                            keyExtractor={(item) => item.id}
                            className="px-6"
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedRoomId(item.id);
                                        setRoomPickerVisible(false);
                                    }}
                                    className="py-5 border-b border-slate-50 flex-row justify-between items-center"
                                >
                                    <View className="flex-row items-center">
                                        <View className={`w-2 h-2 rounded-full mr-3 ${selectedRoomId === item.id ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                                        <Text className={`text-base ${selectedRoomId === item.id ? 'font-black text-indigo-600' : 'font-bold text-slate-600'}`}>
                                            Phòng {item.roomNumber}
                                        </Text>
                                    </View>
                                    {selectedRoomId === item.id && (
                                        <FontAwesome6 name="check" size={22} color="#4F46E5" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* NÚT MỞ MODAL THÊM (FAB) */}
            {isOwner && (
                <TouchableOpacity
                    onPress={() => {
                        setAddMemberError(undefined);
                        setAddMemberModalVisible(true);
                    }}
                    className="absolute bottom-8 right-6 w-16 h-16 bg-indigo-600 items-center justify-center rounded-full shadow-2xl shadow-indigo-400 active:scale-95"
                    style={{ elevation: 8 }}
                >
                    <FontAwesome6 name="plus" size={28} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}