import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TextInputProps,
    Platform,
} from "react-native";

type Props = {
    label?: string;
    error?: string | null;
} & TextInputProps;

export default function PasswordInput({
    label,
    error,
    ...props
}: Props) {
    const [secure, setSecure] = useState(true);
    const [focused, setFocused] = useState(false);

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-gray-500 text-xs mb-1 ml-1">
                    {label}
                </Text>
            )}

            <View
                className={`flex-row items-center border rounded-2xl px-4 h-14 ${error
                        ? "border-red-500"
                        : focused
                            ? "border-indigo-500"
                            : "border-gray-200"
                    }`}
            >
                <TextInput
                    secureTextEntry={secure}
                    className="flex-1 text-gray-900"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholderTextColor="#9ca3af"
                    textContentType="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    {...props}
                />

                <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Text className="text-gray-500 text-sm">
                        {secure ? "Hiện" : "Ẩn"}
                    </Text>
                </TouchableOpacity>
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}