import { useState } from "react";
import { 
  View, Text, TextInput, Pressable, 
  StatusBar, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard 
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import accountService from "../../services/accountService";

export default function ChangeNumberScreen({ route, navigation }) {
    // Lấy flag để biết đang ở luồng Settings hay Verification
    const isFromVerification = route.params?.isFromVerification || false;
    
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const paddingTop = Platform.OS === 'ios' ? 60 : 20;

    const handleNext = async () => {
        if (phoneNumber.length < 10) {
            setError("Số điện thoại không hợp lệ");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // 1. Cập nhật số điện thoại mới lên server
            await accountService.changeContactpoint(phoneNumber);
            // 2. Yêu cầu gửi mã xác thực đến số mới
            await accountService.sendContactPointVerificationCode(phoneNumber);
            
            // 3. Chuyển sang màn hình OTP, truyền kèm phoneNumber và flag luồng
            navigation.navigate("InputOTP", { 
                phoneNumber, 
                isFromVerification 
            });
        } catch (e: any) {
            setError(e.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
            style={{ paddingTop }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 px-6">
                    {/* Back Button - Ở luồng Verification có thể ẩn nếu muốn ép user đổi xong mới được đi tiếp */}
                    <Pressable 
                        onPress={() => navigation.goBack()} 
                        className="mb-6 -ml-2 w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color="#1F2937" style={{ marginLeft: 8 }} />
                    </Pressable>

                    <View className="mb-8">
                        <Text className="text-2xl font-bold text-gray-800">
                            {isFromVerification ? "Thay đổi số điện thoại" : "Số điện thoại mới"}
                        </Text>
                        <Text className="text-gray-500 mt-2">
                            Chúng tôi sẽ gửi mã xác thực đến số điện thoại này để hoàn tất.
                        </Text>
                    </View>

                    <View className={`flex-row items-center border-b-2 ${error ? 'border-red-500' : 'border-gray-100'} py-3`}>
                        <MaterialIcons name="smartphone" size={24} color="#6B7280" />
                        <TextInput
                            value={phoneNumber}
                            onChangeText={(t) => { setPhoneNumber(t); setError(""); }}
                            placeholder="Nhập số điện thoại mới..."
                            keyboardType="phone-pad"
                            autoFocus={isFromVerification} // Tự động focus nếu từ luồng xác thực chuyển qua
                            className="flex-1 ml-3 text-xl text-gray-800"
                        />
                    </View>

                    {error ? <Text className="text-red-500 mt-2 text-sm">{error}</Text> : null}

                    <View className="flex-1" />

                    <Pressable 
                        disabled={loading || phoneNumber.length < 10}
                        onPress={handleNext}
                        className={`mb-6 h-14 rounded-2xl items-center justify-center ${
                            loading || phoneNumber.length < 10 ? 'bg-indigo-300' : 'bg-indigo-600'
                        } active:scale-[0.98]`}
                    >
                        <Text className="text-white text-lg font-bold">
                            {loading ? "Đang xử lý..." : "Tiếp tục"}
                        </Text>
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}