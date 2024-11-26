import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { addClient } from '@/services/ant-design-pro/api';

const AddClient: React.FC = () => {
  return (
    <>
      <Card
        title="添加客户"
      >
        <ProForm
          onFinish={async (values) => {
            const resp = await addClient({
              clientName: values.clientName,
            });
            if (resp.data === true) {
              message.success('添加成功');
              // 跳转到客户列表
              history.replace('/clientManage');
            }
          }}
        >
          <ProFormText
            name="clientName"
            label="客户名称"
            rules={[{ required: true }]}
          />
        </ProForm>
      </Card>
    </>
  );
};

export default AddClient;
