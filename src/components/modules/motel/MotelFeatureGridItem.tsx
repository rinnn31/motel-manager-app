import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface GridItemProps {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
}

export default function MotelFeatureGridItem({ title, icon, color, onPress }: GridItemProps) {
    return (
        <View className="w-1/2 p-2">
            <Pressable
                onPress={onPress}
                className="bg-white p-6 rounded-3xl items-center justify-center border border-slate-100 shadow-sm active:bg-slate-50"
            >
                <View style={{ backgroundColor: `${color}15` }} className="p-4 rounded-2xl mb-3">
                    <MaterialIcons name={icon} size={30} color={color} />
                </View>
                <Text className="text-slate-900 font-bold text-center">{title}</Text>
            </Pressable>
        </View>
    )
}