import { MindMapContext } from '@/pages/MindView';
import ShortcutKey from '@/pages/MindView/components/Toolbar/ShortcutKey';
import XmindImport from '@/pages/MindView/components/XmindImport';
import { changeShowShortcutKeyDrawer } from '@/pages/MindView/context/actionCreator';
import { processOperation } from '@/pages/MindView/utils/processOperation';
import { nodeOperate } from '@/services/ant-design-pro/tc';
import {
  AppstoreOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileImageOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  RollbackOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import './index.less';

const ToolBar: React.FC = () => {
  const { mindMap, globalState } = useContext(MindMapContext);
  // @ts-ignore
  const dispatch = globalState?.dispatch;
  const isDark = false;

  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);
  const [activeNodes, setActiveNodes] = useState([]);
  const [isStart, setIsStart] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(true);
  const [changeDetail, setChangeDetail] = useState<string>();

  mindMap?.on('node_active', (node: any, activeNodeList: React.SetStateAction<never[]>) => {
    setActiveNodes(activeNodeList);
  });
  mindMap?.on('back_forward', (index: number, len: number) => {
    setIsStart(index <= 0);
    setIsEnd(index >= len - 1);
  });

  mindMap?.on('data_change_detail', (arr: any) => {
    setChangeDetail(JSON.stringify(arr));
  });

  useEffect(() => {
    const operate = async (changeDetail: string | undefined) => {
      const changeDetailList = JSON.parse(changeDetail || '[]');
      if (Array.isArray(changeDetailList)) {
        const operation = processOperation(changeDetailList);
        // debug code
        message.info(operation.action);
        console.log(`${operation.action} detail:`);
        console.log(operation);
        console.log('change detail:');
        console.log(changeDetailList);

        if (operation.action === 'unknown') {
          return;
        }
        const operateResponse = await nodeOperate(operation);

        if (!operateResponse || !operateResponse.success) {
          message.error(`${operation.action} 操作失败： ${JSON.stringify(operateResponse)}`);
        }
      }
    };
    operate(changeDetail);
  }, [changeDetail]);

  // 计算是否是根节点
  const hasRoot = useMemo(() => {
    // @ts-ignore
    return activeNodes.findIndex((node) => node.isRoot) !== -1;
  }, [activeNodes]);
  const disableHeaderButton: boolean = useMemo(() => {
    return activeNodes.length === 0;
  }, [activeNodes]);

  const HeaderButton: React.FC<{ icon: React.FC; text: string; disabled?: boolean }> = ({
    icon: IconComponent,
    text,
    disabled,
  }) => {
    const onButtonClick = () => {
      switch (text) {
        case '回退':
          mindMap?.execCommand('BACK');
          break;
        case '前进':
          mindMap?.execCommand('FORWARD');
          break;
        case '同级节点':
          mindMap?.execCommand('INSERT_NODE');
          break;
        case '子节点':
          mindMap?.execCommand('INSERT_CHILD_NODE');
          break;
        case '删除节点':
          mindMap?.execCommand('REMOVE_NODE');
          break;
        case '上传图片':
          setImageUploadOpen(true);
          break;
        case '导出': {
          console.log(mindMap);
          mindMap?.export('xmind', '导出用例');
          break;
        }
        // case '处理进度':
        //   dispatch?.(changeShowProcessDrawer(true));
        //   break;
        case '快捷键':
          dispatch?.(changeShowShortcutKeyDrawer(true));
          break;
        default:
          message.success('点击成功！');
          break;
      }
    };

    return (
      <div className="custom-button-container">
        <Button
          className="custom-button"
          onClick={onButtonClick}
          disabled={disabled || false}
          icon={<IconComponent />}
        />
        <span className="button-text">{text}</span>
      </div>
    );
  };

  return (
    <div className={`toolbarContainer ${isDark ? 'isDark' : ''}`}>
      <div id="toolbarRef" className="toolbar">
        <div className="toolbarBlock">
          {/* 回退， 前进， 同级节点， 子节点， 删除节点， 图片 */}
          <HeaderButton icon={RollbackOutlined} disabled={isStart} text="回退" />
          <HeaderButton icon={RedoOutlined} disabled={disableHeaderButton || isEnd} text="前进" />
          <HeaderButton
            icon={UnorderedListOutlined}
            disabled={disableHeaderButton || hasRoot}
            text="同级节点"
          />
          <HeaderButton icon={PlusCircleOutlined} disabled={disableHeaderButton} text="子节点" />
          <HeaderButton icon={DeleteOutlined} disabled={disableHeaderButton} text="删除节点" />
          <HeaderButton icon={FileImageOutlined} disabled={disableHeaderButton} text="上传图片" />
        </div>
        <div className="toolbarBlock">
          <XmindImport />
          <HeaderButton icon={ExportOutlined} text="导出" />
          <HeaderButton icon={AppstoreOutlined} text="快捷键" />
        </div>
        {/*<div className="toolbarBlock">*/}
        {/*  <div className="toolbarBtn" onClick={openDirectory}>*/}
        {/*    <span className="icon iconfont icondakai"></span>*/}
        {/*    <span className="text">打开目录</span>*/}
        {/*  </div>*/}
        {/*  <Tooltip title="创建新文件">*/}
        {/*    <div className="toolbarBtn" onClick={createNewLocalFile}>*/}
        {/*      <span className="icon iconfont iconxinjian"></span>*/}
        {/*      <span className="text">新建文件</span>*/}
        {/*    </div>*/}
        {/*  </Tooltip>*/}
        {/*  /!* 其他按钮 *!/*/}
        {/*</div>*/}

        {/*{fileTreeVisible && (*/}
        {/*  <div className={`fileTreeBox ${fileTreeExpand ? 'expand' : ''}`}>*/}
        {/*    <div className="fileTreeToolbar">*/}
        {/*      <div className="fileTreeName">{rootDirName ? `/${rootDirName}` : ''}</div>*/}
        {/*      <div className="fileTreeActionList">*/}
        {/*        <div className="btn" onClick={() => setFileTreeExpand(!fileTreeExpand)}>*/}
        {/*          {fileTreeExpand ? '▲' : '▼'}*/}
        {/*        </div>*/}
        {/*        <div className="btn" onClick={() => setFileTreeVisible(false)}>*/}
        {/*          ✖*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <div className="fileTreeWrap">*/}
        {/*      <Tree*/}
        {/*        loadData={loadFileTreeNode}*/}
        {/*        treeData={[]} // 填充树节点数据*/}
        {/*        fieldNames={{ title: 'name', key: 'id' }}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      {/*<NodeImage />*/}
      {/*<NodeHyperlink />*/}
      {/*<NodeIcon />*/}
      {/*<NodeNote />*/}
      {/*<NodeTag />*/}
      {/*<Export />*/}
      {/*<Import />*/}
      <Modal
        open={imageUploadOpen}
        title="上传图片"
        onOk={() => setImageUploadOpen(false)}
        onCancel={() => setImageUploadOpen(false)}
      >
        🚧开发中
      </Modal>
      <ShortcutKey />
    </div>
  );
};

export default ToolBar;
