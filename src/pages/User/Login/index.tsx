import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
// import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Button, message, Row } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
// import RegisterDrawer from './registerDrawer';
import { createStyles } from 'antd-style';

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

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Login: React.FC = () => {
  const { styles } = useStyles();

  const [buttonLoading, setButtonLoading] = useState(false);

  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
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
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      setButtonLoading(true);
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
    } catch (error: any) {
      if (error?.name === 'BizError') {
        message.error(error.info.errorMessage);
      }
    } finally {
      setButtonLoading(false);
    }
  };
  const SubmitterButton: React.FC = () => {
    let btnText: string = '登 录';
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // height: "100vh"
        }}
      >
        <Button loading={buttonLoading} type="primary" size="large" block htmlType="submit">
          {btnText}
        </Button>
      </div>
    );
  };
  return (
    <div className={styles.container}>
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
          title="AssetManageSystem"
          subTitle={'请登录'}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            render: () => {
              return <SubmitterButton />;
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {userLoginState.success === false && (
            <LoginMessage content={userLoginState.message || ''} />
          )}
          <>
            <ProFormText
              name="account"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'用户名: '}
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
              placeholder={'密码: '}
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
                {/*<RegisterDrawer />*/}
                <a
                  style={{
                    float: 'right',
                  }}
                  onClick={() => {
                    message.info('还未实现');
                  }}
                >
                  忘记密码 ?
                </a>
              </Row>
            </div>
          </>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
