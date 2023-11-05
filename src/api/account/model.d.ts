declare namespace API {
  type Menu = {
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
    child_node?: Menu[];
  };

  type PermMenu = {
    menus: Menu[];
    perms: string[];
  };

  type AdminUserInfo = {
    create_time: number;
    update_time: number;
    last_time: number;
    id: number;
    user_name: string;
    pass_word: string;
    login_ip: string;
    user_email: string;
    status: number;
    role_id: number;
  };
}
