import type { TableColumn } from '@/components/core/dynamic-table';
// import { Avatar, Space, Tag } from 'ant-design-vue';

export type TableListItem = API.RoleListResultItem;
export type TableColumnItem = TableColumn<TableListItem>;

export const baseColumns: TableColumnItem[] = [
  {
    title: '#',
    dataIndex: 'role_id',
    width: 55,
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '名称',
    width: 200,
    align: 'center',
    dataIndex: 'role_name',
  },
  {
    title: '标识',
    width: 80,
    align: 'center',
    dataIndex: 'role_key',
  },
  {
    title: '备注',
    dataIndex: 'role_remark',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    align: 'center',
    hideInSearch: true,
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'update_time',
    hideInSearch: true,
  },
];
