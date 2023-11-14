<template>
  <div>
    <DynamicTable
      row-key="id"
      header-title="角色管理"
      :data-request="loadTableData"
      :columns="columns"
      bordered
      size="small"
    >
      <template #toolbar>
        <a-button type="primary" :disabled="!$auth('sys.role.add')" @click="openMenuModal({})">
          新增
        </a-button>
      </template>
    </DynamicTable>
  </div>
</template>

<script lang="ts" setup>
  import { baseColumns, type TableListItem, type TableColumnItem } from './columns';
  import { roleSchemas } from './formSchemas';
  import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import {
    getRoleList,
    updateRole,
    createRole,
    deleteRole,
  } from '@/api/system/role';
  import { useTable } from '@/components/core/dynamic-table';
  import { useFormModal } from '@/hooks/useModal/useFormModal';
  import { reactive } from 'vue';

  defineOptions({
    name: 'SystemPermissionRole',
  });

  const [DynamicTable, dynamicTableInstance] = useTable({
    search: false,
    pagination: false,
    size: 'small',
    rowKey: 'role_id',
    bordered: true,
    scroll: { x: 2000 },
  });

  const [showModal] = useFormModal();

  const state = reactive({
    params: {
      page: 1,
      page_size: 10,
      search_key: ''
    },
  });

  const loadTableData = async () => {
    const data = await getRoleList(state.params);

    return { list: data.list || [] };
  };

  const getCheckedKeys = (checkedList: number[], options: TreeDataItem[], total = []) => {
    return options.reduce<number[]>((prev, curr) => {
      if (curr.children?.length) {
        getCheckedKeys(checkedList, curr.children, total);
      } else {
        if (checkedList.includes(curr.value)) {
          prev.push(curr.value);
        }
      }
      return prev;
    }, total);
  };

  /**
   * @description 打开新增/编辑弹窗
   */
  const openMenuModal = async (record: Partial<TableListItem>) => {
    const [formRef] = await showModal<API.UpdateRoleParams>({
      modalProps: {
        title: `${record.role_id ? '编辑' : '新增'}角色`,
        width: '50%',
        onFinish: async (values) => {
          record.role_id && (values.role_id = record.role_id);
          const menusRef = formRef?.compRefMap.get('menus')!;
          const deptsRef = formRef?.compRefMap.get('depts')!;
          const params = {
            ...values,
            menus: [...menusRef.halfCheckedKeys, ...menusRef.checkedKeys],
            depts: [...deptsRef.halfCheckedKeys, ...deptsRef.checkedKeys],
          };
          console.log('新增/编辑角色', params);
          await (record.role_id ? updateRole : createRole)(params);
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: roleSchemas,
      },
    });
  };
  const delRowConfirm = async (record: TableListItem) => {
    await deleteRole({ role_id: record.role_id });
    dynamicTableInstance?.reload();
  };

  const columns: TableColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 160,
      dataIndex: 'ACTION',
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      actions: ({ record }) => [
        {
          label: '编辑',
          auth: {
            perm: 'sys.role.update',
            effect: 'disable',
          },
          onClick: () => openMenuModal(record),
        },
        {
          label: '删除',
          auth: 'sys.role.delete',
          popConfirm: {
            title: '你确定要删除吗？',
            onConfirm: () => delRowConfirm(record),
          },
        },
      ],
    },
  ];
</script>
