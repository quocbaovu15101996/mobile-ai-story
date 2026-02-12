import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native'; // Added ActionSheetIOS import
import { RootStackParamList } from '../app/_layout';
import { MESSAGE_TYPE, ROLE } from '../constants';
import { analyticsService } from '../src/services/analyticsService';
import {
  continueThread,
  createARunThread,
  deleteThread,
  eraseLastMessage,
  expandThread,
  getThreadDetail,
  getThreadMessages,
  reportMessage,
  rewriteLastMessage,
} from '../src/services/api/thread';
import { getUserProfile } from '../src/services/api/users';
import { useAuthStore } from '../src/store/useAuthStore';
import { showErrorToast, showSuccessToast } from '../src/utils/toast';

type ThreadDetailScreenRouteProp = {
  key: string;
  name: string;
  params: {
    threadId: string;
    isCreate: boolean;
  };
};

export const useThreadDetail = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ThreadDetailScreenRouteProp>();
  const { threadId, isCreate } = route.params;
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPassage, setLoadingPassage] = useState(isCreate);
  const [deleting, setDeleting] = useState(false);
  const [passages, setPassages] = useState<MessageItemInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const { setUserProfile, userProfile } = useAuthStore();

  const updateUserProfile = useCallback(async () => {
    try {
      const profileResponse = await getUserProfile();
      if (profileResponse.data) {
        setUserProfile(profileResponse.data);
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError);
    }
  }, [setUserProfile]);


  const createTempMessage = useCallback((
    messageId: string,
    content: string,
    type: string,
    role: string
  ): MessageItemInterface => {
    return {
      id: messageId,
      object: '',
      created_at: '',
      thread_id: '',
      run_id: '',
      role: role,
      content: {
        type: type,
        text: {
          value: content,
        },
      },
      metadata: {
        type: type,
        content: content,
      },
      flagNSFW: false,
    };
  }, []);

  const runThread = useCallback(async () => {
    try {
      const response = await createARunThread(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        'text',
        'assistant'
      );
      setPassages([newMessage]);
    } catch (err: any) {
      console.error('Error loading thread detail:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to generate story. Please try again.';
      showErrorToast(errorMessage);
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId, createTempMessage]);

  const isEnoughDiamond = useCallback(() => {
    if (userProfile?.isVip) {
      return true;
    }
    return (userProfile?.diamond || 0) >= 3;
  }, [userProfile?.diamond, userProfile?.isVip]);

  const loadThreadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Promise.all([
        getThreadDetail(threadId),
        getThreadMessages(threadId),
      ]);
      const [threadDetail, threadMessages] = response;
      setThread(threadDetail.data);
      setPassages(threadMessages.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load thread details';
      setError(errorMessage);
      console.error('Error loading thread detail:', err);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDeleteMessage = useCallback(async () => {
    if (passages.length < 2 || deleting) return;

    try {
      setDeleting(true);
      const response = await eraseLastMessage(threadId);
      if (response.status === 200 && response.data === true) {
        analyticsService.logMessageDelete(threadId);
        setPassages(prevPassages => prevPassages.slice(0, -2));
      }
    } catch (err: any) {
      console.error('Error deleting messages:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete messages';
      showErrorToast(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [threadId, passages.length, deleting]);

  const onRewriteMessage = useCallback(async () => {
    if (!isEnoughDiamond()) {
      navigation.navigate('InAppPurchase');
      return;
    }
    try {
      setLoadingPassage(true);
      setPassages(prevPassages => prevPassages.slice(0, -1));
      const response = await rewriteLastMessage(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages((prevPassages) => [...prevPassages, newMessage]);
      analyticsService.logMessageRewrite(threadId, userProfile?.isVip || false);
      await updateUserProfile();
    } catch (err: any) {
      console.error('Error rewriting messages:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to rewrite messages';
      showErrorToast(errorMessage);
    } finally {
      setLoadingPassage(false);
    }
  }, [isEnoughDiamond, navigation, threadId, createTempMessage, updateUserProfile, userProfile?.isVip]);

  const onContinue = useCallback(async () => {
    if (!isEnoughDiamond()) {
      navigation.navigate('InAppPurchase');
      return;
    }
    try {
      setLoadingPassage(true);
      const continueMessage = createTempMessage(
        '',
        '',
        MESSAGE_TYPE.CONTINUE,
        ROLE.USER
      );
      setPassages((prevPassages) => [...prevPassages, continueMessage]);
      const response = await continueThread(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages((prevPassages) => [...prevPassages, newMessage]);

      analyticsService.logStoryContinue(threadId, userProfile?.isVip || false);
      // Update user profile after successful API call
      await updateUserProfile();
    } catch (err: any) {
      console.error('Error continuing messages:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to continue story. Please try again.';
      showErrorToast(errorMessage);
      // Remove the continue message if the API call failed
      setPassages((prevPassages) => prevPassages.slice(0, -1));
    } finally {
      setLoadingPassage(false);
    }
  }, [isEnoughDiamond, navigation, createTempMessage, threadId, updateUserProfile, userProfile?.isVip]);

  const onExpand = useCallback(async () => {
    if (!isEnoughDiamond()) {
      navigation.navigate('InAppPurchase');
      return;
    }
    setIsExtendModalVisible(true);
  }, [isEnoughDiamond, navigation]);

  const onExtendWithContent = useCallback(async (content: string, tone: string) => {
    if (!isEnoughDiamond()) {
      navigation.navigate('InAppPurchase');
      return;
    }
    try {
      setLoadingPassage(true);
      const payload = {
        content: content,
        tone: tone,
      };
      const expandMessage = createTempMessage(
        '',
        content,
        MESSAGE_TYPE.EXPAND,
        ROLE.USER
      );
      setPassages(prev => [...prev, expandMessage]);
      const response = await expandThread(threadId, payload);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages(prev => [...prev, newMessage]);

      analyticsService.logStoryExpand(threadId, tone, userProfile?.isVip || false);
      // Update user profile after successful API call
      await updateUserProfile();
    } catch (err: any) {
      console.error('Error expanding messages:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to expand story. Please try again.';
      showErrorToast(errorMessage);
      // Remove the expand message if the API call failed
      setPassages((prevPassages) => prevPassages.slice(0, -1));
    } finally {
      setLoadingPassage(false);
    }
  }, [isEnoughDiamond, navigation, createTempMessage, threadId, updateUserProfile, userProfile?.isVip]);

  const onPressDiamond = useCallback(() => {
    navigation.navigate('InAppPurchase');
  }, [navigation]);

  const onCloseExtendModal = useCallback(() => {
    setIsExtendModalVisible(false);
  }, []);

  useEffect(() => {
    loadThreadDetail();
  }, [loadThreadDetail]);

  useEffect(() => {
    if (isCreate) {
      runThread();
    }
  }, [isCreate, runThread]);

  // Helper function to sanitize filename
  const sanitizeFilename = useCallback((filename: string): string => {
    // Remove special characters and replace spaces with hyphens
    const sanitized = filename
      .replace(/[^a-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 100); // Limit length
    return sanitized || 'thread';
  }, []);

  const exportToPdf = useCallback(async () => {
    try {
      // Check if thread exists and has messages
      if (!thread) {
        showErrorToast('No thread data available');
        return;
      }

      // Type assertion to access messages if they exist in the thread
      const threadWithMessages = thread as Thread & { messages?: { role: string; content: string }[] };
      const messages = passages.length > 0 ? passages : threadWithMessages.messages || [];

      if (messages.length === 0) {
        showErrorToast('No messages to export');
        return;
      }

      // Create HTML content for the PDF
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #333; }
              .message { margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee; }
              .user { font-weight: bold; color: #007AFF; }
              .assistant { color: #333; }
            </style>
          </head>
          <body>
            <h1>${thread.title || 'Thread'}</h1>
            ${messages.map((msg: any) =>
        `<div class="message">
                <div class="${msg.role}">${msg.role === 'user' ? 'You' : 'Assistant'}</div>
                <div>${msg.content?.text?.value || msg.content || ''}</div>
              </div>`
      ).join('')}
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (!uri) {
        showErrorToast('Failed to generate PDF');
        return;
      }

      // Create filename with sanitized thread title and timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const sanitizedTitle = thread.title ? sanitizeFilename(thread.title) : 'thread';
      const filename = `${sanitizedTitle}-${timestamp}.pdf`;

      // Get Documents directory path
      const documentsDir = FileSystem.documentDirectory;
      if (!documentsDir) {
        showErrorToast('Unable to access documents directory');
        return;
      }

      const fileUri = `${documentsDir}${filename}`;

      // Copy PDF from temporary location to Documents folder
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showSuccessToast(`PDF saved to Documents: ${filename}`);
        return;
      }

      // Share the PDF file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share PDF',
      });

      showSuccessToast('PDF exported and ready to share');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showErrorToast('Failed to export PDF. Please try again.');
    }
  }, [thread, passages, sanitizeFilename]);

  const handleDeleteThread = useCallback(async () => {
    if (!thread?.id) return;

    try {
      setLoading(true);
      await deleteThread(thread.id);
      analyticsService.logThreadDelete(thread.threadId);
      // Navigate back after successful deletion
      navigation.goBack();
      // Optional: Show success message or refresh thread list if needed
    } catch (error: any) {
      console.error('Error deleting thread:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete thread';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [thread?.id, thread?.threadId, navigation]);

  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionModalPosition, setActionModalPosition] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleActionPress = useCallback((positionY: number) => {
    setActionModalPosition(positionY);
    setActionModalVisible(true);
  }, []);

  const handleActionOption = useCallback((option: string) => {
    setActionModalVisible(false);

    switch (option) {
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      case 'export':
        analyticsService.logThreadExport(threadId);
        exportToPdf();
        break;
      case 'share':
        // Handle share functionality if needed
        break;
      case 'copy':
        // Handle copy functionality if needed
        break;
      default:
        break;
    }
  }, [exportToPdf, threadId]);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    handleDeleteThread();
  }, [handleDeleteThread]);

  const handleCloseDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleReport = useCallback(async (messageId: string) => {
    try {
      setLoadingPassage(true);
      const response = await reportMessage(threadId, messageId);
      if (response.data) {
        showSuccessToast('Message reported successfully');
        setPassages(prev => prev.map(msg => msg.id === messageId ? { ...msg, flagNSFW: true } : msg));
      }
    } catch (err: any) {
      console.error('Error reporting message:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to report message';
      showErrorToast(errorMessage);
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId]);

  const handleCloseActionModal = useCallback(() => {
    setActionModalVisible(false);
  }, []);

  return {
    thread,
    loading,
    loadingPassage,
    deleting,
    passages,
    error,
    diamond: userProfile?.diamond || 0,
    isExtendModalVisible,
    actionModalVisible,
    actionModalPosition,
    showDeleteConfirm,
    handleGoBack,
    onDeleteMessage,
    onRewriteMessage,
    onContinue,
    onExpand,
    loadThreadDetail,
    onPressDiamond,
    onExtendWithContent,
    onCloseExtendModal,
    handleActionPress,
    handleActionOption,
    handleDeleteConfirm,
    handleCloseDeleteConfirm,
    handleReport,
    handleCloseActionModal,
    exportToPdf,
  };
};