import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Pressable, ScrollView,
    Image, Platform, StatusBar, Alert, KeyboardAvoidingView, TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Header from "../../components/common/Header";
import { useNavigation } from '@react-navigation/native';
import { RoomInfo } from '../../types/motelTypes';
import messageService from '../../services/messageService';

const MAX_ATTACHMENTS = 5;

export default function AddMessageScreen({ route }: any) {
    const navigation = useNavigation();
    const { motelId, objectType, roomInfos } = route.params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);

    // State cho phần chọn phòng (chỉ dùng khi objectType là motel)
    const [showRoomSelect, setShowRoomSelect] = useState(false);
    const [rooms, setRooms] = useState<{
        id: string;
        name: string;
        selected: boolean;
    }[]>(roomInfos ? roomInfos.map((room: RoomInfo) => ({
        id: room.id,
        name: room.roomNumber,
        selected: false
    })) : []);

    const selectedRoomsCount = rooms.filter(r => r.selected).length;

    const toggleRoom = (id: string) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
    };

    const toggleAllRooms = (status: boolean) => {
        setRooms(prev => prev.map(r => ({ ...r, selected: status })));
    };

    const handlePickMedia = async () => {
        if (attachments.length >= MAX_ATTACHMENTS) {
            Alert.alert("Giới hạn", `Bạn chỉ được đính kèm tối đa ${MAX_ATTACHMENTS} tệp.`);
            return;
        }
        try {
            const result = await ImagePicker.openPicker({
                mediaType: 'any',
                multiple: true,
                maxFiles: MAX_ATTACHMENTS - attachments.length,
            });
            const newFiles = result.map(asset => ({
                path: asset.path,
                type: asset.mime
            }));
            setAttachments([...attachments, ...newFiles]);
        } catch (err) {
            console.log("User cancelled picker");
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSendMessage = async () => {
        if (objectType === 'motel' && selectedRoomsCount === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một phòng.");
            return;
        }
        if (!title || !content) {
            Alert.alert("Thông báo", "Vui lòng điền đầy đủ tiêu đề và nội dung.");
            return;
        }
        
        try {
            setIsSending(true);
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));// Giả lập delay để hiển thị loading
            const res = objectType === 'room' ? 
                await messageService.sendMessageToMotel({ title, content, attachments}) :
                await messageService.sendMessageToRoom(rooms.filter(r => r.selected).map(r => r.id), { title, content, attachments });
            
            navigation.goBack();
        } catch (err) {
            Alert.alert("Lỗi", "Gửi tin nhắn thất bại. Vui lòng thử lại.");
        } finally {
            setIsSending(false);
        }

    };

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />
            {isSending && (
                <View className="absolute inset-0 bg-black/30 z-10 items-center justify-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            )}
            <SafeAreaView className="flex-1" edges={['top']}>
                <Header
                    title="Soạn tin nhắn"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                    customRightComponent={
                        <Pressable onPress={handleSendMessage} className="bg-indigo-600 px-5 py-2 rounded-xl">
                            <Text className="text-white font-bold text-sm">Gửi</Text>
                        </Pressable>
                    }
                />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        
                        {/* DYNAMIC RECIPIENT SECTION */}
                        <View className="mb-6">
                            <Text className="text-indigo-600 text-[12px] font-black uppercase tracking-widest mb-3 ml-1">Người nhận</Text>
                            
                            {objectType === 'room' ? (
                                // HIỂN THỊ CỐ ĐỊNH KHI LÀ PHÒNG
                                <View className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center shadow-sm">
                                    <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center">
                                        <MaterialIcons name="admin-panel-settings" size={24} color="#4F46E5" />
                                    </View>
                                    <View className="ml-3">
                                        <Text className="text-slate-900 font-bold text-base">Chủ trọ / Quản lý</Text>
                                        <Text className="text-slate-400 text-xs font-medium">Tin nhắn sẽ được gửi trực tiếp cho chủ nhà</Text>
                                    </View>
                                </View>
                            ) : (
                                // BỘ CHỌN PHÒNG KHI LÀ MOTEL
                                <View>
                                    <TouchableOpacity 
                                        onPress={() => setShowRoomSelect(!showRoomSelect)}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 flex-row justify-between items-center shadow-sm"
                                    >
                                        <Text className="text-slate-700 font-bold text-base">
                                            {selectedRoomsCount === 0 ? "Chưa chọn phòng nào" : 
                                             selectedRoomsCount === rooms.length ? "Tất cả phòng" : `${selectedRoomsCount} phòng đã chọn`}
                                        </Text>
                                        <MaterialIcons name={showRoomSelect ? "expand-less" : "expand-more"} size={24} color="#64748B" />
                                    </TouchableOpacity>

                                    {showRoomSelect && (
                                        <View className="bg-white border-x border-b border-slate-100 rounded-b-2xl p-4 pt-0 mt-[-10] z-[-1]">
                                            <View className="flex-row space-x-3 mb-4 pt-6">
                                                <TouchableOpacity onPress={() => toggleAllRooms(true)} className="bg-indigo-50 px-4 py-2 rounded-full mr-2">
                                                    <Text className="text-indigo-600 text-[11px] font-bold uppercase">Chọn tất cả</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => toggleAllRooms(false)} className="bg-slate-50 px-4 py-2 rounded-full">
                                                    <Text className="text-slate-600 text-[11px] font-bold uppercase">Bỏ chọn</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row flex-wrap">
                                                {rooms.map(room => (
                                                    <TouchableOpacity 
                                                        key={room.id} 
                                                        onPress={() => toggleRoom(room.id)}
                                                        className={`mr-2 mb-2 px-4 py-2.5 rounded-xl border ${room.selected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}
                                                    >
                                                        <Text className={`text-sm font-bold ${room.selected ? 'text-white' : 'text-slate-600'}`}>{room.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* TITLE INPUT */}
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase mb-2 ml-1">Tiêu đề</Text>
                            <TextInput
                                className="bg-white border border-slate-200 h-14 px-4 rounded-2xl font-semibold text-slate-900 shadow-sm shadow-slate-100"
                                placeholder="Ví dụ: Thông báo bảo trì điện..."
                                placeholderTextColor="#94A3B8"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* CONTENT INPUT */}
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase mb-2 ml-1">Nội dung</Text>
                            <TextInput
                                className="bg-white border border-slate-200 p-4 rounded-3xl text-slate-800 font-medium min-h-[160] shadow-sm shadow-slate-100"
                                placeholder="Nhập nội dung tin nhắn chi tiết..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                textAlignVertical="top"
                                value={content}
                                onChangeText={setContent}
                            />
                        </View>

                        {/* ATTACHMENTS GRID */}
                        <View className="mb-10">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">
                                Đính kèm ({attachments.length}/{MAX_ATTACHMENTS})
                            </Text>
                            <View className="flex-row flex-wrap">
                                {attachments.map((file, index) => (
                                    <View key={index} className="mr-3 mb-3 w-[85px] h-[85px] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                        {file.type.startsWith('image') ? (
                                            <Image source={{ uri: file.path }} className="w-full h-full" />
                                        ) : (
                                            <View className="w-full h-full items-center justify-center bg-slate-900">
                                                <MaterialIcons name="videocam" size={28} color="white" />
                                            </View>
                                        )}
                                        <Pressable onPress={() => removeAttachment(index)} className="absolute top-1 right-1 bg-slate-900/60 w-6 h-6 rounded-full items-center justify-center">
                                            <MaterialIcons name="close" size={14} color="white" />
                                        </Pressable>
                                    </View>
                                ))}
                                {attachments.length < MAX_ATTACHMENTS && (
                                    <Pressable onPress={handlePickMedia} className="w-[85px] h-[85px] rounded-2xl border-2 border-dashed border-slate-300 items-center justify-center bg-slate-50">
                                        <MaterialIcons name="add-photo-alternate" size={26} color="#6366F1" />
                                        <Text className="text-[9px] font-bold text-indigo-500 mt-1">THÊM TỆP</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}