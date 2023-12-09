import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Table, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import {ProForm, ProFormText} from "@ant-design/pro-components";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  userid: number;
  account: string;
  name: string;
}

const columns: ColumnsType<DataType> = [
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
  }
];

const data: DataType[] = [
  {
    userid: 1,
    account: 'admin',
    name: '管理员',
  },
  {
    userid: 2,
    account: 'user',
    name: '用户',
  },
];

const Manage: React.FC = () => {
  return (
    <PageContainer title="用户管理1">
      <Card>
        <ProForm
          layout="horizontal"
          onFinish={async (values) => {
            console.log(values);
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
          dataSource={data}
          rowKey="id"
        />
      </Card>
    </PageContainer>
  );
};

export default Manage;
