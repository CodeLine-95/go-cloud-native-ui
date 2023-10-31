import { Tag } from 'ant-design-vue';
import type { TableColumn } from '@/components/core/dynamic-table';

export type TableListItem = API.MenuListResultItem;
export type TableColumnItem = TableColumn<TableListItem>;

/**
 * 将对应菜单类型转为字符串字意
 */
const getMenuType = (type) => {
  switch (type) {
    case 'D':
      return '目录';
    case 'M':
      return '菜单';
    case 'C':
      return '权限';
    default:
      return '';
  }
};

export const baseColumns: TableColumnItem[] = [
  {
    title: '名称',
    dataIndex: 'menu_title',
    width: 240,
    fixed: 'left',
  },
  {
    title: '图标',
    width: 80,
    dataIndex: 'menu_icon',
    align: 'center',
    customRender: ({ record }) =>
      record.menu_icon && <icon-font type={record.menu_icon} size="22" />,
  },
  {
    title: '类型',
    width: 80,
    align: 'center',
    dataIndex: 'menu_type',
    customRender: ({ record }) => getMenuType(record.menu_type),
  },
  {
    title: '节点路由',
    dataIndex: 'menu_path',
    align: 'center',
    width: 240,
  },
  {
    title: '路由缓存',
    dataIndex: 'no_cache',
    align: 'center',
    width: 80,
    customRender: ({ record }) => record.menu_type === 'M' && (record.no_cache == 1 ? '是' : '否'),
  },
  {
    title: '文件路径',
    width: 280,
    align: 'center',
    dataIndex: 'component',
  },
  {
    title: '权限',
    width: 300,
    align: 'center',
    dataIndex: 'permission',
    customRender: ({ record }) =>
      record.menu_type != 'D' && (
        <div>
          {record.permission?.split(',').map((i) => (
            <Tag color="blue" key={i}>
              {i}
            </Tag>
          ))}
        </div>
      ),
  },
  {
    title: '排序号',
    width: 80,
    align: 'center',
    dataIndex: 'menu_sort',
  },
  {
    title: '更新时间',
    width: 180,
    align: 'center',
    dataIndex: 'update_time',
  },
];
