import Vue from 'vue'
import Router from 'vue-router'

const DefaultContainer = () => import('@/containers/DefaultContainer')

const Dashboard = () => import('@/views/Dashboard')
const ScheduleList = () => import('@/views/ScheduleList')
const ScheduleEdit = () => import('@/views/ScheduleEdit')
const ZoneList = () => import('@/views/ZoneList')
const Zone = () => import('@/views/Zone')
const History = () => import('@/views/History')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'schedules',
          name: 'Schedules',
          component: ScheduleList
        },
        {
          path: 'schedules',
          name: 'Schedules',
          component: ScheduleEdit,
          children: [
            {
              path: ':id',
              name: 'Details'
            }
          ]
        },
        {
          path: 'zones',
          name: 'Zones',
          component: ZoneList
        },
        {
          path: 'zones',
          name: 'Zones',
          component: Zone,
          children: [
            {
              path: ':id',
              name: 'Details'
            }
          ]
        },
        {
          path: 'history',
          name: 'History',
          component: History
        }
      ]
    }
  ]
})
