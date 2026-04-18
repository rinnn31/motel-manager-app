import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { login } from "../store/auth.slice";
import { selectAuthLoading } from "../store/auth.selector";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";

export default function PhoneLoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectAuthLoading);
    
    const isValid = phoneNumber.length > 0 && password.length > 0;

    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!isValid) return;

        try {
            await dispatch(
                login({ phoneNumber, password })
            ).unwrap();
        } catch (e: any) {
            setError(e.message || "Đăng nhập thất bại");
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20" />
            <View className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-purple-300 opacity-20" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-20 pb-10 justify-between">

                        <View>
                            <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-8 shadow-md">
                                <Text className="text-white text-2xl font-bold">◆</Text>
                            </View>

                            <Text className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                                Đăng nhập
                            </Text>

                            <Text className="text-gray-900 text-4xl font-bold leading-tight">
                                Chào mừng trở lại
                            </Text>

                            <Text className="text-gray-500 mt-2">
                                Đăng nhập bằng số điện thoại và mật khẩu
                            </Text>
                        </View>

                        <View className="-mt-40">
                            <Input
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />

                            <PasswordInput
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChangeText={setPassword}
                            />


                            <TouchableOpacity
                                onPress={() => navigation.navigate("ResetPasswordPhone")}
                                className="mb-6"
                            >
                                <Text className="text-indigo-600 text-sm font-medium text-right">
                                    Quên mật khẩu?
                                </Text>
                            </TouchableOpacity>

                            {error && (
                            <View className="mb-4 p-3">
                                <Text className="text-red-600 text-sm">
                                {error}
                                </Text>
                            </View>
                            )}

                            {/* Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={!isValid || isLoading}
                                className={`rounded-2xl py-4 items-center ${isValid && !isLoading
                                        ? "bg-indigo-600"
                                        : "bg-indigo-300"
                                    }`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-base">
                                        Đăng nhập
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View className="items-center mt-8">
                            <Text className="text-gray-400 text-sm">
                                Chưa có tài khoản?{" "}
                                <Text
                                    className="text-indigo-600 font-semibold"
                                    onPress={() => navigation.navigate("Register")}
                                >
                                    Đăng ký
                                </Text>
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}