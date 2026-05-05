import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar
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

    const hanldePayInvoice = async () => {
        try {
            await invoiceService.payInvoice(invoice.id);
            setInvoice({ ...invoice, isPaid: true, paidAt: Date.now() });
        }
        catch (error) {
            console.error("Error paying invoice:", error);
        }
    }

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
                        <View className={`px-4 py-2 rounded-2xl flex-row items-center ${invoice.isPaid ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                            <FontAwesome6
                                name={invoice.isPaid ? "check-circle" : "hourglass-end"}
                                size={18}
                                color={invoice.isPaid ? "#059669" : "#D97706"}
                            />
                            <Text className={`ml-2 font-bold text-xs uppercase ${invoice.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {invoice.isPaid ? 'Đã thanh toán' : 'Chờ thu tiền'}
                            </Text>
                        </View>
                        <Text className="text-slate-400 font-medium text-sm">{formatDate(invoice.createdAt)}</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phòng</Text>
                            <Text className="text-lg font-bold text-slate-900">{room.roomNumber}</Text>
                        </View>

                        {invoice.isPaid && (
                            <View className="pt-4 border-t border-slate-50 flex-row items-center">
                                <FontAwesome6 name="clock" size={16} color="#94A3B8" />
                                <Text className="ml-2 text-slate-500 text-sm">Thanh toán lúc: {formatDate(invoice.paidAt!)}</Text>
                            </View>
                        )}
                    </View>
                </View>
            
                <View className="mt-8 px-1">
                    <View className="flex-row justify-between items-end mb-4">
                        <Text className="text-[11px] font-bold uppercase tracking-[1px] text-slate-400">
                            Chi tiết các mục
                        </Text>
                        <Text className="text-[11px] font-medium text-slate-400">
                            {invoice.details.length} mục
                        </Text>
                    </View>

                    <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {invoice.details.map((item: any, index: number) => {
                            const isLast = index === invoice.details.length - 1;
                            const getUnit = (type: string) => {
                                if (type === 'PER_PERSON') return 'người';
                                if (type === 'PER_UNIT') return 'số';
                                return '';
                            };

                            return (
                                <View
                                    key={index}
                                    className={`p-4 flex-row items-center justify-between ${!isLast ? 'border-b border-slate-50' : ''}`}
                                >
                                    <View className="flex-1">
                                        <Text className="text-sm font-semibold text-slate-800 mb-0.5">
                                            {item.name}
                                        </Text>
                                        <Text className="text-[11px] text-slate-400 font-medium">
                                            {item.unitPrice.toLocaleString('vi-VN')}
                                            {item.calculationType !== 'FIXED' ? ` × ${item.amount} ${getUnit(item.calculationType)}` : ' (Cố định)'}
                                        </Text>
                                    </View>

                                    <Text className="text-sm font-bold text-slate-900">
                                        {formatCurrency(item.amount * item.unitPrice)}
                                    </Text>
                                </View>
                            );
                        })}

                        {/* TOTAL LINE - Gọn và sang hơn */}
                        <View className="bg-slate-50/80 p-4 border-t border-slate-100 flex-row justify-between items-center">
                            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng</Text>
                            <View className="items-end">
                                <Text className="text-xl font-black text-indigo-600">
                                    {formatCurrency(totalAmount)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ACTION BAR */}
            {!invoice.isPaid && isOwner && (
                <View className="px-6 py-6 bg-white border-t border-slate-100 flex-row space-x-4">
                    <TouchableOpacity
                        onPress={hanldePayInvoice}
                        className="flex-[1.5] bg-indigo-600 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-indigo-200 active:opacity-90"
                    >
                        <FontAwesome6 name="money-check" size={20} color="white" />
                        <Text className="ml-2 font-bold text-white uppercase text-xs tracking-widest">Xác nhận thu</Text>
                    </TouchableOpacity>
                
            </View>
            )}        
        </View>
    );
}