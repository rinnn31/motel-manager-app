import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, Pressable, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import accountService from "../services/accountService";
import { updateProfile } from "../store/account.slice";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import OTPInput from "../../../components/common/OtpInput";
import { selectUser } from "../store/account.selector";
import { hidePhoneNumber } from "../../../utils/formats";

export default function InputOTPScreen({ route, navigation }) {
    // Thêm isFromVerification từ params
    const { phoneNumber, isFromVerification } = route.params; 
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();

    const userData = useAppSelector(selectUser);

    const handleVerify = async () => {
        if (otp.length < 6) return;
        setLoading(true);
        try {
            await accountService.verifyContactPoint({ phoneNumber: phoneNumber ?? userData?.phoneNumber, code: otp });
            if (isFromVerification) {
                dispatch(updateProfile({ isVerified: true }));
            } else {
                dispatch(updateProfile({ phoneNumber: phoneNumber }));
            }
        } catch (e: any) {
            setError("Mã xác thực không chính xác");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút Đổi số điện thoại (chỉ có ở luồng Verification)
    const handleChangeContactPoint = () => {
        // Quay lại màn hình nhập số điện thoại trước đó
        navigation.navigate("ChangeNumber", { isFromVerification: true });
    };

    const handleResend = async () => {
        try {
            await accountService.sendContactPointVerificationCode(phoneNumber);
        } catch (e) {
            setError("Có lỗi khi gửi lại mã, vui lòng thử lại sau");
        }

    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
            style={{ paddingTop: Platform.OS === 'ios' ? 60 : 20 }}
        >
            <View className="flex-1 px-6">
                { !isFromVerification && (
                <Pressable onPress={() => navigation.goBack()} className="mb-6 -ml-2 w-10 h-10 items-center justify-center rounded-full active:bg-gray-100">
                    <MaterialIcons name="arrow-back-ios" size={24} color="#1F2937" style={{ marginLeft: 8 }} />
                </Pressable>
                )}
                <View className={isFromVerification ? "mb-8 mt-10": "mb-8"}>
                    <Text className="text-2xl font-bold text-gray-800">{isFromVerification ? "Để có thể tiếp tục sử dụng, bạn cần xác thực số điện thoại" : "Nhập mã để hoàn thành"}</Text>
                    <Text className="text-gray-500 mt-2">
                        Mã gồm 6 chữ số đã được gửi đến <Text className="text-gray-800 font-semibold">{hidePhoneNumber(phoneNumber ?? userData?.phoneNumber)}</Text>
                    </Text>
                </View>

                <View>
                    <OTPInput
                        onChange={setOtp}
                        value={otp}
                        length={6}
                    />
                    
                    {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

                    <Pressable onPress={handleResend} className="mt-6">
                        <Text className="text-gray-400 font-medium">Bạn chưa nhận được mã? <Text className="text-indigo-500">Gửi lại</Text></Text>
                    </Pressable>
                    {isFromVerification && (
                        <Pressable onPress={handleChangeContactPoint} className="mt-6">
                            <Text className="text-gray-400 font-medium">Sai số điện thoại? <Text className="text-indigo-500">Đổi số khác</Text></Text>
                        </Pressable>
                    )}
                </View>

                <View className="flex-1" />

                <Pressable 
                    disabled={loading || otp.length < 6}
                    onPress={handleVerify}
                    className={`mb-6 h-14 rounded-2xl items-center justify-center ${loading || otp.length < 6 ? 'bg-indigo-300' : 'bg-indigo-600'}`}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                    <Text className="text-white text-lg font-bold">Xác nhận</Text>
                    )}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}