import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    FlatList,
} from "react-native";

type Props<T> = {
    value: T | null;
    onChange: (value: T) => void;
    options: { label: string; value: T }[];
    placeholder?: string;
};

export default function SelectPicker<T>({
    value,
    onChange,
    options,
    placeholder = "Chọn",
}: Props<T>) {
    const [visible, setVisible] = useState(false);

    const selected = options.find((o) => o.value === value);

    return (
        <View className="mb-6">
            <TouchableOpacity
                onPress={() => setVisible(true)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center"
            >
                <Text className={selected ? "text-gray-900" : "text-gray-400"}>
                    {selected ? selected.label : placeholder}
                </Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={visible} transparent animationType="fade">
                <Pressable
                    className="flex-1 bg-black/40 justify-end"
                    onPress={() => setVisible(false)}
                >
                    <View className="bg-white rounded-t-3xl p-4 max-h-[60%]">

                        <Text className="text-lg font-bold mb-4 text-center">
                            Chọn
                        </Text>

                        <FlatList
                            data={options}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item }) => {
                                const active = item.value === value;

                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onChange(item.value);
                                            setVisible(false);
                                        }}
                                        className={`py-4 px-3 rounded-xl mb-2 flex-row justify-between items-center ${active ? "bg-indigo-100" : ""
                                            }`}
                                    >
                                        <Text
                                            className={`${active
                                                    ? "text-indigo-600 font-semibold"
                                                    : "text-gray-800"
                                                }`}
                                        >
                                            {item.label}
                                        </Text>

                                        {active && (
                                            <Text className="text-indigo-600 font-bold">
                                                ✓
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />

                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}