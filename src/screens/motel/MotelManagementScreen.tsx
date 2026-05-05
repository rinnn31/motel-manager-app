import React, { useState, useCallback, useEffect } from "react";
import { LayoutAnimation, View, StatusBar, Platform, Text, Pressable, FlatList, RefreshControl } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MotelCard from "../../components/modules/motel/MotelCard";
import MotelNameModal from "../../components/modules/motel/MotelNameModal";
import { MotelInfo } from "../../types/motelTypes";
import motelService from "../../services/motelService";
import Header from "../../components/common/Header";
import ErrorLayout from "../../components/common/ErrorLayout";

export default function MotelManagementScreen({navigation}) {
    const [motels, setMotels] = useState<MotelInfo[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const[isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        onRefresh();
    }, []);

    const handleAddNewMotel = async (name: string) => {
        try {
            await motelService.createMotel({ displayName: name });
            await handleFetchMotels();
        } catch (err) {

        }
        setIsModalVisible(false);
    };

    const handleFetchMotels = async () => {
        try {
            setMotels(await motelService.getAllMotels());
            setError(false);
        } catch (err) {
            setError(true);
            setMotels([]);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleFetchMotels().then(() => setRefreshing(false));
    }, []);

    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMotels((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-[#F8FAFC]">
                <StatusBar barStyle="dark-content" />

                <Header 
                    title="Quản lý nhà trọ"
                    customRightComponent={(
                        <Pressable
                            onPress={() => setIsModalVisible(true)}
                            className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
                        >
                            <MaterialIcons name="add" size={24} color="#1F2937" />
                        </Pressable>
                    )}
                />

                { error && (
                    <ErrorLayout pressToRetry={false}/>
                )}

                <FlatList
                    data={motels}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MotelCard item={item} onDelete={handleDelete} onSelect={() => {
                        navigation.navigate("MotelInfo", { motelId: item.id });
                    }} />}
                    contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center pt-20 px-10">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="domain-disabled" size={40} color="#cbd5e1" />
                            </View>
                            <Text className="text-slate-900 font-bold text-lg">Danh sách trống</Text>
                            <Text className="text-slate-400 text-center mt-2 leading-5">
                                Bạn chưa quản lý cơ sở nào. Bấm nút + để thêm nhà trọ mới.
                            </Text>
                        </View>
                    }
                />
                <MotelNameModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSubmit={handleAddNewMotel}
                    isAddMode={true}
                 />
            </View>
        </GestureHandlerRootView>
    );
}