// src/components/modules/motel/AddMotelModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    isAddMode?: boolean;
    error?: string;
}

export default function MotelNameModal({ isVisible, onClose, onSubmit, isAddMode, error }: Props)  {
    const [name, setName] = useState("");

    return (
        <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-full">
                        <View className="bg-white rounded-3xl p-6 shadow-xl">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold text-slate-900">{isAddMode ? "Thêm nhà trọ mới" : "Cập nhật tên nhà trọ"}</Text>
                                <Pressable onPress={onClose}>
                                    <MaterialIcons name="close" size={24} color="#94A3B8" />
                                </Pressable>
                            </View>

                            <View className="mb-6">
                                <Text className="text-slate-600 font-semibold mb-2 ml-1">Tên cơ sở</Text>
                                <TextInput
                                    className={`bg-slate-50 border p-4 rounded-2xl text-slate-900 ${error ? 'border-rose-500' : 'border-slate-200'}`}
                                    placeholder="VD: Nhà trọ Xóm Đình"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                />
                                {error ? <Text className="text-rose-500 text-xs mt-2 ml-1">{error}</Text> : null}
                            </View>

                            <Pressable onPress={() => onSubmit(name)} className="bg-indigo-600 p-4 rounded-2xl items-center">
                                <Text className="text-white font-bold text-base">Xác nhận</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};