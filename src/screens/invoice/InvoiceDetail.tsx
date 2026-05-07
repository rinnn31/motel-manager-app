import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { InvoiceInfo } from '../../types/motelTypes';
import invoiceService from '../../services/invoiceService';
import Header from '../../components/common/Header';

export default function InvoiceDetailScreen({ route, navigation }: any) {
    const { invoiceInfo, room, isOwner } = route.params;
    const [invoice, setInvoice] = useState<InvoiceInfo>(invoiceInfo);
    
    const totalAmount = invoice.details.reduce((total, item) => total + item.amount * item.unitPrice, 0);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN') + " đ";
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('vi-VN');
    };

    // Hàm xử lý chung cho cả 2 vai trò
    const handleUpdateStatus = async (newStatus: string) => {
        try {
            await invoiceService.payInvoice(invoice.id);
            setInvoice({ ...invoice, paymentStatus: newStatus, paidAt: newStatus === 'PAYEE_CONFIRMED' ? Date.now() : invoice.paidAt });
            Alert.alert("Thành công", "Trạng thái hóa đơn đã được cập nhật.");
        }
        catch (error) {
            console.error("Error updating invoice:", error);
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái hóa đơn.");
        }
    };

    // Helper để lấy màu sắc và text hiển thị status
    const getStatusUI = () => {
        switch (invoice.paymentStatus) {
            case 'PAYEE_CONFIRMED':
                return { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'check-circle' };
            case 'PAYER_CONFIRMED':
                return { label: 'Chờ chủ nhà xác nhận', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'clock' };
            default:
                return { label: 'Chờ thu tiền', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'hourglass-end' };
        }
    };

    const statusUI = getStatusUI();

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            <Header
                title="Chi tiết hóa đơn"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* STATUS CARD */}
                <View className="mt-6 bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm shadow-slate-200/50">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className={`px-4 py-2 rounded-2xl flex-row items-center ${statusUI.bg}`}>
                            <FontAwesome6
                                name={statusUI.icon}
                                size={18}
                                color={statusUI.color === 'text-emerald-600' ? "#059669" : statusUI.color === 'text-blue-600' ? "#2563eb" : "#D97706"}
                            />
                            <Text className={`ml-2 font-bold text-xs uppercase ${statusUI.color}`}>
                                {statusUI.label}
                            </Text>
                        </View>
                        <Text className="text-slate-400 font-medium text-sm">{formatDate(invoice.createdAt)}</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phòng</Text>
                            <Text className="text-lg font-bold text-slate-900">{room.roomNumber}</Text>
                        </View>

                        {/* Thông báo riêng cho Landlord khi Tenant đã bấm xác nhận */}
                        {isOwner && invoice.paymentStatus === 'PAYER_CONFIRMED' && (
                            <View className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <Text className="text-blue-700 text-xs font-medium">
                                    💡 Người thuê đã xác nhận đã chuyển tiền. Vui lòng kiểm tra tài khoản trước khi xác nhận thu.
                                </Text>
                            </View>
                        )}

                        {invoice.paymentStatus === 'PAYEE_CONFIRMED' && (
                            <View className="pt-4 border-t border-slate-50 flex-row items-center">
                                <FontAwesome6 name="clock" size={16} color="#94A3B8" />
                                <Text className="ml-2 text-slate-500 text-sm">Hoàn tất lúc: {formatDate(invoice.paidAt!)}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Danh sách dịch vụ - Giữ nguyên logic cũ */}
                <View className="mt-8 px-1">
                    <View className="flex-row justify-between items-end mb-4">
                        <Text className="text-[11px] font-bold uppercase tracking-[1px] text-slate-400">Chi tiết các mục</Text>
                        <Text className="text-[11px] font-medium text-slate-400">{invoice.details.length} mục</Text>
                    </View>
                    <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {invoice.details.map((item: any, index: number) => (
                            <View key={index} className={`p-4 flex-row items-center justify-between ${index !== invoice.details.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-slate-800 mb-0.5">{item.name}</Text>
                                    <Text className="text-[11px] text-slate-400 font-medium">
                                        {item.unitPrice.toLocaleString('vi-VN')} {item.calculationType !== 'FIXED' ? ` × ${item.amount}` : ' (Cố định)'}
                                    </Text>
                                </View>
                                <Text className="text-sm font-bold text-slate-900">{formatCurrency(item.amount * item.unitPrice)}</Text>
                            </View>
                        ))}
                        <View className="bg-slate-50/80 p-4 border-t border-slate-100 flex-row justify-between items-center">
                            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng</Text>
                            <Text className="text-xl font-black text-indigo-600">{formatCurrency(totalAmount)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ACTION BAR */}
            <View className="px-6 py-6 bg-white border-t border-slate-100">
                {isOwner ? (
                    /* GIAO DIỆN CHỦ NHÀ (LANDLORD) */
                    invoice.paymentStatus !== 'PAYEE_CONFIRMED' ? (
                        <TouchableOpacity
                            onPress={() => handleUpdateStatus('PAYEE_CONFIRMED')}
                            className="bg-indigo-600 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-indigo-200 active:opacity-90"
                        >
                            <FontAwesome6 name="money-check" size={18} color="white" />
                            <Text className="ml-2 font-bold text-white uppercase text-xs tracking-widest">Xác nhận đã thu tiền</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="bg-emerald-100 h-14 rounded-2xl items-center justify-center flex-row">
                            <FontAwesome6 name="check-double" size={18} color="#059669" />
                            <Text className="ml-2 font-bold text-emerald-700 uppercase text-xs">Hóa đơn đã hoàn tất</Text>
                        </View>
                    )
                ) : (
                    /* GIAO DIỆN NGƯỜI THUÊ (TENANT) */
                    (() => {
                        if (invoice.paymentStatus === 'UNPAID') {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleUpdateStatus('PAYER_CONFIRMED')}
                                    className="bg-blue-600 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-blue-200"
                                >
                                    <FontAwesome6 name="paper-plane" size={18} color="white" />
                                    <Text className="ml-2 font-bold text-white uppercase text-xs tracking-widest">Tôi đã thanh toán</Text>
                                </TouchableOpacity>
                            );
                        } else if (invoice.paymentStatus === 'PAYER_CONFIRMED') {
                            return (
                                <View className="bg-slate-100 h-14 rounded-2xl items-center justify-center flex-row border border-slate-200">
                                    <FontAwesome6 name="circle-info" size={18} color="#64748b" />
                                    <Text className="ml-2 font-bold text-slate-500 uppercase text-xs">Đang chờ chủ nhà xác nhận</Text>
                                </View>
                            );
                        } else {
                            return (
                                <View className="bg-emerald-50 h-14 rounded-2xl items-center justify-center flex-row border border-emerald-100">
                                    <FontAwesome6 name="circle-check" size={18} color="#059669" />
                                    <Text className="ml-2 font-bold text-emerald-600 uppercase text-xs">Hóa đơn đã thanh toán</Text>
                                </View>
                            );
                        }
                    })()
                )}
            </View>
        </View>
    );
}