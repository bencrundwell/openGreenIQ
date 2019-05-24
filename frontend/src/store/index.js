import Vue from "vue"
import Vuex from "vuex"
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios)

export default new Vuex.Store({
    state: {
        schedule: []
     },
     actions: {
        getSchedule ({ commit }) {
            axios.get('http://ogiq:4000/api/schedule/')
                .then(r => r.data)
                .then(schedule => {
                    console.log(schedule)
                    commit('SET_SCHEDULE', schedule)
                })
        }
     },
     mutations: {
        SET_SCHEDULE (state, schedule) {
            state.schedule = schedule
          }
     }
})