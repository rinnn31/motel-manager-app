import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Header from '../../components/common/Header';
import memberService from '../../services/memberService';
import { InvitationInfo } from '../../types/motelTypes';

export default function InvitationManagementScreen({ navigation }: any) {
    const [invitations, setInvitations] = useState<InvitationInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchInvitations = async () => {
        try {
            const data = await memberService.getInvitations();
            setInvitations(data);
        } catch (error) {
            console.error("Error fetching invitations:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách lời mời.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchInvitations();
    };

    const handleAction = async (inviteId: string, action: 'ACCEPT' | 'REJECT') => {
        setProcessingId(inviteId);
        console.log(`${action} invitation with ID: ${inviteId}`);
        try {
            if (action === 'ACCEPT') {
                await memberService.acceptInvitation(inviteId);
                Alert.alert("Thành công", "Bạn đã tham gia vào phòng trọ.");
            } else {
                await memberService.rejectInvitation(inviteId);
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'MotelInfo' }]
            });
        } catch (error) {
            console.error(`Error ${action} invitation:`, error);
            Alert.alert("Lỗi", "Thao tác không thành công. Vui lòng thử lại.");
        } finally {
            setProcessingId(null);
        }
    };

    const renderInvitationItem = (item: InvitationInfo) => {
        const isProcessing = processingId === item.inviteId;

        return (
            <View 
                key={item.inviteId}
                className="mb-4 bg-white rounded-[24px] p-5 border border-slate-100"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                        <View className="bg-indigo-50 self-start px-3 py-1 rounded-full mb-2">
                            <Text className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                Lời mời mới
                            </Text>
                        </View>
                        <Text className="text-lg font-bold text-slate-900 mb-1">
                            Phòng {item.roomNumber}
                        </Text>
                        <View className="flex-row items-center">
                            <FontAwesome6 name="house-chimney" size={12} color="#94A3B8" />
                            <Text className="ml-2 text-slate-500 text-sm font-medium">
                                {item.motelName}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="bg-slate-50 h-12 w-12 rounded-2xl items-center justify-center">
                        <FontAwesome6 name="envelope-open-text" size={20} color="#6366F1" />
                    </View>
                </View>

                <View className="flex-row space-x-3 mt-2">
                    <TouchableOpacity
                        onPress={() => handleAction(item.inviteId, 'REJECT')}
                        disabled={!!processingId}
                        className="flex-1 h-12 rounded-xl bg-slate-50 items-center justify-center border border-slate-100 active:bg-slate-100"
                    >
                        <Text className="text-slate-600 font-bold text-sm">Từ chối</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleAction(item.inviteId, 'ACCEPT')}
                        disabled={!!processingId}
                        className="flex-[2] h-12 rounded-xl bg-indigo-600 items-center justify-center flex-row active:opacity-90"
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <FontAwesome6 name="check" size={14} color="white" />
                                <Text className="ml-2 text-white font-bold text-sm">Chấp nhận</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            <Header
                title="Lời mời tham gia"
            />

            <ScrollView 
                className="flex-1 px-6" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                }
            >
                {isLoading ? (
                    <View className="mt-20">
                        <ActivityIndicator size="large" color="#6366F1" />
                    </View>
                ) : invitations.length > 0 ? (
                    invitations.map(renderInvitationItem)
                ) : (
                    <View className="mt-20 items-center justify-center">
                        <View className="bg-slate-100 h-20 w-20 rounded-full items-center justify-center mb-4">
                            <FontAwesome6 name="box-open" size={30} color="#CBD5E1" />
                        </View>
                        <Text className="text-slate-900 font-bold text-base">Trống trải quá!</Text>
                        <Text className="text-slate-400 text-sm text-center mt-2 px-10">
                            Hiện tại bạn không có lời mời nào. Khi chủ trọ mời bạn vào phòng, chúng sẽ xuất hiện ở đây.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}