import React from "react";
import { View, Text, Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
    item: {
        id: string;
        name: string;
        memberCount: number;
    }
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function MotelCard({ item, onSelect, onDelete }: Props) {
    return (
        <View className="mx-4 my-1.5 p-4 bg-white rounded-2xl flex-row items-center border border-slate-100 shadow-sm shadow-slate-200/40">
            {/* Icon Section */}
            <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center">
                <MaterialIcons name="apartment" size={26} color="#4F46E5" />
            </View>

            {/* Info Section */}
            <Pressable
                onPress={() => onSelect(item.id)}
                className="flex-1 ml-4"
            >
                <View className="flex-1 ml-4">
                    <Text className="text-slate-900 font-bold text-base mb-1" numberOfLines={1}>
                        {item.name}
                    </Text>

                    <View className="flex-row items-center">
                        <View className="bg-slate-100 px-2 py-0.5 rounded-md flex-row items-center">
                            <MaterialIcons name="groups" size={14} color="#64748b" />
                            <Text className="text-slate-500 text-[11px] font-bold ml-1">
                                {item.memberCount} thành viên
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
            {/* Action Section */}
            <Pressable
                onPress={() => onDelete(item.id)}
                className="p-2 ml-2 active:bg-rose-50 rounded-full"
            >
                <MaterialIcons name="delete-outline" size={22} color="#F43F5E" />
            </Pressable>
        </View>
    );
};