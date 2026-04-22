import React from 'react';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Định nghĩa kiểu dữ liệu cho mỗi hành động
export interface ActionItem {
  key: string;          // ID duy nhất để nhận diện hành động (vd: 'camera', 'gallery')
  label: string;        // Chữ hiển thị
  iconName: string;     // Tên icon từ MaterialIcons
  iconColor?: string;   // Màu sắc icon (tùy chọn)
  labelColor?: string;  // Màu sắc chữ (tùy chọn)
}

interface Props {
  visible: boolean;
  title?: string;
  actions: ActionItem[];
  onItemSelected: (key: string) => void;
  onClose: () => void;
}

export default function ChooseItemModal({ visible, title, actions, onItemSelected, onClose }: Props) {
  return (
    <Modal
      animationType="fade" // Fade nhẹ nhàng phù hợp với phong cách phẳng
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay nền mờ */}
      <Pressable 
        className="flex-1 bg-black/50 justify-end" 
        onPress={onClose}
      >
        {/* Container: Không bo góc (Square), không bóng đổ (Flat) */}
        <View className="bg-white w-full border-t border-gray-200">
          
          {/* Header của Modal */}
          {title && (
            <View className="p-4 border-b border-gray-100 bg-gray-50">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px]">
                {title}
              </Text>
            </View>
          )}

          {/* Danh sách hành động */}
          <View>
            {actions.map((action) => (
              <Pressable
                key={action.key}
                onPress={() => {
                  onItemSelected(action.key);
                  onClose();
                }}
                className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-100"
              >
                <MaterialIcons 
                  name={action.iconName} 
                  size={22} 
                  color={action.iconColor || "#4B5563"} 
                />
                <Text 
                  className="ml-4 text-sm font-medium"
                  style={{ color: action.labelColor || "#374151" }}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Nút Đóng */}
          <Pressable 
            onPress={onClose}
            className="p-4 items-center bg-white"
          >
            <Text className="text-gray-900 text-xs font-bold uppercase tracking-widest">
              Hủy bỏ
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};