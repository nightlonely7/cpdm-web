import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        abc: 'aaaa',
        tasks: [{
            id: 0,
            title: '',
            summary: '',
            createdTime: '',
            startTime: '',
            endTime: '',
            creator: {id: 0, displayName: ''},
            executor: {id: 0, displayName: ''},
            priority: 0,
            status: ''
        }],
    },
    mutations: {
        abc (state) {
            state.abc = 'bbbb'
        },
        getTasks (state) {

        }
    },
    actions: {}
})
