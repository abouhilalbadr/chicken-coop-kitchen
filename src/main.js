import { createApp } from "vue";
import { createPinia } from 'pinia'
import axios from "axios";

import "./styles.css";
import App from "./App.vue";
import router from "./router";
import { checkForUpdate } from "./updater";
import { useStore } from "./store";

const pinia = createPinia()

const baseUrl = window.navigator.onLine ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_OFFLINE

axios.defaults.baseURL = baseUrl + '/api/v1'

axios.interceptors.response.use(
  response => response,
  error => {
    // Only force re-login on a genuine auth failure (expired/invalid token).
    // Network blips and 500s used to send the kitchen back to the login
    // screen mid-service. A wrong login code comes back as 404, not 401.
    if (error?.response?.status === 401) {
      useStore(pinia).logout()
      router.push('/')
    }
    return Promise.reject(error)
  });

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')

checkForUpdate()
