import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import accountService from "../../services/accountService";

export default function ChangePasswordScreen({ navigation }) {
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPass, setShowPass] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const paddingTop = Platform.OS === "ios" ? 60 : 20;

    const handleSave = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ các trường thông tin");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Xác nhận mật khẩu không khớp");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await accountService.changePassword({ oldPassword, newPassword });
            navigation.goBack();
        } catch (e: any) {
            setError(e.response?.data?.message || "Đổi mật khẩu thất bại, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        label: string,
        key: keyof typeof passwords,
        type: keyof typeof showPass
    ) => (
        <View className="mb-6">
            <Text className="text-gray-600 font-medium mb-2">{label}</Text>
            <View
                className={`flex-row items-center border-b-2 py-2 ${error && !passwords[key] ? "border-red-400" : "border-gray-100"
                    }`}
            >
                <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" />
                <TextInput
                    value={passwords[key]}
                    onChangeText={(text) => {
                        setPasswords({ ...passwords, [key]: text });
                        setError("");
                    }}
                    secureTextEntry={!showPass[type]}
                    placeholder="••••••••"
                    placeholderTextColor="#D1D5DB"
                    className="flex-1 ml-3 text-lg text-gray-800"
                />
                <Pressable
                    onPress={() => setShowPass({ ...showPass, [type]: !showPass[type] })}
                >
                    <MaterialIcons
                        name={showPass[type] ? "visibility" : "visibility-off"}
                        size={20}
                        color="#9CA3AF"
                    />
                </Pressable>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
            style={{ paddingTop }}
        >
            <StatusBar barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 px-6">
                    {/* Back Button */}
                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 mb-4 -ml-2"
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color="#1F2937" style={{ marginLeft: 8 }} />
                    </Pressable>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View className="mb-10">
                            <Text className="text-3xl font-bold text-gray-900">Đổi mật khẩu</Text>
                            <Text className="text-gray-500 mt-2">
                                Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để bảo mật tài khoản.
                            </Text>
                        </View>

                        {/* Form */}
                        {renderInput("Mật khẩu hiện tại", "oldPassword", "old")}
                        {renderInput("Mật khẩu mới", "newPassword", "new")}
                        {renderInput("Xác nhận mật khẩu mới", "confirmPassword", "confirm")}

                        {error ? (
                            <View className="flex-row items-center bg-red-50 p-3 rounded-xl border border-red-100">
                                <MaterialIcons name="error-outline" size={18} color="#EF4444" />
                                <Text className="text-red-600 ml-2 text-sm font-medium">{error}</Text>
                            </View>
                        ) : null}
                    </ScrollView>

                    {/* Submit Button */}
                    <View className="pb-6">
                        <Pressable
                            disabled={loading}
                            onPress={handleSave}
                            className={`h-14 rounded-2xl items-center justify-center shadow-lg ${loading ? "bg-indigo-300" : "bg-indigo-600 active:bg-indigo-700"
                                }`}
                        >
                            <Text className="text-white text-lg font-bold">
                                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}