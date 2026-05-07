import React, { useState, useEffect, useCallback, useRef } from "react";
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
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import notificationService from "../../services/notificationService";
import Header from "../../components/common/Header";
import { handleNotification } from "../../utils/notificationHandler";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PAGE_SIZE = 20;

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [error, setError] = useState(false);

    // Ref to prevent onEndReached from firing before the initial load completes
    const isInitialMount = useRef(true);

    const fetchData = async (pageToFetch: number, isRefresh: boolean) => {
        setError(false);
        try {
            const data = await notificationService.getNotifications(pageToFetch, PAGE_SIZE);

            if (isRefresh) {
                setNotifications(data);
                setPage(1);
                setIsEnd(data.length < PAGE_SIZE);
            } else {
                setNotifications((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
                if (data.length < PAGE_SIZE) setIsEnd(true);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError(true);
        }
    };

    // Initial Load
    useEffect(() => {
        const init = async () => {
            setRefreshing(true);
            await fetchData(0, true);
            setRefreshing(false);
            // Unlock loadMore once the first set of data is rendered
            isInitialMount.current = false;
        };
        init();
    }, []);

    const onRefresh = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        await fetchData(0, true);
        setRefreshing(false);
    }, [refreshing]);

    const loadMore = async () => {
        // PREVENT DUPLICATION: 
        // Don't fetch if: already loading, reached end of data, currently refreshing, or initial mount
        if (loadingMore || isEnd || refreshing || isInitialMount.current || error) return;

        setLoadingMore(true);
        await fetchData(page, false);
        setLoadingMore(false);
    };

    const deleteItem = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications((prev) => prev.filter((item) => item.id !== id));
        notificationService.deleteNotification(id);
    };

    const handleReadAll = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleDeleteAll = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotifications([]);
        try {
            await notificationService.deleteAllNotifications();
        } catch (error) {
            console.error("Error deleting all notifications:", error);
        }
    };

    // --- RENDER COMPONENTS ---

    const renderRightActions = (id: string) => (
        <Pressable
            onPress={() => deleteItem(id)}
            className="bg-red-50 justify-center items-center w-20"
        >
            <FontAwesome name="trash" size={26} color="#EF4444" />
        </Pressable>
    );

    const renderItem = ({ item }: { item: any }) => {
        let iconName;
        let color;
        switch (item.type) {
            case "MOTEL_INFO_CHANGED":
                iconName = "house-chimney-user";
                color = "#4F46E5";
                break;
            case "MOTEL_FEE_CHANGED":
                iconName = "coins";
                color = "#059669";
                break;
            case "MOTEL_NAME_CHANGED":
                iconName = "house-chimney-user";
                color = "#4F46E5";
                break;
            case "ROOM_INFO_CHANGED":
                iconName = "house-chimney-user";
                color = "#4F46E5";
                break;
            case "ROOM_MEMBER_CHANGED":
                iconName = "user-group";
                color = "#4F46E5";
                break;
            case "INVOICE_UPDATED":
                iconName = "receipt";
                color = "#059669";
                break;
            case "INVOICE_DELETED":
                iconName = "receipt";
                color = "#D97706";
                break;
            case "INVITATION":
                iconName = "paper-plane";
                color = "#4F46E5";
                break;
            case "MESSAGE":
                iconName = "comment";
                color = "#4F46E5";
                break;
            default:
                iconName = "bell";
                color = "#4F46E5";
        }

        return (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <Pressable onPress={() => {
                    handleNotification(item.type, JSON.parse(item.extraData));
                    notificationService.markAsRead(item.id);
                }} >
                
                <View
                    className={`p-4 flex-row items-start ${item.isRead ? "bg-white" : "bg-indigo-50"} `}
                >
                    <View
                        className={`w-12 h-12 rounded-xl items-center justify-center bg-indigo-50"
                            }`}
                    >
                        <FontAwesome
                            name={iconName}
                            size={20}
                            color={color}
                        />
                    </View>

                    <View className="flex-1 ml-4">
                        <View className="flex-row justify-between items-center">
                            <Text
                                className={`text-[15px] flex-1 ${item.isRead ? "text-slate-500" : "text-slate-900 font-bold"}`}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </View>

                        <Text className="text-slate-500 text-sm mt-0.5 leading-5" numberOfLines={2}>
                            {item.content}
                        </Text>

                        <View className="flex-row items-center mt-2">
                            <FontAwesome name="clock" size={12} color="#94A3B8" />
                            <Text className="text-[11px] text-slate-400 ml-1 font-medium">{new Date(item.createdAt * 1000).toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
                </Pressable>
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
                <FontAwesome name="bell-slash" size={48} color="#CBD5E1" />
            </View>
            <Text className="text-slate-900 font-bold text-lg mt-5">Không có thông báo</Text>
            <Text className="text-slate-500 text-center mt-2 leading-5">
                Chúng tôi sẽ thông báo cho bạn khi có tin tức mới nhất.
            </Text>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                <Header
                    title="Thông báo"
                    iconName="bell"
                    iconColor="#4F46E5"
                    customRightComponent={
                        <View className="flex-row items-center space-x-4 h-8">
                            <Pressable onPress={handleReadAll} className="px-2 active:opacity-50">
                                <FontAwesome name="list-check" size={22} color="#4F46E5" />
                            </Pressable>
                            <Pressable onPress={handleDeleteAll} className="px-2 active:opacity-50">
                                <FontAwesome name="trash" size={22} color="#F43F5E" />
                            </Pressable>
                        </View>
                    }
                />
                {/* LIST */}
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1} // Lower threshold is safer for duplication
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={!refreshing ? renderEmpty : null}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
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