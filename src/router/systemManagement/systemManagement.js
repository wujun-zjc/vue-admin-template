/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/systemManagement',
  component: Layout,
  redirect: '/systemManagement/organizational',
  name: 'SystemManagement',
  meta: {
    title: 'SystemManagement',
    icon: 'systemManagement'
  },
  children: [
    {
      path: 'organizational',
      component: () => import('@/views/systemManagement/organizational/index'),
      name: 'Organizational',
      meta: {
        title: 'Organizational',
        icon: 'organizational'
      }
    },
    {
      path: 'peopleManagement',
      component: () => import('@/views/systemManagement/peopleManagement/index'),
      name: 'PeopleManagement',
      meta: {
        title: 'PeopleManagement',
        icon: 'peopleManagement'
      }
    },
    {
      path: 'rolesList',
      component: () => import('@/views/systemManagement/rolesList/index'),
      name: 'RolesList',
      meta: {
        title: 'RolesList',
        icon: 'rolesList'
      }
    },
    // {
    //   path: 'messages',
    //   component: () => import('@/views/systemManagement/messages/index'),
    //   name: 'Messages',
    //   meta: {
    //     title: 'Messages',
    //     icon: 'messages'
    //   }
    // }
    {
      path: 'logManagement',
      component: () => import('@/views/systemManagement/logManagement/index'),
      name: 'LogManagement',
      meta: {
        title: 'LogManagement',
        icon: 'logManagement'
      }
    },
  ]
}
export default systemRouter
