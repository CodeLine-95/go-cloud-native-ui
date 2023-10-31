<template>
  <div>
    <DynamicTable header-title="菜单管理" :data-request="loadTableData" :columns="columns">
      <template #toolbar>
<!--        <a-button type="primary" :disabled="!$auth('sys.menu.add')" @click="openMenuModal({})">-->
<!--          新增-->
<!--        </a-button>-->
        <a-button type="primary" @click="openMenuModal({})">
          新增
        </a-button>
      </template>
    </DynamicTable>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { baseColumns, type TableListItem, type TableColumnItem } from './columns';
  import { useMenuSchemas } from './formSchemas';
  import type { TreeSelectProps } from 'ant-design-vue';
  import { getMenuList, updateMenu, createMenu, deleteMenu } from '@/api/system/menu';
  import { useTable } from '@/components/core/dynamic-table';
  import { useFormModal } from '@/hooks/useModal/useFormModal';
  import { formatMenu2Tree, toTreeResp } from "@/core/permission/utils";

  defineOptions({
    name: 'SysMenu',
  });

  const menuTree = ref<TreeSelectProps['treeData']>([]);
  const [DynamicTable, dynamicTableInstance] = useTable({
    search: false,
    pagination: false,
    size: 'small',
    rowKey: 'id',
    bordered: true,
    scroll: { x: 2000 },
  });
  const [showModal] = useFormModal();

  const loadTableData = async () => {
    const data = await getMenuList({is_tree: 0});
    const treeData = toTreeResp(data);
    menuTree.value = formatMenu2Tree(
      cloneDeep(treeData).filter((n) => n.type !== 2),
      0,
    );

    return { list: formatMenu2Tree(cloneDeep(treeData), 0) };
  };

  const openMenuModal = async (record: Partial<TableListItem>) => {
    const [formRef] = await showModal({
      modalProps: {
        title: `${record.menu_id ? '编辑' : '新增'}菜单`,
        width: 700,
        onFinish: async (values) => {
          console.log('新增/编辑菜单', values);
          record.menu_id && (values.menuId = record.menu_id);
          if (values.menu_type !== 'D' && values.component?.length) {
            values.component = values.component.join('/');
          }
          if (values.menu_type !== 'D' && values.permission?.length) {
            values.permission = values.permission.map((n) => n.join(':')).toString();
          }
          await (record.menu_id ? updateMenu : createMenu)(values);
          dynamicTableInstance.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: useMenuSchemas(),
      },
    });

    formRef?.updateSchema([
      {
        field: 'parentId',
        componentProps: {
          treeDefaultExpandedKeys: [-1].concat(record?.parent_id || []),
          treeData: ref([{ id: -1, name: '一级菜单', children: menuTree.value }]),
        },
      },
    ]);

    formRef?.setFieldsValue({
      ...record,
      icon: record.menu_icon ?? '',
      perms: record.permission
        ?.split(',')
        .filter(Boolean)
        .map((n) => n.split(':')),
      viewPath: record.component?.split('/'),
      parentId: record.parent_id ?? -1,
    });
  };
  const delRowConfirm = async (record: TableListItem) => {
    await deleteMenu({ menuId: record.menu_id });
    dynamicTableInstance.reload();
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
          // auth: {
          //   perm: 'sys.menu.update',
          //   effect: 'disable',
          // },
          onClick: () => openMenuModal(record),
        },
        {
          label: '删除',
          // auth: 'sys.menu.delete',
          popConfirm: {
            title: '你确定要删除吗？',
            onConfirm: () => delRowConfirm(record),
          },
        },
      ],
    },
  ];
</script>
