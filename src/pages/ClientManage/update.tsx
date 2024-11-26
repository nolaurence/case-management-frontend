import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import {useParams} from 'umi';
import {addClient, getClientById, updateClient} from '@/services/ant-design-pro/api';
import {ProForm, ProFormText} from "@ant-design/pro-components";
import {history} from "@@/core/history";

const UpdateClient: React.FC = () => {
  const params = useParams();
  const [form] = ProForm.useForm();

  const fetchData = async () => {
    const clientId = Number(params.clientId);
    if (!clientId) {
      message.error('参数错误');
      return Promise.reject();
    }
    const resp = await getClientById(clientId);
    if (resp.success) {
      form.setFieldsValue({
        clientName: resp.data.clientName,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card
      title="修改客户信息"
    >
      <ProForm
        form={form}
        onFinish={async (values) => {
          const resp = await updateClient({
            clientId: Number(params.clientId),
            clientName: values.clientName,
          });
          if (resp.data === true) {
            message.success('更新成功');
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
  );
};

export default UpdateClient;
