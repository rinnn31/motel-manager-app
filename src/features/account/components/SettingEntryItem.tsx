import React from "react";
import { Pressable, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
    materialIconName: string;
    materialIconColor?: string;
    label: string;
    labelColor?: string;
    onPress: () => void;
}

export default function SettingEntryItem({ materialIconName, materialIconColor, label, labelColor, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between px-4 py-4 active:bg-gray-50 border-b border-gray-50"
        >
            <View className="flex-row items-center">
                <MaterialIcons name={materialIconName} size={22} color={materialIconColor ?? "#4B5563"} />
                <Text className="ml-3 font-medium" style={{
                    color: labelColor ?? "#4B5563"
                }}>{label}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </Pressable>
    )
}