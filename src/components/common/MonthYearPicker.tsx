import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
    visible: boolean;
    selectedDate: { month: number; year: number };
    onSelect: (month: number, year: number) => void;
    onClose: () => void;
}

export default function MonthYearPicker({visible, selectedDate, onSelect, onClose}: Props) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const [viewYear, setViewYear] = useState(selectedDate.year);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/40 justify-center px-8">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-[32px] overflow-hidden shadow-2xl">
                            {/* Header Chọn Năm */}
                            <View className="bg-slate-900 p-6 items-center flex-row justify-between">
                                <Pressable 
                                    onPress={() => setViewYear(viewYear - 1)}
                                    className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                                >
                                    <MaterialIcons name="chevron-left" size={24} color="white" />
                                </Pressable>
                                <View className="items-center">
                                    <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Năm</Text>
                                    <Text className="text-white text-2xl font-black">{viewYear}</Text>
                                </View>
                                <Pressable 
                                    onPress={() => setViewYear(viewYear + 1)}
                                    className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                                >
                                    <MaterialIcons name="chevron-right" size={24} color="white" />
                                </Pressable>
                            </View>

                            {/* Lưới chọn tháng */}
                            <View className="p-4 flex-row flex-wrap justify-between bg-white">
                                {months.map((m) => {
                                    const isSelected = selectedDate.month === m && selectedDate.year === viewYear;
                                    return (
                                        <Pressable
                                            key={m}
                                            onPress={() => onSelect(m, viewYear)}
                                            className={`w-[30%] aspect-[1.2/1] items-center justify-center mb-3 rounded-2xl 
                                                ${isSelected ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-50'}`}
                                        >
                                            <Text className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                                                Tháng
                                            </Text>
                                            <Text className={`text-lg font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                {m < 10 ? `0${m}` : m}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Nút đóng nhanh */}
                            <Pressable 
                                onPress={onClose}
                                className="mx-4 mb-4 py-4 rounded-2xl bg-slate-100 items-center"
                            >
                                <Text className="text-slate-600 font-bold text-sm">Hủy bỏ</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};