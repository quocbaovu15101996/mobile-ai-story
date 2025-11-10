import { Dimensions, Platform } from "react-native";

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Subscription IDs
export const SUBSCRIPTION_IDS = [
  'com.codezap.ai.story.12m',
  'com.codezap.ai.story.1w',
];

/**
 * check whether string, array, object is empty, null or undefined
 * @param data
 * @returns {boolean}
 */
export function isNullOrEmpty(data: any | any[]): boolean {
  if (!data) {
    return true;
  }
  if (data instanceof Array) {
    return data.length === 0;
  }
  if (typeof data === 'number') {
    return data === 0;
  }
  if (typeof data === 'undefined') {
    return true;
  }
  if (typeof data === 'object') {
    return Object.keys(data).length === 0;
  }
  let output = data;
  if (typeof output !== 'string') {
    output = output.toString();
  }
  output = output.trim();

  return output.length <= 0;
}

export function checkTheDayIsToDay(date?: string): boolean {
  if (!date) return false;
  const today = new Date();
  const lastRollCallDate = new Date(date);

  return (
    lastRollCallDate.getFullYear() === today.getFullYear() &&
    lastRollCallDate.getMonth() === today.getMonth() &&
    lastRollCallDate.getDate() === today.getDate()
  );
}
