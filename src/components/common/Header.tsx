import React from "react";
import { View, Platform, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Props {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    customRightComponent?: React.ReactNode;
}

export default function Header({ title, showBackButton, onBackPress, customRightComponent }: Props) {
    return (
        <View
            style={{ paddingTop: Platform.OS === "ios" ? 60 : 20 }}
            className="px-6 pb-6 bg-white border-b border-slate-100 shadow-sm shadow-slate-200/30"
        >
            <View className="flex-row items-center">
                {showBackButton && (
                    <Pressable onPress={onBackPress} className="p-2 -ml-2">
                        <MaterialIcons name="arrow-back-ios" size={20} color="#1E293B" />
                    </Pressable>
                )}
                <View>
                    <Text className="text-2xl font-bold text-slate-900 ml-5">{title}</Text>
                </View>
                <View className="flex-1" />
                {customRightComponent}
            </View>
        </View>
    );
}