import { Text, Pressable } from "react-native";

type Props = {
    label: string;
    value?: string;
    onPress: () => void;
};

export default function LabelValueSettingItem({ label, value, onPress } : Props) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row justify-between items-center px-4 py-4 border-b border-gray-100"
        >
            <Text className="text-gray-900">{label}</Text>
            <Text className="text-gray-400">{value || ">"}</Text>
        </Pressable>
    );
}