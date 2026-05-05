import React from "react";
import { View, Text, Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
    pressToRetry?: boolean;
    onRetry?: () => void;
    errorMessage?: string;
    errorIconName?: string;
};

export default function ErrorLayout({ pressToRetry = true, onRetry, errorMessage = "Đã có lỗi xảy ra", errorIconName = "error-outline" }: Props) {
    return (
        <View className="flex-1 items-center justify-center px-4">
            <MaterialIcons name={errorIconName} size={64} color="#EF4444" />
            <Text className="text-red-500 text-lg font-medium mt-4 mb-6 text-center">
                {errorMessage}
            </Text>
            {pressToRetry && (
                <Pressable
                    onPress={onRetry}
                    className="bg-red-500 px-6 py-3 rounded-full active:bg-red-600"
                >
                    <Text className="text-white font-semibold">Thử lại</Text>
                </Pressable>
            )}
        </View>
    );
}

