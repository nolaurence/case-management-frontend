import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
// import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Button, message, Tabs, Row } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import RegisterDrawer from './registerDrawer';
// const ActionIcons = () => {
//   const langClassName = useEmotionCss(({ token }) => {
//     return {
//       marginLeft: '8px',
//       color: 'rgba(0, 0, 0, 0.2)',
//       fontSize: '24px',
//       verticalAlign: 'middle',
//       cursor: 'pointer',
//       transition: 'color 0.3s',
//       '&:hover': {
//         color: token.colorPrimaryActive,
//       },
//     };
//   });
//   return (
//     <>
//       <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
//       <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
//       <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
//     </>
//   );
// };
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
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
  const handleSubmit = async (values: API.LoginParams) => {
    // TODO: 注册单独实现，这里不做
    const result = await login(values, { skipErrorHandler: true });
    if (result.success) {
      const defaultLoginSuccessMessage = '登录成功！';
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    } else {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
    console.log(result.message);
    // 如果失败去设置用户错误信息
    setUserLoginState(result);
  };
  const SubmitterButton: React.FC = () => {
    let btnText: string = '';
    if (type === 'account') {
      btnText = '登 录';
    } else if (type === 'register') {
      btnText = '注 册';
    }
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh"
      }}>
        <Button type="primary" size="large" block htmlType="submit">{btnText}</Button>
      </div>
    );
  }
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      {/*<Lang />*/}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true,
          }}
          // actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          submitter={{
            render: () => {
              return <SubmitterButton />;
            }
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '登录',
              },
              // {
              //   key: 'register',
              //   label: '注册',
              // },
            ]}
          />

          {userLoginState.success === false && (
            <LoginMessage content={userLoginState.message || ''} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'密码: ant.design'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <div
                style={{
                  marginBottom: 42,
                }}
              >
                <Row justify="end">
                  <RegisterDrawer />
                  <a
                    style={{
                      float: 'right',
                    }}
                    onClick={() => {
                      message.info("还未实现");
                    }}
                  >
                    忘记密码 ?
                  </a>
                </Row>
              </div>
            </>
          )}
          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                name="username"
                placeholder={'用户名！'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码！'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPasswork"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码！'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
