import { SHOW_CHILD } from 'ant-design-vue/es/vc-cascader';
import type { FormSchema } from '@/components/core/schema-form/';
import IconsSelect from '@/components/basic/icons-select/index.vue';
import { asyncRoutes } from '@/router/asyncModules';
import { formarPermsToCascader, str2tree } from '@/core/permission';

/** 菜单类型 0: 目录 | 1: 菜单 | 2: 权限 */
// const isDir = (type: API.MenuListResultItem['menu_type'] == 'D') => type === 0;
const isMenu = (menu_type: API.MenuListResultItem['menu_type']) => menu_type === 'M';
const isPerm = (menu_type: API.MenuListResultItem['menu_type']) => menu_type === 'C';

export const useMenuSchemas = (): FormSchema<API.MenuAddParams>[] => [
  {
    field: 'menu_type',
    component: 'RadioGroup',
    label: '菜单类型',
    defaultValue: 'D',
    rules: [{ required: true, type: 'string' }],
    componentProps: {
      options: [
        {
          label: '目录',
          value: 'D',
        },
        {
          label: '菜单',
          value: 'M',
        },
        {
          label: '权限',
          value: 'C',
        },
      ],
    },
  },
  {
    field: 'menu_title',
    component: 'Input',
    label: ({ formModel }) => (isPerm(formModel['menu_type']) ? '权限名称' : '节点名称'),
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'parent_id',
    component: 'TreeSelect',
    label: '上级节点',
    componentProps: {
      fieldNames: {
        label: 'name',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, type: 'number' }],
  },
  {
    field: 'menu_path',
    component: 'Input',
    label: '节点路由',
    vIf: ({ formModel }) => !isPerm(formModel['menu_type']),
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'permission',
    component: 'Cascader',
    label: '权限',
    vIf: ({ formModel }) => isPerm(formModel['menu_type']),
    rules: [{ required: true, type: 'array', message: '请选择权限' }],
    componentProps: {
      multiple: true,
      showCheckedStrategy: SHOW_CHILD,
      options: formarPermsToCascader(),
    },
    componentSlots: {
      displayRender: ({ slotData }) => slotData?.labels?.join(':'),
    },
  },
  {
    field: 'component',
    component: 'Cascader',
    label: '文件路径',
    vIf: ({ formModel }) => isMenu(formModel['menu_type']),
    componentProps: {
      options: Object.keys(asyncRoutes).reduce(
        (prev, curr) => (str2tree(curr, prev, '/'), prev),
        [],
      ),
    },
    rules: [{ required: true, type: 'array' }],
  },
  {
    field: 'menu_icon',
    component: () => IconsSelect,
    label: '节点图标',
    vIf: ({ formModel }) => !isPerm(formModel['menu_type']),
  },
  {
    field: 'no_cache',
    component: 'Switch',
    label: '是否缓存',
    defaultValue: true,
    vIf: ({ formModel }) => isMenu(formModel['menu_type']),
  },
  {
    field: 'is_frame',
    component: 'RadioGroup',
    label: '打开方式',
    defaultValue: 1,
    vIf: ({ formModel }) => isMenu(formModel['menu_type']),
    colProps: {
      span: 12,
    },
    componentProps: {
      optionType: 'button',
      buttonStyle: 'solid',
      options: [
        {
          label: '内嵌页打开',
          value: 0,
        },
        {
          label: '新窗口打开',
          value: 1,
        },
      ],
    },
  },
  {
    field: 'visible',
    component: 'Switch',
    label: '是否显示',
    defaultValue: true,
    vIf: ({ formModel }) => !isPerm(formModel['menu_type']),
  },
  {
    field: 'menu_sort',
    component: 'InputNumber',
    label: '排序号',
    defaultValue: 255,
    componentProps: {
      style: {
        width: '100%',
      },
    },
  },
];
