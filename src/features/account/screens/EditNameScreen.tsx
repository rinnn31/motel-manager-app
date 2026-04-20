import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateProfile } from "../store/account.slice";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import accountService from "../services/accountService";

export default function EditNameScreen({ navigation }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Vui lòng nhập họ tên");
            return;
        }

        setLoading(true);

        try {
            await accountService.updateProfile({ fullName: name.trim() });
            dispatch(updateProfile({ fullName: name.trim() }));
            navigation.goBack();
        } catch (e: any) {
            setError(e.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 p-6">
                    {/* Header/Title Section */}
                    <View className="mb-8">
                        <Text className="text-2xl font-bold text-gray-800">Cập nhật họ tên</Text>
                        <Text className="text-gray-500 mt-2">Họ tên này sẽ hiển thị trên hồ sơ cá nhân của bạn.</Text>
                    </View>

                    {/* Input Section */}
                    <View>
                        <Text className="mb-2 font-semibold text-gray-700">Họ và tên</Text>
                        <View className={`flex-row items-center border-b-2 ${error ? 'border-red-500' : 'border-gray-200'} py-2`}>
                            <MaterialIcons name="person-outline" size={20} color="#6B7280" />
                            <TextInput
                                value={name}
                                onChangeText={(val) => {
                                    setName(val);
                                    if (error) setError("");
                                }}
                                placeholder="Nhập tên của bạn..."
                                className="flex-1 ml-3 text-lg text-gray-800"
                                autoFocus
                            />
                        </View>
                        {error ? <Text className="text-red-500 mt-2 text-sm">{error}</Text> : null}
                    </View>

                    {/* Spacer để đẩy nút xuống dưới */}
                    <View className="flex-1" />

                    {/* Save Button ở đáy */}
                    <Pressable
                        disabled={loading}
                        onPress={handleSave}
                        className={`mb-4 h-14 rounded-2xl items-center justify-center ${loading ? 'bg-indigo-300' : 'bg-indigo-600'} active:bg-indigo-700`}
                    >
                        <Text className="text-white text-lg font-bold">
                            {loading ? 
                                <ActivityIndicator size="small" color="#FFFFFF" />
                                : "Lưu"
                            }
                        </Text>
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}