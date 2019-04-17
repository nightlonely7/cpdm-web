import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import './validators/validateDepAlias';
import './validators/validateDepName';
import './validators/validateEmail';
import './validators/validateProjectAlias';
import './validators/validateProjectName';
import 'vuetify/dist/vuetify.min.css'
import 'animate.css'
import moment from 'moment'
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.use(Vuetify, {
    iconfont: "mdi"
});
Vue.use(CKEditor);

axios.interceptors.request.use(
    (config) => {
        console.log(config);
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

Vue.prototype.moment = moment;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
