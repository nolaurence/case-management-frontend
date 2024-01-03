import type { TreeGraph } from '@antv/g6';
import G6 from '@antv/g6';
import { Card, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const demoData = {
  id: 'Modeling Methods',
  children: [
    {
      id: 'Classification',
      children: [
        {
          id: 'Logistic regression',
        },
        {
          id: 'Linear discriminant analysis',
        },
        {
          id: 'Rules',
        },
        {
          id: 'Decision trees',
        },
        {
          id: 'Naive Bayes',
        },
        {
          id: 'K nearest neighbor',
        },
        {
          id: 'Probabilistic neural network',
        },
        {
          id: 'Support vector machine',
        },
      ],
    },
    {
      id: 'Consensus',
      children: [
        {
          id: 'Models diversity',
          children: [
            {
              id: 'Different initializations',
            },
            {
              id: 'Different parameter choices',
            },
            {
              id: 'Different architectures',
            },
            {
              id: 'Different modeling methods',
            },
            {
              id: 'Different training sets',
            },
            {
              id: 'Different feature sets',
            },
          ],
        },
        {
          id: 'Methods',
          children: [
            {
              id: 'Classifier selection',
            },
            {
              id: 'Classifier fusion',
            },
          ],
        },
        {
          id: 'Common',
          children: [
            {
              id: 'Bagging',
            },
            {
              id: 'Boosting',
            },
            {
              id: 'AdaBoost',
            },
          ],
        },
      ],
    },
    {
      id: 'Regression',
      children: [
        {
          id: 'Multiple linear regression',
        },
        {
          id: 'Partial least squares',
        },
        {
          id: 'Multi-layer feedforward neural network',
        },
        {
          id: 'General regression neural network',
        },
        {
          id: 'Support vector regression',
        },
      ],
    },
  ],
};

const MindMapDemo: React.FC = () => {
  const [graphInstance, setGraphInstance] = useState<TreeGraph>();

  // 思维导图相关方法 ========================= START =====================================
  useEffect(() => {
    const container = document.getElementById('demoTreeGraph');
    const width = container?.scrollWidth;
    const height = container?.scrollHeight || 800;
    const graph = new G6.TreeGraph({
      container: 'demoTreeGraph',
      width,
      height,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              // @ts-ignore
              const data = item.get('model');
              data.collapsed = collapsed;
              return true;
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
        edit: ['click-select'],
      },
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-horizontal',
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getHeight: () => {
          return 16;
        },
        getWidth: () => {
          return 16;
        },
        getVGap: () => {
          return 10;
        },
        getHGap: () => {
          return 100;
        },
        getSize: () => {
          return 'right';
        },
      },
    });

    let centerX: number | undefined;
    graph.node(function (node) {
      if (node.id === 'Modeling Methods') {
        centerX = node.x;
      }

      return {
        label: node.id,
        labelCfg: {
          position:
            node.children && node.children.length > 0
              ? 'right'
              : node.x > centerX
              ? 'right'
              : 'left',
          offset: 5,
        },
      };
    });

    graph.data(demoData);
    graph.render();
    graph.fitView();

    setGraphInstance(graph);
  }, []);

  // 思维导图相关方法 ========================= END =====================================

  return (
    <>
      <div style={{ marginBottom: 5 }}>
        <p>当前状态：</p>
        <Select
          style={{ marginLeft: 4 }}
          options={[
            {
              label: 'default',
              value: 'default',
            },
            {
              label: 'edit',
              value: 'edit',
            },
          ]}
          defaultValue="default"
          onChange={(value) => {
            if (graphInstance) {
              graphInstance.setMode(value);
            } else {
              message.info('gg');
            }
          }}
        />
      </div>
      <Card>
        <div id="demoTreeGraph"></div>
      </Card>
    </>
  );
};

export default MindMapDemo;
