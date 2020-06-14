import Vue from 'vue'
import Router from 'vue-router'

const DefaultContainer = () => import('@/containers/DefaultContainer')

const Dashboard = () => import('@/views/Dashboard')
const ScheduleList = () => import('@/views/ScheduleList')
const ScheduleEdit = () => import('@/views/ScheduleEdit')
const ScheduleNew = () => import('@/views/ScheduleNew')
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
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'All Schedules',
              component: ScheduleList,
            },
            {
              path: 'add',
              name: 'Add Schedule',
              component: ScheduleNew
            },{
              path: ':id',
              name: 'Details',
              component: ScheduleEdit,
            }
          ]
        },
        {
          path: 'zones',
          meta: {
            label: 'Zones'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'All Zones',
              component: ZoneList,
            },
            {
              path: ':id',
              meta: {
                label: 'Zone Details'
              },
              name: 'Zone',
              component: Zone,
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
