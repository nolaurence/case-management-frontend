import React from 'react';
import { message } from 'antd';
import { register, login } from '@/services/ant-design-pro/api';
import {history, useModel } from '@umijs/max';
import { DrawerForm, ProFormRadio, ProFormText } from "@ant-design/pro-components";
import {flushSync} from "react-dom";

const RegisterDrawer: React.FC = () => {

  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  return (
    <DrawerForm
      title="用户注册"
      trigger={
        <a style={{ marginLeft: 10, marginRight: 10 }}>注册</a>
      }
      layout="vertical"
      onFinish={async (values) => {
        const result = await register(values as API.RegisterParams);
        if (result.success) {
          message.success('注册成功！执行自动登录~~');

          // 执行自动登录
          const loginResult = await login(values as API.LoginParams);
          if (loginResult.success) {
            await fetchUserInfo();
            const urlParams = new URL(window.location.href).searchParams;
            history.push(urlParams.get('redirect') || '/');
            return;
          } else {
            message.error('自动登录失败，请手动登录！');
            return true;
          }
        } else {
          message.error('注册失败，请重试！');
          return false;
        }
      }}
      submitter={{
        searchConfig: {
          submitText: '注  册',
        },
        resetButtonProps: {
        style: {
          // 隐藏重置按钮
          display: 'none',
          },
        },
      }}
    >
      <ProFormText
        name="account"
        label="登录名"
        tooltip="用于登录"
        width="md"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormText
        name="name"
        label="名称"
        width="md"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        width="md"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormText.Password
        name="checkPassword"
        label="确认密码"
        width="md"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormRadio.Group
        name="gender"
        label="性别"
        initialValue={1}
        options={[
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 2,
          }
        ]}
      />
      <ProFormText
        name="email"
        width="md"
        label="邮箱"
      />
      <ProFormText
        name="phone"
        width="md"
        label="电话"
      />
    </DrawerForm>
  );
};

export default RegisterDrawer;
