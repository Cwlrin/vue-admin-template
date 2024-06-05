import layout from '@/layout'
export default {
  path: '/attendance',
  name: 'Attendance',
  component: layout,
  children: [{
    path: '',
    name: 'attendance',
    component: () => import('@/views/attendance'),
    meta: {
      title: '考勤',
      icon: 'excel'
    }
  }]
}
