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
        history: [],
        events: []
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
        updateZone ({ commit }, payload) {
            console.log ("store: action: updateZone, payload: " + payload);
            axios.put('http://ogiq:4000/api/zone/', payload)
                .then(() => {
                    this.dispatch("getZones");
                })
        },
        deleteZone ({ commit }, payload) {
            console.log ("store: action: deleteZone, pin: " + payload.pin);
            axios.delete('http://ogiq:4000/api/zone/'+payload.pin)
                .then(() => {
                    this.dispatch("getZones");
                })
        }, 
        getHistory ({ commit }) {
            axios.get('http://ogiq:4000/api/history/')
                .then(r => r.data)
                .then(history => {
                    commit('SET_HISTORY', history)
                })
        },
        getEvents ({ commit }) {
            axios.get('http://ogiq:4000/api/events/')
                .then(r => r.data)
                .then(events => {
                    commit('SET_EVENTS', events)
                })
        },
        getHourly ({ commit }) {
            axios.get('http://ogiq:4000/api/hourly/')
                .then(r => r.data)
                .then(hourly => {
                    commit('SET_HOURLY', hourly)
                })
        },
        postWater ({ commit } , payload) {
            axios.post('http://ogiq:4000/api/water/', payload)
        },
        postScheduleTest ({ commit }, payload) {
            console.log ("store: action: postScheduleTest, payload: "+ payload)
            axios.post('http://ogiq:4000/api/scheduletest/', payload)
        },
        updateSchedule({ commit }, payload) {
            console.log ("store: action: addSchedule, payload: " + payload);
            axios.put('http://ogiq:4000/api/schedule/', payload)
                .then(() => {
                    this.dispatch("getSchedule");
                })
        },
        addSchedule ({ commit }, payload) {
            console.log ("store: action: addSchedule, payload: " + payload);
            axios.post('http://ogiq:4000/api/schedule/', payload)
                .then(() => {
                    this.dispatch("getSchedule");
                })
        },
        deleteSchedule ({ commit }, payload) {
            console.log ("store: action: deleteSchedule, id: " + payload.id);
            axios.delete('http://ogiq:4000/api/schedule/'+payload.id)
            .then(() => {
                this.dispatch("getSchedule");
            })
        }
    },
    mutations: {
        SET_SCHEDULE (state, payload) {
            state.schedule = payload
        }, 
        SET_ZONES (state, payload) {
            state.zones = payload
        }, 
        SET_HISTORY (state, payload) {
            state.history = payload
        },
        SET_EVENTS (state, payload) {
            state.events = payload
        },
        SET_HOURLY (state, payload) {
            state.hourly = payload
        }
    }
})