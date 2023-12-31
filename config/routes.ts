export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  { path: '/user_manage', icon: 'user', component: './User/Manage', name: '用户管理' },
  { path: '/demo', icon: 'smile', component: './MindMapDemo', name: 'Mindmap' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },
  { icon: 'table', path: '/list', component: './TableList', name: '列表页' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
