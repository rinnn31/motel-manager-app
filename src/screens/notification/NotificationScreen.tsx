import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    Platform,
    StatusBar,
    RefreshControl,
    ActivityIndicator,
    LayoutAnimation,
    UIManager,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import notificationService from "../../services/notificationService";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PAGE_SIZE = 20;
function mockFetch(page: number) {
    return new Promise<any[]>((resolve) => {
        setTimeout(async () => {
            const data = await notificationService.getNotifications(page, PAGE_SIZE);
            resolve(data);
        }, 800);
    });
}

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isEnd, setIsEnd] = useState(false);

    // Initial Load
    useEffect(() => {
        initialLoad();
    }, []);

    const initialLoad = async () => {
        setRefreshing(true);
        const data = await mockFetch(1);
        setNotifications(data);
        setPage(2);
        setIsEnd(false);
        setRefreshing(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const data = await mockFetch(1);
        setNotifications(data);
        setPage(2);
        setIsEnd(false);
        setRefreshing(false);
    }, []);

    const loadMore = async () => {
        if (loadingMore || isEnd) return;
        setLoadingMore(true);
        const data = await mockFetch(page);
        if (data.length < PAGE_SIZE) setIsEnd(true);
        setNotifications((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
        setLoadingMore(false);
    };

    const deleteItem = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    const handleReadAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleDeleteAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications([]);
    };

    // --- RENDER COMPONENTS ---

    const renderRightActions = (id: string) => (
        <Pressable
            onPress={() => deleteItem(id)}
            className="bg-red-50 justify-center items-center w-20 my-2 mr-4 rounded-2xl border border-red-100"
        >
            <MaterialIcons name="delete-sweep" size={26} color="#EF4444" />
        </Pressable>
    );

    const renderItem = ({ item }: { item: any }) => {
        const isPayment = item.type === "payment";
        const isWarning = item.type === "warning";

        return (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <View
                    className={`mx-4 my-1.5 p-4 rounded-2xl flex-row items-start bg-white border ${item.isRead ? "border-slate-100" : "border-indigo-100 shadow-sm shadow-indigo-100/50"
                        }`}
                >
                    {/* Status Icon */}
                    <View
                        className={`w-12 h-12 rounded-xl items-center justify-center ${isPayment ? "bg-emerald-50" : isWarning ? "bg-amber-50" : "bg-indigo-50"
                            }`}
                    >
                        <MaterialIcons
                            name={isPayment ? "account-balance-wallet" : isWarning ? "security" : "notifications-none"}
                            size={22}
                            color={isPayment ? "#059669" : isWarning ? "#D97706" : "#4F46E5"}
                        />
                    </View>

                    {/* Content */}
                    <View className="flex-1 ml-4">
                        <View className="flex-row justify-between items-center">
                            <Text
                                className={`text-[15px] flex-1 ${item.isRead ? "text-slate-500" : "text-slate-900 font-bold"}`}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                            {!item.isRead && <View className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </View>

                        <Text className="text-slate-500 text-sm mt-0.5 leading-5" numberOfLines={2}>
                            {item.desc}
                        </Text>

                        <View className="flex-row items-center mt-2">
                            <MaterialIcons name="access-time" size={12} color="#94A3B8" />
                            <Text className="text-[11px] text-slate-400 ml-1 font-medium">{item.createdAt}</Text>
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    };

    const renderFooter = () => {
        if (!loadingMore) return <View className="h-10" />;
        return (
            <View className="py-6">
                <ActivityIndicator color="#4F46E5" />
            </View>
        );
    };

    const renderEmpty = () => (
        <View className="flex-1 items-center justify-center pt-20 px-10">
            <View className="bg-slate-50 p-6 rounded-full">
                <MaterialIcons name="notifications-off" size={48} color="#CBD5E1" />
            </View>
            <Text className="text-slate-900 font-bold text-lg mt-5">Không có thông báo</Text>
            <Text className="text-slate-500 text-center mt-2 leading-5">
                Chúng tôi sẽ thông báo cho bạn khi có tin tức mới nhất.
            </Text>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Background set to a very pale blue to make the White Cards pop */}
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                {/* HEADER */}
                <View
                    style={{ paddingTop: Platform.OS === "ios" ? 60 : 20 }}
                    className="px-6 pb-6 bg-white border-b border-slate-100 shadow-sm shadow-slate-200/50"
                >
                    <View className="flex-row justify-between items-end">
                        <View>
                            <Text className="text-indigo-600 text-xs font-bold uppercase tracking-[2px] mb-1">
                                Hoạt động
                            </Text>
                            <Text className="text-3xl font-extrabold text-slate-900">Thông báo</Text>
                        </View>

                        <View className="flex-row items-center space-x-4">
                            <Pressable onPress={handleReadAll} className="p-2 active:opacity-50">
                                <MaterialIcons name="done-all" size={24} color="#4F46E5" />
                            </Pressable>
                            <Pressable onPress={handleDeleteAll} className="p-2 active:opacity-50">
                                <MaterialIcons name="delete-sweep" size={24} color="#F43F5E" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* LIST */}
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={!refreshing ? renderEmpty : null}
                    contentContainerStyle={{ paddingTop: 12 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#4F46E5"
                            colors={["#4F46E5"]}
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}