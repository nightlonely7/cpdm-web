import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;
Vue.use(Vuetify, {
    iconfont: "mdi"
});

axios.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('cpdm_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
