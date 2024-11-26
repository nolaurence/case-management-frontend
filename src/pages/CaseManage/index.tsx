import React, { useEffect, useRef } from 'react';
import {Button, Card, Col, message, Row, Tree, Tabs} from "antd";
import type { TreeDataNode, TabsProps } from 'antd';
import { getOrganizationTree, getProjects, addProject, updateProject } from "@/services/ant-design-pro/tc";
import {PageContainer, ProColumns, ProTable, ModalForm, ActionType, ProFormText} from "@ant-design/pro-components";
import {PlusOutlined} from "@ant-design/icons";
import TagManage from "@/pages/CaseManage/tagManage";

type ProjectItem = {
  id: number;
  name: string;
  creatorName: string;
  modifyTime: Date;
  caseRootId?: number;
  caseRootUid?: string;
};

const CaseManage: React.FC = () => {

  const [ organizationTree, setOrganizationTree ] = React.useState<TreeDataNode[]>([]);
  const [ currentOrganizationId, setCurrentOrganizationId ] = React.useState<number>();
  const [ notificationCount, setNotificationCount ] = React.useState<number>(0);

  const tableActionRef = useRef<ActionType>();

  // 新建项目表单
  const NewProjectForm: React.FC = () => {
    return (
      <ModalForm
        title="新建项目"
        trigger={<Button icon={<PlusOutlined />} type="primary">新建项目</Button>}
        style={{ maxWidth: 400 }}
        onFinish={async (values) => {
          if (!currentOrganizationId) {
            message.error('请先选择组织结构');
            return false;
          }
          const response = await addProject({
            name: values.name,
            organizationId: currentOrganizationId,
          });
          if (response.success) {
            message.success('新建项目成功');
            tableActionRef.current?.reload();
            return true;
          } else {
            message.error(`新建项目失败: ${response.errorMessage}`);
            return false;
          }
        }}
      >
        <ProFormText
          name="name"
          label="需求名称"
          rules={[{ required: true }]}
          fieldProps={{
            maxLength: 50,
            placeholder: '最长50个字',
          }}
        />
      </ModalForm>
    );
  };

  // 项目列表表格列表头定义
  const columns: ProColumns<ProjectItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      search: false,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tooltip: '标题过长会自动收缩',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      copyable: true,
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button key="1" type="link" target="_blank" href={`#/mindView/${record?.caseRootUid}`} >查看Xmind用例</Button>,
        <ModalForm
          title="编辑项目"
          key="2"
          trigger={<Button type="link" >编辑</Button>}
          onFinish={async (values) => {
            const response = await updateProject({
              id: record.id,
              name: values.name,
            });
            if (response.success) {
              message.success('更新项目成功');
              tableActionRef.current?.reload();
              return true;
            } else {
              message.error(`更新项目失败: ${response.errorMessage}`);
              return false;
            }
          }}
        >
          <ProFormText
            name="name"
            label="需求名称"
            initialValue={record.name}
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              placeholder: '最长50个字',
            }}
          />
        </ModalForm>,
      ],
    },
  ];

  useEffect(() => {
    // 获取组织结构树
    const fetchData = async () => {
      const data = await getOrganizationTree(1);
      if (data && data.success) {
        setOrganizationTree([data.data]);
      } else {
        message.error('获取组织结构树失败');
      }
    };
    fetchData();
  }, []);

  // TODO: 把用例项目管理这个tab的内容抽到一个单独的文件中
  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: '用例项目管理',
      children: (
        <Row>
          <Col span={5} style={{ marginRight: 20 }}>
            <Card
              style={{
                minHeight: 600,
              }}
            >
              <Tree
                treeData={organizationTree}
                showLine
                onSelect={(selectedKeys) => {
                  setCurrentOrganizationId(Number(selectedKeys[0]));
                  if (tableActionRef.current) {
                    tableActionRef.current.reload();
                  }
                }}
              />
            </Card>
          </Col>
          <Col span={18}>
            <Card style={{ minHeight: 600 }}>
              <ProTable<ProjectItem>
                actionRef={tableActionRef}
                columns={columns}
                cardBordered
                options={false}
                request={async (params) => {
                  if (!currentOrganizationId) {
                    if (notificationCount <= 3) {
                      setNotificationCount(notificationCount + 1);
                    } else {
                      message.info('请先选择组织结构');
                      setNotificationCount(0)
                    }
                    return Promise.resolve({
                      data: [],
                      success: false,
                      total: 0,
                    });
                  }
                  const response = await getProjects({
                    ...params,
                    current: params.current || 1,
                    pageSize: params.pageSize || 20,
                    organizationId: currentOrganizationId,
                  });
                  if (response.success && (response.data.list?.length === 0 || response.data.pagination?.total === 0)) {
                    message.info('暂无数据');
                  }
                  return Promise.resolve({
                    data: response.data.list,
                    success: response.success,
                    total: response.data.pagination?.total,
                  });
                }}
                toolBarRender={() => [
                  <NewProjectForm key="1" />,
                ]}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: '标签管理',
      children: <TagManage />,
    }
  ];

  return (
    <PageContainer title="用例管理" >
      <Tabs defaultActiveKey="1" items={tabs} />
    </PageContainer>
  );
};

export default CaseManage;
