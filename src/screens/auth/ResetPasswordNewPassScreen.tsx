import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetPassword } from "../../store/auth/authSlice";
import { selectAuthLoading } from "../../store/auth/authSelectors";
import PasswordInput from "../../components/common/PasswordInput";

export default function ResetPasswordNewPassScreen({ route, navigation }) {
    const { phone, otp } = route.params;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [error, setError] = useState<string | null>(null);

    const [touched, setTouched] = useState({
        password: false,
        confirm: false,
    });

    const passwordError = touched.password && password.length < 8 ? "Mật khẩu tối thiểu 8 ký tự" : null;
    const confirmError = touched.confirm && confirmPassword !== password ? "Mật khẩu không khớp" : null;

    const isValid = password.length >= 8 && confirmPassword === password;
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);

    const handleSubmit = async () => {
        try {
            await dispatch(
                resetPassword({
                    phoneNumber: phone,
                    verificationCode: otp,
                    newPassword: password,
                })
            ).unwrap();

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (e: any) {
            setError(e.message || "Đặt lại mật khẩu thất bại");
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Background giống Login */}
            <View className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20" />
            <View className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-purple-300 opacity-20" />

            <View className="flex-1 px-6 pt-20 pb-10 justify-between">

                <View>
                    <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-8 shadow-md">
                        <Text className="text-white text-2xl font-bold">◆</Text>
                    </View>

                    <Text className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                        Khôi phục mật khẩu
                    </Text>

                    <Text className="text-gray-900 text-4xl font-bold leading-tight">
                        Tạo mật khẩu mới
                    </Text>

                    <Text className="text-gray-500 mt-2">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </Text>
                </View>

                {/* Form */}
                <View className="-mt-40">

                    {/* Password input */}
                    <PasswordInput
                        label="Mật khẩu mới"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChangeText={setPassword}
                        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                        error={passwordError}
                    />

                    <PasswordInput
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
                        error={confirmError}
                    />

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
                        onPress={handleSubmit}
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
                                Đặt lại mật khẩu
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