import { createI18n } from "vue-i18n";

import commonko from "./ko.json";
import commonen from "./en.json";
import commonzh from "./zh.json";

const messages = {
  ko: commonko,
  en: commonen,
  zh: commonzh
};


const i18n = createI18n({
  legacy: false,
  locale: "ko", // 기본 locale
  fallbackLocale: "ko", // locale 설정 실패시 사용할 locale
  messages, // 다국어 메시지
  silentTranslationWarn: true, // 메시지 코드가 없을때 나오는 console 경고 off
  allowComposition: true
});

export default i18n;
