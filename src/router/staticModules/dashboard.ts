import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'dashboard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: `${moduleName}-welcome`,
    component: () =>
      import(/* webpackChunkName: "dashboard-welcome" */ '@/views/dashboard/welcome/index.vue'),
    meta: {
      title: t('routes.dashboard.dashboard'),
      icon: 'icon-yibiaopan',
    },
  },
];

export default routes;
