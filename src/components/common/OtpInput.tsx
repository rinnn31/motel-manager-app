import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type Props = {
  value: string;
  length?: number;
  label?: string;
  onChange: (otp: string) => void;
};

export default function OTPInput({
  value,
  length = 6,
  label,
  onChange,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    // chỉ cho số + giới hạn length
    const cleaned = text.replace(/\D/g, "").slice(0, length);
    onChange(cleaned);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-500 text-xs mb-2 ml-1">
          {label}
        </Text>
      )}

      {/* wrapper để click vào đâu cũng focus */}
      <Pressable onPress={() => inputRef.current?.focus()}>
        <View className="flex-row justify-between">
          {Array.from({ length }).map((_, index) => {
            const digit = value[index] || "";
            const isActive = focused && index === value.length;

            return (
              <View key={index} className="items-center">
                <Text className="text-2xl font-bold text-gray-900 w-10 h-12 text-center">
                  {digit}
                </Text>

                <View
                  className={`h-[2px] w-10 mt-1 rounded-full ${isActive
                      ? "bg-indigo-500"
                      : "bg-gray-300"
                  }`}
                />
              </View>
            );
          })}
        </View>
      </Pressable>

      {/* input thật (ẩn) */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute opacity-0"
        caretHidden
      />
    </View>
  );
}