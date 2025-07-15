import { Alert } from 'react-native';

export const showToast = (message: string, title: string = 'Success') => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      style: 'default',
    },
  ]);
};

export const showSuccessToast = (message: string) => {
  showToast(message, 'Success');
};

export const showErrorToast = (message: string) => {
  showToast(message, 'Error');
};