import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/ko-KR'
import router from "./pages/routes";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from "@/lang/lang";

// Import Quasar css

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)

myApp.use(router);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
myApp.use(pinia);

myApp.use(i18n);

myApp.use(Quasar, {
  plugins: {
    Notify
  }, // import Quasar plugins and add here
  lang: quasarLang,
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')