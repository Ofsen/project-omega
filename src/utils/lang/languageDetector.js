import {Platform, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDeviceLang = () => {
  const appLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  return appLanguage.search(/-|_/g) !== -1
    ? appLanguage.slice(0, 2)
    : appLanguage;
};

export const getLocalLang = async () => {
  try {
    const localLang = await AsyncStorage.getItem('lng');
    return localLang;
  } catch (e) {
    console.log(e);
  }
};

export const getLang = async () => {
  const deviceLang = getDeviceLang();
  const localLang = await getLocalLang();
  let lang = deviceLang;
  if (localLang) {
    lang = localLang;
  }
  return lang;
};

export const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const lang = await getLang();
    callback(lang);
  },
  cacheUserLanguage: () => {},
};
