import Toast from 'react-native-toast-message';

export const showToast = (message: string, title: string = 'Success', type: 'success' | 'error' | 'info' = 'success') => {
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
};

export const showSuccessToast = (message: string) => {
  showToast(message, 'Success', 'success');
};

export const showErrorToast = (message: string) => {
  showToast(message, 'Error', 'error');
};