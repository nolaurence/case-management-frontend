import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Table, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import {ProForm, ProFormText} from "@ant-design/pro-components";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { searchUser } from "@/services/ant-design-pro/api";

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
  }
];

const Manage: React.FC = () => {

  const [ pagination, setPagination ] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [ tableData, setTableData ] = useState<API.UserInfo[]>();

  return (
    <PageContainer title="用户管理1">
      <Card>
        <ProForm
          layout="horizontal"
          onFinish={async (values) => {
            console.log(JSON.stringify(pagination));
            const searchResult = await searchUser({
              account: (values && values.account) || undefined,
              name: (values && values.name) || undefined,
              userid: (values && values.userid) || undefined,
              pageSize: pagination.pageSize,
              current: pagination.current,
            });

            debugger;
            // 设置数据
            setTableData(searchResult.list);
            const paginationResult = searchResult.pagination;
            // 设置分页
            setPagination({
              current: paginationResult && paginationResult.current,
              pageSize: paginationResult && paginationResult.pageSize,
              showTotal: () => paginationResult && `总共 ${paginationResult.total} 个用户`,
              total: paginationResult && paginationResult.total,
            });
          }}
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
        />
      </Card>
    </PageContainer>
  );
};

export default Manage;
