import React, { useState, useContext } from 'react';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Tooltip, UploadProps } from 'antd';
import { message, Upload, Modal, Button, Alert } from 'antd';
// import { RcFile } from 'antd/es/upload';
import { MindMapContext } from '@/pages/MindView';
// @ts-ignore
import xmind from 'simple-mind-map/src/parse/xmind.js';

const { Dragger } = Upload;

const XmindImport: React.FC = () => {
  const { mindMap } = useContext(MindMapContext);
  const [ open, setOpen ] = useState(false);
  const [currentFileList, setCurrentFileList] = useState<File[]>([]);

  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    beforeUpload: async (file: File) => {
      if (!file) {
        message.error('请先上传文件');
        return;
      }
      setCurrentFileList([file]);
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        setCurrentFileList(info.file.originFileObj ? [info.file.originFileObj] : []);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleUploadedFile = async () => {
    if (currentFileList.length <= 0) {
      message.error('请先上传文件');
      setCurrentFileList([]);
      return;
    }

    // 解析文件
    const extension = currentFileList[0].name.split('.').pop();
    if (extension === 'xmind') {
      let data = await xmind.parseXmindFile(currentFileList[0]);
      console.log(data);
      mindMap?.setData(data);
      message.success('解析成功');
      setOpen(false);
    } else {
      message.error('暂不支持该文件类型');
    }
    setCurrentFileList([]);
  };

  return (
    <>
      <div className="custom-button-container">
        <Tooltip title={'导入的时候会覆盖当前的所有数据~'}>
          <Button
            className="custom-button"
            onClick={() => setOpen(true)}
            icon={<CloudUploadOutlined />}
          />
        </Tooltip>
        <span className="button-text">导入</span>
      </div>
      <Modal
        title="导入本地文件"
        open={open}
        onOk={handleUploadedFile}
        onCancel={() => setOpen(false)}
      >
        <Alert message="目前只实现了xmind的解析~" type="error" style={{ marginTop: 20 }} />
        <Dragger {...props} style={{ marginTop: 20 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">只支持一次上传一个文件</p>
        </Dragger>
      </Modal>
    </>
  );
};

export default XmindImport;
