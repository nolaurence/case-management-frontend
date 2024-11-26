import React, {useEffect, useState} from 'react';
import {useParams} from 'umi';
import {Card, message} from 'antd';
import {ImageUploader} from 'antd-mobile';
import {updateSalesRecord, getSalesRecordById, getClientList, uploadImage} from '@/services/ant-design-pro/api';
import {ProForm, ProFormText, ProFormRadio} from '@ant-design/pro-components';
import {ImageUploadItem} from 'antd-mobile/es/components/image-uploader';


const EditSalesRecord: React.FC = () => {
  const params = useParams();

  const [amountValue, setAmountValue] = useState<number>();
  const [clientOptions, setClientOptions] = useState([]);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [form] = ProForm.useForm();

  // 参数回显
  const fetchData = async () => {
    const id = Number(params.recordId);
    if (id) {
      const formResp = await getSalesRecordById(id);
      if (formResp.success) {
        form.setFieldsValue({
          recordDescription: formResp.data.description,
          amount: formResp.data.amount,
        });

        // 回显上传的图片
        setFileList([{
          key: 0,
          url: formResp.data.imageURL || '',
        }])
      }

      // 拿客户列表
      const clientResp = await getClientList({
        currentPage: 1,
        pageSize: 100,
      });
      if (clientResp.data) {
        const clientOptions = clientResp.data.list?.map((item) => ({
          label: item.clientName,
          value: item.clientId,
        }));
        setClientOptions(clientOptions as never[] || []);
      }
      // 回显选择的客户
      form.setFieldsValue({
        client: formResp.data.clientId,
      });
    }
  };

  // 参数回显
  useEffect(() => {
    fetchData();
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 使用正则表达式来限制输入为最多两位小数
    const inputValue = event.target.value.replace(/[^\d\.]/g, '').replace(/(^\.|\.{2,})$/g, '').replace(/\.(\d{2})./g, '.$1');
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
    const submitReq: API.SalesRecord = {
      id: Number(params.recordId),
      description: values.recordDescription,
      amount: Number(values.amount),
      imageURL: imageURL,
      clientId: values.client,
    };
    if (params.recordId === undefined) {
      message.error('id未获取到');
      return Promise.reject();
    }
    const resp = await updateSalesRecord(submitReq);
    if (resp.data) {
      message.success('修改成功');
      form.resetFields();
      return true;
    }
    message.error('修改失败');
    return false;
  };

  return (
    <Card
      title="编辑销售记录"
    >
      <ProForm
        form={form}
        onFinish={handleSubmit}
      >
        <ProFormText
          name="recordDescription"
          label="账目描述"
          tooltip="最长50个字"
          rules={[{required: true}]}
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
          rules={[{required: true}]}
          fieldProps={{
            prefix: '￥',
            type: 'number',
            value: amountValue,
            onChange: (event) => handleAmountChange(event),
          }}
        />
        <ProFormRadio.Group
          label="客户"
          name="client"
          options={clientOptions}
        />
        <ProForm.Item name="image" label="上传图片" tooltip="最多一张图片">
          <ImageUploader upload={mobileUpload} onChange={setFileList} value={fileList}/>
        </ProForm.Item>
      </ProForm>
    </Card>
  );
};

export default EditSalesRecord;
