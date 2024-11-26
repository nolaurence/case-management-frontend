import { getEnv } from '@/services/ant-design-pro/api';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
const Footer: React.FC = () => {
  // const defaultMessage = '测试用例管理平台';
  const currentYear = new Date().getFullYear();

  const [env, setEnv] = useState<string>('');

  const fetchEnv = async () => {
    const resp = await getEnv();
    setEnv(String(resp.data));
  };

  useEffect(() => {
    fetchEnv();
  }, []);

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} 当前环境：${env}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
