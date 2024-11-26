import {addSalesRecord, getClientList, uploadImage} from '@/services/ant-design-pro/api';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import {ImageUploader, Selector} from 'antd-mobile';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import React, {useEffect, useState} from 'react';

const AddSalesRecord: React.FC = () => {
  // let baseURL: string;
  // if (window.location.hostname === 'localhost') {
  //   baseURL = 'http://localhost:7001/';
  // } else {
  //   baseURL = `https://${window.location.hostname}/`;
  // }

  const [amountValue, setAmountValue] = useState<number>();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [form] = ProForm.useForm();

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 使用正则表达式来限制输入为最多两位小数
    const inputValue = event.target.value
      .replace(/[^\d\.]/g, '')
      .replace(/(^\.|\.{2,})$/g, '')
      .replace(/\.(\d{2})./g, '.$1');
    setAmountValue(Number(inputValue));
  };

  const mobileUpload = async (image: File): Promise<ImageUploadItem> => {
    if (fileList.length >= 1) {
      message.error('不允许上传多张图片');
      return Promise.reject();
    }
    const url = await uploadImage(image);
    if (!url || '' === url) {
      return Promise.reject();
    }
    return Promise.resolve({
      key: url,
      thumbnailUrl: url,
      url: url,
    });
  };

  const handleSubmit = async (values: any) => {
    console.log(values);
    // 获取图片url
    let imageURL;
    const imageObjList: ImageUploadItem[] = values?.image;
    if (imageObjList && imageObjList.length >= 1) {
      imageURL = imageObjList[0].url;
    }
    const submitReq: API.SubmitRequest = {
      description: values.recordDescription,
      amount: Number(values.amount),
      imageURL: imageURL,
      clientId: values.client,
    };
    const resp = await addSalesRecord(submitReq);
    if (resp.data) {
      message.success('添加成功');
      form.resetFields();
      form.setFieldsValue({ amount: 0 });
      return true;
    }
    message.error('添加失败');
    return false;
  };

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
    <Card title="增加销售记录">
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormText
          name="recordDescription"
          label="账目描述"
          tooltip="最长50个字"
          rules={[{ required: true }]}
          fieldProps={{
            count: {
              show: true,
              max: 50,
            },
          }}
        />
        <ProFormText
          name="amount"
          label="金额"
          tooltip="最多支持两位小数"
          rules={[{ required: true }]}
          fieldProps={{
            prefix: '￥',
            type: 'number',
            value: amountValue,
            onChange: (event) => handleAmountChange(event),
          }}
        />
        <ProFormRadio.Group
          name="client"
          label="客户"
          options={clientOptions}
        />
        <ProForm.Item name="image" label="上传图片" tooltip="最多一张图片">
          <ImageUploader upload={mobileUpload} onChange={setFileList} value={fileList} />
        </ProForm.Item>
      </ProForm>
    </Card>
  );
};

export default AddSalesRecord;
