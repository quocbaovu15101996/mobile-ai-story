import { Dimensions, PixelRatio, Platform } from "react-native";
import { API_CONFIG } from "../services/api/config";

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// base from Design
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const [longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

export const scale = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scaleWidth;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const scaleHorizontal = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scaleFactor = Math.min(scaleWidth, scaleHeight);
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/** Scale from height screen
 * @param size: number of pixels to scale
 */
export const verticalScale = (size: number) => (longDimension / BASE_HEIGHT) * size;

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

// type: thumbnail | medium | large
export const getImageLink = (image: string, type: string) => {
  return `${API_CONFIG.BASE_URL}/v1/images/${image}?type=${type}`;
};

export const DEFAULT_THREAD_IMAGE = 'https://ai-story.codezap.io.vn/api/v1/images/3852fb9c-7eeb-46af-8d5b-872a945109b7?type=thumbnail'