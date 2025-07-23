import * as Application from 'expo-application';
import { Platform } from "react-native";

export default async function getDeviceId() {
  return Platform.OS === 'ios' ? await Application.getIosIdForVendorAsync() : Application.getAndroidId();
}