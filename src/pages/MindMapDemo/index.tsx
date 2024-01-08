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

  // 注册一个节点style
  G6.registerNode(
    'treeNode',
    {
      drawShape: (cfg, group) => {
        const width = cfg?.style?.width;
        const stroke = cfg?.style?.stroke;
        const rect = group?.addShape('rect', {
          attrs: {
            x: -(width || 0) / 2,
            y: -15,
            width,
            height: 30,
            radius: 15,
            stroke,
            lineWidth: 1.2,
            fillOpacity: 1,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'rect-shape',
        });
        group?.addShape('circle', {
          attrs: {
            x: -(width || 0) / 2,
            y: 0,
            r: 3,
            fill: stroke,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'circle-shape',
        });
        group?.addShape('circle', {
          attrs: {
            x: (width || 0) / 2,
            y: 0,
            r: 3,
            fill: stroke,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'circle-shape2',
        });
        return rect;
      },
      getAnchorPoints: () => {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
      update: function update(cfg, item) {
        const group = item.getContainer();
        const children = group.get('children');
        const node = children[0];
        const circleLeft = children[1];
        const circleRight = children[2];

        const stroke = cfg?.style?.stroke;

        if (stroke) {
          node.attr('stroke', stroke);
          circleLeft.attr('fill', stroke);
          circleRight.attr('fill', stroke);
        }
      },
    },
    'single-node',
  );

  useEffect(() => {
    const container = document.getElementById('demoTreeGraph');
    const width = container?.scrollWidth;
    const height = container?.scrollHeight || 800;
    const graph = new G6.TreeGraph({
      container: 'treeContainer',
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
        type: 'treeNode',
        labelCfg: {
          style: {
            fill: '#000000A6',
            fontSize: 10,
          },
        },
        style: {
          stroke: '#72CC4A',
          width: 150,
        },
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

    graph.node((node) => {
      return {
        label: node.id,
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
        <div id="treeContainer"></div>
      </Card>
    </>
  );
};

export default MindMapDemo;
