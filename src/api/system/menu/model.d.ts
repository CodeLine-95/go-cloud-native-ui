declare namespace API {
  type MenuListResultItem = {
    create_time: number;
    update_time: number;
    create_by: number;
    update_by: number;
    menu_id: number;
    parent_id: number;
    menu_title: string;
    menu_name: string;
    menu_icon: string;
    menu_path: string;
    path_group: string;
    /** 当前菜单类型：D目录、M模块、C按钮 */
    menu_type: string;
    menu_method: string;
    permission: string;
    menu_sort: number;
    component: string;
    keepalive: boolean;
    visible: number;
    no_cache: number;
    is_frame: number;
  };

  type MenuTreeResultItem = {
    createTime: string;
    updatedAt: string;
    id: number;
    parentId: number;
    name: string;
    router: string;
    perms: string;
    /** 0: '目录', 1: '菜单', 2: '权限'  */
    type: number;
    icon: string;
    orderNum: number;
    viewPath: string;
    keepalive: boolean;
    isShow: boolean;
    keyPath?: number[];
  };
  type MenuTreeResult = MenuTreeResultItem[];

  /** 获取菜单列表参数 */
  type MenuListResult = MenuListResultItem[];

  /** 新增菜单参数 */
  type MenuAddParams = {
    create_time: number;
    update_time: number;
    create_by: number;
    update_by: number;
    parent_id: number;
    menu_title: string;
    menu_name: string;
    menu_icon: string;
    menu_path: string;
    path_group: string;
    /** 当前菜单类型：D目录、M模块、C按钮 */
    menu_type: string;
    menu_method: string;
    permission: string;
    menu_sort: number;
    component: string;
    keepalive: boolean;
    visible: number;
    no_cache: number;
    is_frame: number;
  };

  /** 更新某项菜单参数 */
  type MenuUpdateParams = MenuAddParams & {
    menu_id: number;
  };

  /** 获取菜单详情结果 */
  type MenuInfoResult = {
    menu: {
      createTime: string;
      updateTime: string;
      id: number;
      parentId: number;
      name: string;
      router: string;
      perms: string;
      type: number;
      icon: string;
      orderNum: number;
      viewPath: string;
      keepalive: boolean;
      isShow: boolean;
    };
    parentMenu: {
      createTime: string;
      updateTime: string;
      id: number;
      parentId: number;
      name: string;
      router: string;
      perms: string;
      type: number;
      icon: string;
      orderNum: number;
      viewPath: string;
      keepalive: boolean;
      isShow: boolean;
    };
  };
}
