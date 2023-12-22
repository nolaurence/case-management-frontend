import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import {ProForm, ProFormText} from "@ant-design/pro-components";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { searchUser } from "@/services/ant-design-pro/api";
import {useModel} from "@@/exports";

enum UserRole {
  admin = 1,
  user = 2,
}

const Manage: React.FC = () => {

  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser || { role: 2 };
  const isAdmin = currentUser.role === UserRole.admin;

  const columns: ColumnsType<API.UserInfo> = [
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
    },
    {
      title: '登录名',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: number) => (UserRole[role] || 'Unknown')
    },
    {
      title: '操作',
      key: 'operations',
      render: () => {
        if (isAdmin) {
          return <Button type="link" >管理员按钮</Button>;
        } else {
          return <Button type="link" disabled >用户禁用</Button>;
        }
      }
    }
  ];

  const [ pagination, setPagination ] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [ tableData, setTableData ] = useState<API.UserInfo[]>();
  const [ tableLoading, setTableLoading ] = useState<boolean>(false);

  const search = async (values: Record<string, any>)=> {
    setTableLoading(true);
    const searchResult = await searchUser({
      account: (values && values.account) || undefined,
      name: (values && values.name) || undefined,
      userid: (values && values.userid) || undefined,
      pageSize: pagination.pageSize,
      current: pagination.current,
    });

    // 设置数据
    setTableData(searchResult.data.list);
    const paginationResult = searchResult.data.pagination;
    // 设置分页
    setPagination({
      current: paginationResult && paginationResult.current,
      pageSize: paginationResult && paginationResult.pageSize,
      showTotal: () => paginationResult && `总共 ${paginationResult.total} 个用户`,
      total: paginationResult && paginationResult.total,
    });
    setTableLoading(false);
  }

  useEffect(() => {
    search({});
  }, []);

  return (
    <PageContainer title="用户管理页">
      <Card>
        <ProForm
          layout="horizontal"
          onFinish={search}
          onReset={() => search({})}
          submitter={{
            searchConfig: {
              submitText: '搜索',
              resetText: '重置',
            }
          }}
        >
          <ProForm.Group>
            <ProFormText
              name="account"
              label="登录名"
            />
            <ProFormText
              name="name"
              label="用户名"
            />
            <ProFormText
              name="userid"
              label="用户ID"
            />
          </ProForm.Group>
        </ProForm>
        <Divider />
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          loading={tableLoading}
        />
      </Card>
    </PageContainer>
  );
};

export default Manage;
