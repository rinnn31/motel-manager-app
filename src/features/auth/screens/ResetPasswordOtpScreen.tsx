import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectAuthLoading } from "../store/auth.selector";
import OtpInput from "../../../components/common/OtpInput";
import authService from "../services/authService";

export default function ResetPasswordOtpScreen({ route, navigation }) {
    const { phone } = route.params;

    const [otp, setOtp] = useState("");

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const [error, setError] = useState<string | null>(null);

    const isValid = otp.length === 6;

    const handleNext = async () => {
        try {
            await authService.resetPassword({ phoneNumber: phone, code: otp });

            navigation.navigate("ResetPasswordNewPass", {
                phone,
                otp,
            });
        } catch (e: any) {
            setError(e.message || "Xác thực OTP thất bại");
        }
    };

    const handleResend = async () => {
        try {
            await authService.sendResetPasswordOtp(phone);
        } catch (e: any) {
            setError(e.message || "Có lỗi khi gửi lại mã, vui lòng thử lại sau");
        }
    };

    return (
        <View className="flex-1 bg-white">

            {/* Background giống Login */}
            <View className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20" />
            <View className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-purple-300 opacity-20" />

            <View className="flex-1 px-6 pt-20 pb-10 justify-between">

                {/* Header */}
                <View>
                    <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-8 shadow-md">
                        <Text className="text-white text-2xl font-bold">◆</Text>
                    </View>

                    <Text className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                        Xác thực OTP
                    </Text>

                    <Text className="text-gray-900 text-4xl font-bold leading-tight">
                        Nhập mã xác nhận
                    </Text>

                    <Text className="text-gray-500 mt-2">
                        Mã OTP đã được gửi đến{" "}
                        <Text className="font-semibold text-gray-700">
                            {phone}
                        </Text>
                    </Text>
                </View>

                {/* Form */}
                <View className="-mt-40">

                    {/* OTP input */}
                    <View className="mb-4">
                        <Text className="text-gray-500 text-xs mb-2 ml-1">
                            Mã OTP
                        </Text>

                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                        />
                    </View>

                    {/* Error */}
                    {error && (
                        <View className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                            <Text className="text-red-600 text-sm">
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Resend */}
                    <TouchableOpacity
                        onPress={handleResend}
                        className="mb-6"
                    >
                        <Text className="text-indigo-600 text-sm font-medium text-right">
                            Gửi lại OTP
                        </Text>
                    </TouchableOpacity>

                    {/* Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={!isValid || loading}
                        className={`rounded-2xl py-4 items-center ${
                            isValid && !loading
                                ? "bg-indigo-600"
                                : "bg-indigo-300"
                        }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-base">
                                Tiếp theo
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer spacing */}
                <View />
            </View>
        </View>
    );
}