import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectAuthLoading } from "../../store/auth/authSelectors";
import { sendResetPasswordOtp } from "../../store/auth/authSlice";

export default function ResetPasswordPhoneScreen({ navigation }) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);

    const isValid = phone.length >= 10;

    const handleNext = async () => {
        try {
            await dispatch(
                sendResetPasswordOtp({ phoneNumber: phone })
            ).unwrap();

            navigation.navigate("ResetPasswordOtp", {
                phone,
            });
        } catch (e: any) {
            setError(e.message || "Lỗi không xác định");
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
                        Khôi phục mật khẩu
                    </Text>

                    <Text className="text-gray-900 text-4xl font-bold leading-tight">
                        Quên mật khẩu
                    </Text>

                    <Text className="text-gray-500 mt-2">
                        Nhập số điện thoại để nhận mã OTP
                    </Text>
                </View>

                {/* Form */}
                <View className="-mt-40">

                    {/* Phone input */}
                    <View className="mb-4">
                        <Text className="text-gray-500 text-xs mb-2 ml-1">
                            Số điện thoại
                        </Text>

                        <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                            <TextInput
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                className="text-gray-900 text-base"
                            />
                        </View>
                    </View>

                    {/* Error */}
                    {error && (
                        <View className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                            <Text className="text-red-600 text-sm">
                                {error}
                            </Text>
                        </View>
                    )}

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
                                Tiếp tục
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