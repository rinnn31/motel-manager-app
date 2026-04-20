import { useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  StatusBar,
  Platform, 
  ActivityIndicator
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import accountService from "../../services/accountService";
import { updateProfile } from "../../store/account/accountSlice";
import { useAppDispatch } from "../../store/hooks";

const GENDER_OPTIONS = [
  { id: 0, label: 'Nam'},
  { id: 1, label: 'Nữ' },
  { id: 2, label: 'Khác' },
];

export default function EditGenderScreen({ navigation }) {
    const [selectedGender, setSelectedGender] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();

    // Padding để tránh tai thỏ/status bar
    const paddingTop = Platform.OS === 'ios' ? 60 : 20;

    const handleSave = async () => {
        setLoading(true);
        try {
            await accountService.updateProfile({ gender: selectedGender });
            dispatch(updateProfile({ gender: selectedGender }));
            navigation.goBack();
        } catch (e: any) {
            setError(e.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-white" style={{ paddingTop }}>
            <StatusBar barStyle="dark-content" />
            
            <View className="flex-1 px-6">
                {/* Nút Back ở trên cùng */}
                <View className="mb-6 -ml-2">
                    <Pressable 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color="#1F2937" style={{ marginLeft: 8 }} />
                    </Pressable>
                </View>

                {/* Header */}
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-gray-800">Giới tính của bạn</Text>
                    <Text className="text-gray-500 mt-2">Thông tin này giúp chúng tôi cá nhân hóa trải nghiệm.</Text>
                </View>

                {/* Options */}
                <View className="gap-y-4">
                    {GENDER_OPTIONS.map((option) => {
                        const isSelected = selectedGender === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => setSelectedGender(option.id)}
                                className={`flex-row items-center p-4 rounded-2xl border-2 ${
                                    isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-gray-50'
                                }`}
                            >
                                <Text className={`flex-1 ml-4 text-lg font-medium ${
                                    isSelected ? 'text-indigo-900' : 'text-gray-700'
                                }`}>
                                    {option.label}
                                </Text>

                                {isSelected && (
                                    <MaterialIcons name="check-circle" size={24} color="#4F46E5" />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
                {error ? <Text className="text-red-500 mt-4 text-sm">{error}</Text> : null}

                <View className="flex-1" />

                {/* Save Button */}
                <Pressable 
                    disabled={loading}
                    onPress={handleSave}
                    className={`mb-6 h-14 rounded-2xl items-center justify-center ${
                        loading ? 'bg-indigo-300' : 'bg-indigo-600'
                    }`}
                >
                    <Text className="text-white text-lg font-bold">
                        {loading ? 
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            : "Lưu"
                        }
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}