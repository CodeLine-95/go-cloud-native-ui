import type { FormSchema } from '@/components/core/schema-form/';

export const roleSchemas: FormSchema<API.CreateRoleParams>[] = [
  {
    field: 'role_name',
    component: 'Input',
    label: '名称',
    rules: [{ required: true, type: 'string' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'role_key',
    component: 'Input',
    label: '标识',
    rules: [{ required: true, type: 'string' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'role_remark',
    component: 'InputTextArea',
    label: '备注',
  },
];
