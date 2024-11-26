import React, {useState, useEffect} from 'react';
import {List, Card, Divider, Button} from 'antd';
import {ProForm, ProFormText} from "@ant-design/pro-components";
import {getClientList} from "@/services/ant-design-pro/api";

const ClientManage: React.FC = () => {

  const [clientInfoList, setClientInfoList] = useState<API.ClientInfo[]>([]);
  const [pagination, setPagination] = useState<API.Pagination>({
    position: 'bottom',
    align: 'center',
    current: 1,
    pageSize: 20,
  });

  const fetchData = async () => {
    const resp = await getClientList({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (resp.data) {
      setClientInfoList(resp.data.list || []);
      setPagination({
        ...pagination,
        total: resp.data.pagination?.total || 0,
        current: resp.data.pagination?.current || 0,
        pageSize: resp.data.pagination?.pageSize || 0,
      });
    }
    return Promise.resolve();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>客户管理</h2>
      <Card>
        <ProForm
          onFinish={async (values) => {
            const resp = await getClientList({
              name: values.clientName,
              currentPage: pagination.current,
              pageSize: pagination.pageSize,
            });
            if (resp.data) {
              setClientInfoList(resp.data.list || []);
              setPagination({
                ...pagination,
                total: resp.data.pagination?.total || 0,
                current: resp.data.pagination?.current || 1,
                pageSize: resp.data.pagination?.pageSize || 20,
              });
            }
          }}
        >
          <ProFormText name="clientName" label="客户名称"/>
        </ProForm>
        <Divider/>
        <Button type="primary" href="#/clientManage/add">添加客户</Button>
        <Divider/>
        <List
          itemLayout="horizontal"
          dataSource={clientInfoList}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showTotal: () => `共 ${pagination.total} 条`,
            align: pagination.align,
            position: pagination.position,
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a href={`#/clientManage/update/${item.clientId}`} key={item.clientId}>编辑</a>,
              ]}
            >
              <List.Item.Meta
                title={item.clientName}
                description={`id: ${item.clientId}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default ClientManage;
