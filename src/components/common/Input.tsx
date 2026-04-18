import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TextInputProps,
} from "react-native";

type Props = {
    label?: string;
    error?: string | null;
} & TextInputProps;

export default function Input({
    label,
    error,
    ...props
}: Props) {
    const [focused, setFocused] = useState(false);

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-gray-500 text-xs mb-1 ml-1">
                    {label}
                </Text>
            )}

            <View
                className={`border rounded-2xl px-4 h-14 justify-center ${error
                        ? "border-red-500"
                        : focused
                            ? "border-indigo-500"
                            : "border-gray-200"
                    }`}
            >
                <TextInput
                    className="text-gray-900"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholderTextColor="#9ca3af"
                    {...props}
                />
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}