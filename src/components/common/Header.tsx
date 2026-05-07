import React from "react";
import { View, Platform, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome6";

interface Props {
    title?: string;
    titleColor?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    customRightComponent?: React.ReactNode;
    iconName?: string;
    iconColor?: string;
}

export default function Header({ title, titleColor, showBackButton, onBackPress, customRightComponent, iconName, iconColor}: Props) {
    return (
        <View
            style={{ paddingTop: Platform.OS === "ios" ? 60 : 20 }}
            className="px-6 pb-6 bg-white border-b border-slate-100 shadow-sm shadow-slate-200/30"
        >
            <View className="flex-row items-center">
                {showBackButton && (
                    <Pressable onPress={onBackPress} className="p-2 -ml-2">
                        <FontAwesome name="angle-left" size={20} color="#1E293B" />
                    </Pressable>
                )}
                {!showBackButton && iconName && (
                    <FontAwesome name={iconName} size={24} color={iconColor || "#1E293B"} className="mr-1" />
                )}
                <View>
                    <Text 
                        className={"text-2xl font-bold" + (showBackButton || iconName ? " ml-3" : "ml-5")}
                        style={{ color: titleColor || "#1E293B" }}
                    >{title}</Text>
                </View>
                <View className="flex-1" />
                {customRightComponent}
            </View>
        </View>
    );
}