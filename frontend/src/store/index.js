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
        postWater ({ commit } , payload) {
            axios.post('http://ogiq:4000/api/water/', payload)
        },
        postScheduleTest ({ commit } , payload) {
            console.log ("store: action: postScheduleTest, payload: "+ payload)
            axios.post('http://ogiq:4000/api/scheduletest/', payload)
        },
        updateSchedule({ commit}, payload) {
            axios.put('http://ogiq:4000/api/schedule/', payload)
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
        },
        SET_EVENTS (state, events) {
            state.events = events
        }
    },
    getters: {
        // convertTime: state => {
        //     console.log ("convertTime:");
        //     return state.schedule.map(s => {
        //         var hours = Math.floor(s.start_time / 60);  
        //         var minutes = s.start_time % 60;
        //         if (minutes < 10) minutes = '0' + minutes;
        //         s.start_time_txt = hours + ":" + minutes + ":00";
        //         return s;
        //     })
        // }
        // convertTxtToTime: state => {
        //     return state.schedule.map(s => {
        //         var hours = s.start_time_txt.split(':')[0];
        //         var minutes = s.start_time_txt.split(':')[1];
        //         s.start_time = (hours * 60) + minutes;
        //         return s;
        //     });
        // }
    }
})