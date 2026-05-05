import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, Pressable, Image,
    StatusBar, Modal, Dimensions, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Video from 'react-native-video';
import Header from "../../components/common/Header";
import { MessageInfo } from '../../types/motelTypes';
import messageService from '../../services/messageService';
import { resolveMedia } from '../../utils/serverMediaResolver';

const { width, height } = Dimensions.get('window');

export default function MessageViewScreen({ route, navigation }: any) {
    const { messageId, box } = route.params;

    const [message, setMessage] = useState<MessageInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [recipientsVisible, setRecipientsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setLoading(true);
        messageService.getMessageById(messageId)
            .then(setMessage)
            .catch(err => console.error("Failed to fetch message details: ", err))
            .finally(() => setLoading(false));
    }, [messageId]);

    const openViewer = (index: number) => {
        setCurrentIndex(index);
        setViewerVisible(true);
    };

    const navigateMedia = (step: number) => {
        if (!message?.attachments) return;
        const nextIndex = currentIndex + step;
        if (nextIndex >= 0 && nextIndex < message.attachments.length) {
            setCurrentIndex(nextIndex);
        }
    };

    const renderRecipientsChips = () => {
        if (!message?.recipients || message.recipients.length === 0) return null;

        const limit = 3;
        const displayRecipients = message.recipients.slice(0, limit);
        const remainingCount = message.recipients.length - limit;

        return (
            <View className="flex-row flex-wrap items-center mt-1">
                {displayRecipients.map((person, idx) => (
                    <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-full mr-2 mb-2 border border-slate-200 flex-row items-center">
                        <Text className="text-slate-700 text-[13px] font-medium">{person.name}</Text>
                    </View>
                ))}

                {remainingCount > 0 && (
                    <Pressable
                        onPress={() => setRecipientsVisible(true)}
                        className="bg-indigo-50 px-3 py-1.5 rounded-full mb-2 border border-indigo-200 active:opacity-60"
                    >
                        <Text className="text-indigo-600 text-[13px] font-bold">+{remainingCount} người khác</Text>
                    </Pressable>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#F8FAFC]">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <StatusBar barStyle="dark-content" />

            <Header
                title="Chi tiết tin nhắn"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* INFO SECTION WITH CHIPS */}
                <View className="bg-white px-6 py-5 border-b border-slate-100">
                    {/* Từ: */}
                    <View className="flex-row items-center mb-4">
                        <Text className="text-slate-400 text-[11px] font-bold uppercase w-12">Từ:</Text>
                        <View className="bg-indigo-600 px-3 py-1.5 rounded-full flex-row items-center shadow-sm shadow-indigo-200">
                            <FontAwesome6 name="user"  size={14} color="white" solid/>
                            <Text className="text-white text-[13px] font-bold ml-2">
                                {box === 'sent' ? "Bạn" : message?.sender?.name}
                            </Text>
                        </View>
                    </View>

                    {/* Đến: */}
                    <View className="flex-row items-center">
                        <Text className="text-slate-400 text-[11px] font-bold uppercase w-12 mt-2.5">Đến:</Text>
                        <View className="flex-1">
                            {renderRecipientsChips()}
                        </View>
                    </View>

                    <View className="mt-3 flex-row items-center">
                        <FontAwesome6 name="clock" size={14} color="#94A3B8" />
                        <Text className="text-slate-400 text-sm ml-2 font-medium">{new Date(message!.createdAt).toLocaleString()}</Text>
                    </View>
                </View>

                {/* CONTENT CARD */}
                <View className="m-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <Text className="text-xl font-bold text-slate-900 mb-4 leading-7">
                        {message?.title}
                    </Text>

                    <Text className="text-slate-600 text-[15px] leading-6 mb-8">
                        {message?.content}
                    </Text>

                    {/* ATTACHMENTS */}
                    {message?.attachments && message.attachments.length > 0 && (
                        <View className="border-t border-slate-50 pt-6">
                            <View className="flex-row items-center mb-4">
                                <FontAwesome6 name="paperclip" size={18} color="#64748B" />
                                <Text className="text-slate-400 font-bold text-[11px] uppercase tracking-wider ml-1">
                                    Tệp đính kèm ({message.attachments.length})
                                </Text>
                            </View>

                            <View className="flex-row flex-wrap">
                                {message.attachments.map((item, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => openViewer(index)}
                                        className="mr-3 mb-3 w-[75px] h-[75px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50"
                                    >
                                        {item.type === 'image' ? (
                                            <Image source={{ uri: resolveMedia(item.key) }} className="w-full h-full" />
                                        ) : (
                                            <View className="w-full h-full items-center justify-center bg-slate-800">
                                                <FontAwesome6 name="play" size={24} color="white" />
                                            </View>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* MODAL: FULL LIST OF RECIPIENTS */}
            <Modal visible={recipientsVisible} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[32px] p-6 h-[50%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-lg font-bold text-slate-900">Người nhận</Text>
                                <Text className="text-slate-400 text-xs">{message?.recipients?.length} người đã nhận tin này</Text>
                            </View>
                            <Pressable onPress={() => setRecipientsVisible(false)} className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
                                <FontAwesome6 name="xmark" size={22} color="#64748B" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {message && message?.recipients?.map((recipient, idx) => (
                                <View key={idx} className="flex-row items-center py-4 border-b border-slate-50">
                                    <View>
                                        <Text className="text-slate-800 font-bold text-[15px]">{recipient.name}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* MODAL: MEDIA VIEWER */}
            <Modal visible={viewerVisible} transparent animationType="fade">
                {message && message.attachments &&
                    <View className="flex-1 bg-black/95">
                        <SafeAreaView className="z-50">
                            <View className="flex-row justify-between items-center px-6 py-2">
                                <Text className="text-white font-medium">
                                    {currentIndex + 1} / {message?.attachments?.length}
                                </Text>
                                <Pressable onPress={() => setViewerVisible(false)} className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
                                    <FontAwesome6 name="xmark" size={24} color="white" />
                                </Pressable>
                            </View>
                        </SafeAreaView>

                        <View className="flex-1 justify-center items-center">
                            {message!.attachments![currentIndex].type === 'image' ? (
                                <Image
                                    source={{ uri: resolveMedia(message!.attachments![currentIndex].key) }}
                                    style={{ width, height: height * 0.7 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Video
                                    source={{ uri: resolveMedia(message!.attachments![currentIndex].key) }}
                                    style={{ width, height: height * 0.6 }}
                                    controls
                                    resizeMode="contain"
                                />
                            )}
                        </View>

                        {/* Nav Controls */}
                        <View className="absolute top-0 bottom-0 left-0 right-0 flex-row items-center justify-between px-4">
                            <Pressable
                                onPress={() => navigateMedia(-1)}
                                disabled={currentIndex === 0}
                                className={`w-12 h-12 items-center justify-center rounded-full bg-white/10 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <FontAwesome6 name="angle-left" size={24} color="white" style={{ marginLeft: 8 }} />
                            </Pressable>

                            <Pressable
                                onPress={() => navigateMedia(1)}
                                disabled={currentIndex === (message?.attachments?.length || 0) - 1}
                                className={`w-12 h-12 items-center justify-center rounded-full bg-white/10 ${currentIndex === (message?.attachments?.length || 0) - 1 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <FontAwesome6 name="angle-right" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                }
            </Modal>
        </View>
    );
}