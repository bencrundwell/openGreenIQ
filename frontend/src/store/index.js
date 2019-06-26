import Vue from "vue"
import Vuex from "vuex"
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios)

export default new Vuex.Store({
    state: {
        schedule: [],
        zones: [],
        history: []
     },
     actions: {
        getSchedule ({ commit }) {
            axios.get('http://ogiq:4000/api/schedule/')
                .then(r => r.data)
                .then(schedule => {
                    commit('SET_SCHEDULE', schedule)
                })
        }, 
        getZones ({ commit }) {
            axios.get('http://ogiq:4000/api/zones/')
                .then(r => r.data)
                .then(zones => {
                    commit('SET_ZONES', zones)
                })
        }, 
        getHistory ({ commit }) {
            axios.get('http://ogiq:4000/api/history/')
                .then(r => r.data)
                .then(history => {
                    commit('SET_HISTORY', history)
                })
        },
        postWater ({ commit } , payload) {
            axios.post('http://ogiq:4000/api/water/', payload)
        }
     },
     mutations: {
        SET_SCHEDULE (state, schedule) {
            state.schedule = schedule
          }, 
        SET_ZONES (state, zones) {
            state.zones = zones
          }, 
        SET_HISTORY (state, history) {
            state.history = history
        }
     }
})