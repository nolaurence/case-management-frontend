import type {TreeGraph} from '@antv/g6';
import G6 from '@antv/g6';
import {Card, message, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {mockData} from './mockData';

const MindMapDemo: React.FC = () => {
  const [graphInstance, setGraphInstance] = useState<TreeGraph>();

  // 思维导图相关方法 ========================= START =====================================

  // 注册一个节点style
  G6.registerNode(
    'treeNode',
    {
      jsx: (cfg) => {
        const width = G6.Util.getTextSize(cfg.label, 14)[0] + 24;
        const color = cfg.color || cfg.style?.stroke;

        return `
          <group>
            <rect draggable="true" style={{
              width: ${width + 24},
              height: 22,
              backgroundColor: '#ffffff',
              borderRadius: 5,
              justifyContent: 'center',
            }}>
              <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>
                ${cfg.label}
              </text>
            </rect>
          </group>
          // <foreignObject width="100" height="100">
          //   <div
          //     style={{
          //       width: 100,
          //       height: 100,
          //       background: '#fff',
          //       border: '1px solid #72CC4A',
          //       borderRadius: '50%',
          //       display: 'flex',
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //     }}
          //   >
          //     {cfg.id}
          //   </div>
          // </foreignObject>
        `;
      },
      getAnchorPoints: () => {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
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
        // labelCfg: {
        //   style: {
        //     fill: '#000000A6',
        //     fontSize: 14,
        //   },
        // },
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

    graph.data(mockData);
    graph.render();
    graph.fitView();

    setGraphInstance(graph);
  }, []);

  // 思维导图相关方法 ========================= END =====================================

  return (
    <>
      <div style={{marginBottom: 5}}>
        <p>当前状态：</p>
        <Select
          style={{marginLeft: 4}}
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
