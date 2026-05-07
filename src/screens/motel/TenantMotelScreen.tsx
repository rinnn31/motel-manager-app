import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Image,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MotelFeatureGridItem from "../../components/modules/motel/MotelFeatureGridItem";
import motelService from "../../services/motelService";
import roomService from "../../services/roomService";
import ErrorLayout from "../../components/common/ErrorLayout";
import { MotelInfo, RoomInfo } from "../../types/motelTypes";
import { UserInfo } from "../../types/accountTypes";
import { resolveMedia } from "../../utils/serverMediaResolver";
import Header from "../../components/common/Header";
import memberService from "../../services/memberService";

export default function TenantMotelScreen({ navigation }: any) {
    const [motel, setMotel] = useState<MotelInfo>();
    const [room, setRoom] = useState<RoomInfo>();
    const [ownerInfo, setOwnerInfo] = useState<UserInfo>();
    const [fetchError, setFetchError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const fetchMotelInfoTenant = async () => {
        try {
            setIsFetching(true);
            setFetchError(false);

            // 1. Lấy thông tin nhà trọ trước
            const motelRes = await motelService.getJoinedMotel();
            if (motelRes) {
                setMotel(motelRes);

                // 2. Lấy song song thông tin phòng và chủ nhà sau khi có motelId
                const [roomRes, ownerRes] = await Promise.all([
                    roomService.getJoinedRoom(),
                    motelService.getMotelOwner(motelRes.id)
                ]);

                setRoom(roomRes);
                setOwnerInfo(ownerRes);
            } else {
                navigation.replace("InvitationManagement");
            }
        } catch (err) {
            console.error("Failed to fetch tenant motel info: ", err);
            setFetchError(true);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchMotelInfoTenant();
    }, []);

    const menuItems = [
        {
            title: "Hóa đơn",
            icon: "file-invoice-dollar",
            color: "#3B82F6",
            onPress: () => navigation.navigate("InvoiceList", { motelId: motel?.id, isOwner: false, joinedRoom: room })
        },
        {
            title: "Chi phí chung",
            icon: "hand-holding-dollar",
            color: "#F59E0B",
            onPress: () => navigation.navigate("FeeList", { motelId: motel?.id, isOwner: false })
        },
        {
            title: "Thành viên",
            icon: "users",
            color: "#EC4899",
            onPress: () => navigation.navigate("MemberList", { targetId: room?.id, target: "room", isOwner: false })
        },
        {
            title: "Tin nhắn",
            icon: "comments",
            color: "#10B981",
            onPress: () => navigation.navigate("MessageManagement", { motelInfo: motel?.id, objectType: 'room', objectId: room?.id, motelId: motel?.id })
        },
    ];

    const handleLeaveMotel = () => {
        Alert.alert("Rời nhà trọ", "Bạn có chắc chắn muốn rời nhà trọ này không?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Rời đi", style: "destructive", onPress: async () => {
                    try {
                        await memberService.leaveMotel();
                        navigation.replace("InvitationManagement");
                    } catch (err) {
                        console.error("Failed to leave motel: ", err);
                        Alert.alert("Lỗi", "Không thể rời nhà trọ. Vui lòng thử lại.");
                    }
                }
            },
        ]);
    }

    if (fetchError) return (
        <ErrorLayout onRetry={fetchMotelInfoTenant} errorMessage="Không thể tải thông tin nhà trọ" errorIconName="domain-disabled" />
    );

    if (isFetching) return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#4F46E5" />
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <SafeAreaView className="flex-1" edges={['top']}>

                {motel ? (
                    <View className="flex-1">
                        <Header
                            title={motel.name}
                            customRightComponent={
                                <Pressable onPress={handleLeaveMotel} className="p-3 bg-rose-50 rounded-2xl active:bg-rose-100">
                                    <FontAwesome6 name="arrow-right-from-bracket" size={22} color="#EF4444" />
                                </Pressable>
                            }
                        />
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            <View className="mt-5 mx-6 bg-indigo-500 rounded-[25px] p-6 shadow-xl shadow-indigo-200">

                                <Text className="text-white/70 font-medium">Phòng:</Text>
                                <Text className="text-white text-4xl font-black mb-4">{room?.roomNumber || "---"}</Text>

                                <View className="h-[1px] bg-white/20 w-full mb-4" />

                                <View className="flex-row justify-between items-end">
                                    <View>
                                        <Text className="text-white/70 font-medium">Giá thuê cơ bản</Text>
                                        <Text className="text-white text-xl font-bold">{room?.price?.toLocaleString()}đ</Text>
                                    </View>
                                </View>
                            </View>

                            {/* SECTION: CHỦ NHÀ */}
                            <View className="mt-8 px-6">
                                <Text className="text-slate-900 font-black text-lg mb-4">Chủ cho thuê</Text>
                                <View className="p-4 bg-slate-50 rounded-[24px] flex-row items-center border border-slate-100">
                                    <Image
                                        source={{ uri: resolveMedia(ownerInfo?.avatarUrl || "default") }}
                                        className="w-14 h-14 rounded-2xl bg-slate-200"
                                    />
                                    <View className="flex-1 ml-4">
                                        <Text className="text-base font-bold text-slate-900">{ownerInfo?.fullName || "Chưa cập nhật"}</Text>
                                        <Text className="text-slate-500 text-sm">{ownerInfo?.phoneNumber}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mt-8 px-6">
                                <Text className="text-slate-900 font-black text-lg mb-4">Dịch vụ & Tiện ích</Text>

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
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    /* TRẠNG THÁI TRỐNG */
                    <View className="flex-1 items-center justify-center px-10">
                        <View className="bg-slate-50 p-8 rounded-full mb-6">
                            <FontAwesome6 name="domain-disabled" size={64} color="#CBD5E1" />
                        </View>
                        <Text className="text-slate-900 font-black text-xl text-center">Bạn chưa vào nhà trọ</Text>
                        <Text className="text-slate-400 text-center mt-3 leading-6">
                            Vui lòng cung cấp số điện thoại của bạn cho chủ nhà trọ để được mời vào hệ thống.
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}