import { request } from '@/utils/request';
import Api from '@/core/permission/modules/sys/role';
export function getRoleList(data?: API.PageParams<{ search_key?: string }>) {
  return request({
    url: Api.list,
    method: 'post',
    data,
  });
}

export function createRole(data: API.CreateRoleParams) {
  return request(
    {
      url: Api.add,
      method: 'post',
      data,
    },
    {
      successMsg: '创建角色成功',
    },
  );
}

export function updateRole(data: API.UpdateRoleParams) {
  return request(
    {
      url: Api.edit,
      method: 'post',
      data,
    },
    {
      successMsg: '更新角色成功',
    },
  );
}

export function deleteRole(data: { role_id: number }) {
  return request(
    {
      url: Api.del,
      method: 'post',
      data,
    },
    {
      successMsg: '删除角色成功',
    },
  );
}
