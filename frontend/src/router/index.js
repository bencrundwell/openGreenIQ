import Vue from 'vue'
import Router from 'vue-router'

const DefaultContainer = () => import('@/containers/DefaultContainer')

const Dashboard = () => import('@/views/Dashboard')
const Schedule = () => import('@/views/Schedule')
const Zones = () => import('@/views/Zones')
const Zone = () => import('@/views/Zone')

Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
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
          path: 'schedule',
          name: 'Schedule',
          component: Schedule
        },
        {
          path: 'zones',
          name: 'Zones',
          component: Zones,
          children: [
            {
              path: ':id',
              name: 'Details',
              component: Zone
            }
          ]
        }
      ]
    }
  ]
})
