import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { register } from "../store/auth.slice";
import { selectAuthLoading } from "../store/auth.selector";
import SelectPicker from "../../../components/common/SelectPicker";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectAuthLoading);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState<number>(0);
    const [role, setRole] = useState<number>(0);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [error, setError] = useState<string | null>(null);

    const [touched, setTouched] = useState({
        phone: false,
        name: false,
        password: false,
        confirm: false,
    });

    const phoneError = touched.phone && phoneNumber.length < 10
            ? "Số điện thoại không hợp lệ"
            : null;

    const nameError = touched.name && fullName.trim().length === 0
            ? "Vui lòng nhập họ tên"
            : null;

    const passwordError = touched.password && password.length < 8
            ? "Mật khẩu tối thiểu 8 ký tự"
            : null;

    const confirmError = touched.confirm && confirmPassword !== password
            ? "Mật khẩu không khớp"
            : null;

    const handleRegister = async () => {

        await dispatch(register({
            phoneNumber,
            password,
            fullName,
            gender,
            role
        })
        );
    };

    return (
        <View className="flex-1 bg-white">
            <View className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20" />
            <View className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-purple-300 opacity-20" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="flex-1 px-6 pt-16 pb-10">

                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Tạo tài khoản
                        </Text>
                        <Text className="text-gray-500 mb-8">
                            Nhập thông tin để đăng ký
                        </Text>

                        <Input 
                            label="Số điện thoại" 
                            value={phoneNumber} 
                            onChangeText={setPhoneNumber} 
                            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                            error={phoneError}
                            keyboardType="phone-pad" />

                        <Input 
                            label="Họ và tên" 
                            value={fullName} 
                            onChangeText={setFullName} 
                            onBlur={() => setTouched((t) => ({...t, name: true}))}
                            error={nameError} />
                        
                        <View>
                            <Text className="text-gray-500 text-xs mb-2 ml-1">
                                Giới tính
                            </Text>

                            <SelectPicker
                                value={gender}
                                onChange={setGender}
                                options={[
                                    { label: "Nam", value: 0 },
                                    { label: "Nữ", value: 1 },
                                    { label: "Khác", value: 2 },
                                ]}
                            />
                        </View>

                        <View>
                            <Text className="text-gray-500 text-xs mb-2 ml-1">
                                Bạn là
                            </Text>

                            <SelectPicker
                                value={role}
                                onChange={setRole}
                                options={[
                                    { label: "Chủ trọ", value: 0 },
                                    { label: "Người thuê", value: 1 }
                                ]}
                            />
                        </View>

                        <PasswordInput
                            label="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                            error={passwordError}
                        />

                        <PasswordInput
                            label="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                            error={confirmError}
                            onChangeText={setConfirmPassword}
                        />

                        {error && (
                            <View className="mb-4 p-3">
                                <Text className="text-red-600 text-sm">
                                    {error}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading}
                            className={`rounded-2xl py-4 items-center ${!isLoading
                                ? "bg-indigo-600"
                                : "bg-indigo-300"
                                }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold">Đăng ký</Text>
                            )}
                        </TouchableOpacity>

                        <Text className="text-center text-gray-400 mt-6">
                            Đã có tài khoản?
                            <Text
                                className="text-indigo-600 font-semibold"
                                onPress={() => navigation.navigate("Login")}
                            >
                                Đăng nhập
                            </Text>
                        </Text>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

/* Reusable components */



