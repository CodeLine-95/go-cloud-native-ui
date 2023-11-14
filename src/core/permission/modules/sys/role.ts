export const sysRole = {
  list: 'role/list',
  add: 'role/add',
  edit: 'role/edit',
  del: 'role/del',
} as const;

export const values = Object.values(sysRole);

export type SysRolePerms = (typeof values)[number];

export default sysRole;
