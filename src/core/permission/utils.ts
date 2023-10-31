import type { TreeDataItem as ATreeDataItem } from 'ant-design-vue/es/tree/Tree';

export interface TreeDataItem extends ATreeDataItem {
  children: any;
}

/**
 * 渲染部门至树形控件
 * @param {Array} depts 所有部门
 * @param {Number | null} parentId 父级部门ID
 * @param {number[]|string[]} keyPath ID路径
 */
export const formatDept2Tree = (
  depts: API.SysDeptListResult[],
  parentId: number | null = null,
  keyPath: (string | number)[] = [],
): TreeDataItem[] => {
  return depts
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const _keyPath = keyPath.concat(parentId || []);
      const arr = formatDept2Tree(depts, item.id, _keyPath);
      return Object.assign(item, {
        keyPath: _keyPath,
        title: item.name,
        key: item.id,
        value: item.id,
        formData: item,
        children: arr.length ? arr : null,
      });
    })
    .sort((a, b) => {
      return a.orderNum - b.orderNum;
    });
};

/**
 * 渲染菜单至树形控件
 * @param {Array} menus 所有菜单
 * @param {Number | null} parentId 父级菜单ID
 * @param {number[]|string[]} keyPath ID路径
 */
export const formatMenu2Tree = (
  menus: API.MenuTreeResult,
  parentId: number | null = null,
  keyPath: (string | number)[] = [],
): TreeDataItem[] => {
  return menus
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const _keyPath = keyPath.concat(parentId || []);
      const arr = formatMenu2Tree(menus, item.id, _keyPath);
      return Object.assign(item, {
        keyPath: _keyPath,
        title: item.name,
        key: item.id,
        value: item.id,
        formData: item,
        children: arr.length ? arr : null,
      });
    });
};

export const toTreeResp = (menus: API.MenuListResult): API.MenuTreeResult => {
  return menus.map((item) => {
    let itemType;
    switch (item.menu_type) {
      case 'D':
        itemType = 0;
        break;
      case 'M':
        itemType = 1;
        break;
      case 'C':
        itemType = 2;
        break;
      default:
        itemType = 0;
        break;
    }
    return Object.assign(item, {
      createTime: item.create_time,
      updateTime: item.update_time,
      id: item.menu_id,
      parentId: item.parent_id,
      name: item.menu_title,
      router: item.menu_path,
      perms: item.permission,
      type: itemType,
      icon: item.menu_icon,
      orderNum: item.menu_sort,
      viewPath: item.component,
      keepalive: item.no_cache,
      isShow: item.visible,
    });
  });
};

/**
 * 在树中根据ID找child
 * @param {string|number} id
 * @param {any[]} treeData 树形数据
 * @param {string} keyName 指定ID的属性名，默认是id
 * @param {string} children 指定children的属性名，默认是children
 */
export const findChildById = <T = any>(
  id,
  treeData: T[] = [],
  keyName = 'id',
  children = 'children',
) => {
  return treeData.reduce((prev, curr) => {
    if (curr[keyName] === id) {
      return curr;
    }
    if (prev) {
      return prev;
    }
    if (curr[children]?.length) {
      return findChildById(id, curr[children], keyName, children);
    }
  }, undefined);
};
