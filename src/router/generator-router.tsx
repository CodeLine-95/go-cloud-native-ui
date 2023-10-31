import { Result } from 'ant-design-vue';
import { errorRoute, notFound } from './staticModules/error';
import { REDIRECT_ROUTE } from './staticModules/besidesLayout';
import outsideLayout from './outsideLayout';
import type { PermissionType } from '@/core/permission/modules/types';
import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { isUrl } from '@/utils/is';
import { uniqueSlash } from '@/utils/urlUtils';
import { asyncRoutes } from '@/router/asyncModules';
import common from '@/router/staticModules';
import router, { routes } from '@/router';
import NotFound from '@/views/error/404.vue';
import IFramePage from '@/components/basic/iframe-page';

// 需要放在所有路由之后的路由
const endRoutes: RouteRecordRaw[] = [REDIRECT_ROUTE, errorRoute, notFound];

export function filterAsyncRoute(
  routes: API.Menu[],
  parentRoute: API.Menu | null = null,
  lastNamePath: string[] = [],
): RouteRecordRaw[] {
  return routes
    .filter(
      (item) =>
        item.menu_type != 'C' && item.visible == 0 && item.parent_id != 0 && item.parent_id != null,
    )
    .map((item) => {
      console.log(item);
      const { menu_path, component, menu_title, menu_icon, menu_sort, no_cache, is_frame } = item;
      let fullPath = '';
      const pathPrefix = lastNamePath.at(-1) || '';
      if (isUrl(menu_path)) {
        fullPath = menu_path;
      } else {
        fullPath = menu_path.startsWith('/') ? menu_path : `/${menu_path}`;
        fullPath = menu_path.startsWith(pathPrefix) ? fullPath : pathPrefix + fullPath;
        fullPath = [...new Set(uniqueSlash(fullPath).split('/'))].join('/');
      }
      let realRoutePath = menu_path;
      if (parentRoute) {
        if (fullPath.startsWith(parentRoute?.menu_path)) {
          realRoutePath = fullPath.split(parentRoute.menu_path)[1];
        } else if (!isUrl(parentRoute.menu_path) && !isUrl(menu_path)) {
          realRoutePath = menu_path;
        }
      }
      realRoutePath = realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath;
      realRoutePath = realRoutePath.replace(/http(s)?:\/\//, '');
      let metaType = 0;
      switch (item.menu_type) {
        case 'D':
          metaType = 0;
          break;
        case 'M':
          metaType = 1;
          break;
        case 'C':
          metaType = 2;
          break;
        default:
          metaType = 0;
          break;
      }
      const route: Partial<RouteRecordRaw> = {
        path: realRoutePath,
        // name: `${viewPath ? toHump(viewPath) : fullPath}-${item.id}`,
        name: fullPath,
        meta: {
          orderNum: menu_sort,
          openMode: is_frame,
          isExt: false,
          icon: menu_icon,
          title: menu_title,
          type: metaType,
          perms: [],
          namePath: lastNamePath.concat(fullPath),
          keepAlive: no_cache == 0 ? false : true,
        },
      };

      // 如果是目录
      if (item.menu_type === 'D') {
        const children = filterAsyncRoute(routes, item, lastNamePath.concat(fullPath));
        if (children?.length) {
          route.component = RouterView;
          route.children = children;
          route.redirect = { name: children[0].name };
        } else {
          route.component = (
            <Result
              status="500"
              title={menu_title}
              sub-title="目录类型菜单不是真实页面，请为当前目录添加页面级子菜单或更改当前菜单类型."
            />
          );
        }
        return route;
        // 如果是页面
      } else if (item.menu_type === 'M') {
        const is_frame_bool = is_frame == 0 ? false : true;
        route.component = is_frame_bool ? (
          <IFramePage src={fullPath} />
        ) : (
          asyncRoutes[`${component}.vue`] || NotFound
        );

        const perms = routes
          .filter((n) => n.parent_id === item.menu_id)
          .flatMap((n) => n.permission?.split(','));
        if (route.meta && perms) {
          // 设置当前页面所拥有的权限
          route.meta.perms = perms as PermissionType[];
        }
        return route;
      }
      return undefined;
    })
    .filter((item): item is RouteRecordRaw => !!item);
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (asyncMenus: API.Menu[]) => {
  try {
    const routeList = filterAsyncRoute(asyncMenus);
    const layout = routes.find((item) => item.name == 'Layout')!;
    // console.log(routeList, '根据后端返回的权限路由生成');
    // 给公共路由添加namePath
    generatorNamePath(common);
    const menus = [...common, ...routeList, ...endRoutes];
    layout.children = menus;
    const removeRoute = router.addRoute(layout);
    // 获取所有没有包含children的路由，上面addRoute的时候，vue-router已经帮我们拍平了所有路由
    const filterRoutes = router
      .getRoutes()
      .filter(
        (item) =>
          (!item.children.length || Object.is(item.meta?.hideChildrenInMenu, true)) &&
          !outsideLayout.some((n) => n.name === item.name),
      );
    // 清空所有路由
    removeRoute();
    layout.children = [...filterRoutes];
    // 重新添加拍平后的路由
    router.addRoute(layout);
    console.log('所有路由', router.getRoutes());

    return Promise.resolve({
      menus,
      routes: layout.children,
    });
  } catch (error) {
    console.error('生成路由时出错', error);
    return Promise.reject(`生成路由时出错: ${error}`);
  }
};

/**
 * 主要方便于控制a-menu的open-keys，即控制左侧菜单应当展开哪些菜单
 * @param {RouteRecordRaw[]} routes 需要添加namePath的路由
 * @param {string[]} namePath
 */
export const generatorNamePath = (
  routes: RouteRecordRaw[],
  namePath?: string[],
  parent?: RouteRecordRaw,
) => {
  routes.forEach((item) => {
    if (item.meta && typeof item.name === 'string') {
      item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name];
      item.meta.fullPath = parent?.meta?.fullPath
        ? [parent.meta.fullPath, item.path].join('/')
        : item.path;
      item.meta.fullPath = uniqueSlash(item.meta.fullPath);

      if (item.children?.length) {
        generatorNamePath(item.children, item.meta.namePath, item);
      }
    }
  });
};
