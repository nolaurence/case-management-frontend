import {deleteSalesRecord, getClientList, getTotalPrice, searchSalesRecord} from '@/services/ant-design-pro/api';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {ProForm, ProFormDatePicker, ProFormRadio} from '@ant-design/pro-components';
import type {DescriptionsProps, TableColumnsType} from 'antd';
import {Button, Descriptions, Divider, Flex, Image, message, Modal, Table} from 'antd';
import dayjs from 'dayjs';
import React, {useState, useEffect} from 'react';

const {confirm} = Modal;

interface SalesRecordColumn {
  id: number;
  description: string;
  amount: number;
  imageURL: string;
  creator: string;
  modifier: string;
  gmtCreate: string;
}

const SalesRecordList: React.FC = () => {
  const [tableData, setTableData] = useState<SalesRecordColumn[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [calculateLoading, setCalculateLoading] = useState<boolean>(false);
  const [clientOptions, setClientOptions] = useState([]);

  const deleteRecord = async (id: number) => {
    const resp = await deleteSalesRecord(id);
    if (resp.success) {
      message.success('删除成功');
      return Promise.resolve();
    }
    message.error('删除失败');
    return Promise.reject();
  };

  const showConfirm = (info: SalesRecordColumn) => {
    confirm({
      title: `是否删除记录 ${info.id} ?`,
      icon: <ExclamationCircleFilled/>,
      content: (
        <Descriptions
          style={{marginTop: 20}}
          title="记录信息"
          items={[
            {
              key: 'desc',
              label: '描述',
              children: info.description,
            },
            {
              key: 'amount',
              label: '价格',
              children: info.amount,
            },
            {
              key: 'gmtCreate',
              label: '创建时间',
              children: info.gmtCreate,
            },
          ]}
        />
      ),
      onOk() {
        deleteRecord(info.id);
      },
      onCancel() {
        console.log('点击了取消');
      },
    });
  };

  const columns: TableColumnsType<SalesRecordColumn> = [
    {
      title: '账目描述',
      dataIndex: 'description',
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '图片',
      dataIndex: 'imageURL',
      render: (text) => {
        return <Image width={50} src={text}/>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '更新人',
      dataIndex: 'modifier',
    },
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <>
            <Button type="link" href={`#/updateSalesRecord/${record.id}`}>
              编辑
            </Button>
            <Button type="link" onClick={() => showConfirm(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  const calculateSum = async () => {
    setCalculateLoading(true);
    if (tableData.length === 0) {
      message.error('需要先有需要计算的数据');
      setCalculateLoading(false);
      return Promise.reject();
    }
    const resp = await getTotalPrice(tableData);
    if (resp.success) {
      message.success('计算成功');
      setTotalPrice(resp.data);
    }
    setCalculateLoading(false);
  };

  const handleSearch = async (values: any) => {
    console.log(values);
    const startTimeMs = dayjs(values.startTime).valueOf();
    const endTimeMs = dayjs(values.endTime).valueOf();

    const resp = await searchSalesRecord(startTimeMs, endTimeMs, values.client);

    if (resp.data) {
      // @ts-ignore
      setTableData(resp.data);
      return true;
    }
    message.error('返回结果为空');
    return false;
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '总价格',
      children: <p>{totalPrice}</p>,
    },
  ];

  const fetchClientOptions = async () => {
    const resp = await getClientList({
      currentPage: 1,
      pageSize: 100,
    });
    if (resp.data) {
      const clientOptions = resp.data.list?.map((item) => ({
        label: item.clientName,
        value: item.clientId,
      }));
      setClientOptions(clientOptions as never[] || []);
    }
  };

  useEffect(() => {
    fetchClientOptions();
  }, []);

  return (
    <>
      <ProForm onFinish={handleSearch}>
        <ProFormDatePicker label="开始时间" name="startTime" fieldProps={{inputReadOnly: true}}/>
        <ProFormDatePicker label="结束时间" name="endTime" fieldProps={{inputReadOnly: true}}/>
        <ProFormRadio.Group
          label="客户"
          name="client"
          options={clientOptions}
        />
      </ProForm>
      <Divider style={{marginBottom: 20}}/>
      <Table dataSource={tableData} columns={columns}/>
      <Divider style={{marginBottom: 20}}/>
      <Flex>
        <Button loading={calculateLoading} onClick={calculateSum} type="primary">
          算总数
        </Button>
        <Descriptions items={items} style={{marginTop: 5, marginLeft: 10}}/>
      </Flex>
    </>
  );
};

export default SalesRecordList;
