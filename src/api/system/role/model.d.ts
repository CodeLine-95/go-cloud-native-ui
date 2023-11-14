declare namespace API {
  /** 新增角色 */
  type CreateRoleParams = {
    role_name: string;
    role_key: string;
    role_remark: string;
    role_sort: number;
    status: number;
  };
  /** 更新角色 */
  type UpdateRoleParams = CreateRoleParams & {
    role_id: number;
  };

  /** 角色列表项 */
  type RoleListResultItem = {
    create_time: number;
    update_time: number;
    create_by: number;
    update_by: number;
    role_id: number;
    role_name: string;
    role_key: string;
    role_remark: string;
    role_sort: number;
    status: number;
  };

  /** 角色列表 */
  type RoleListResult = RoleListResultItem[];
}
