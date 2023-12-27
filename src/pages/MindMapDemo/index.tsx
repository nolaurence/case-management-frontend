import { ExpandAltOutlined, MinusCircleOutlined } from '@ant-design/icons';
import G6, { Graph } from '@antv/g6';
import React, { useEffect } from 'react';

import { Card } from 'antd';

const data = {
  id: 'root',
  children: [
    {
      id: 'subTree1',
      children: [],
    },
    {
      id: 'subTree2',
      children: [],
    },
  ],
};

const MindMapDemo: React.FC = () => {
  const ref = React.useRef(null);
  let graph: Graph | null = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.TreeGraph({
        container: 'mountNode',
        width: 800,
        height: 600,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange(item, collapsed) {
                // @ts-ignore
                const icon = item.get('group').findByClassName('collapse-icon');
                if (collapsed) {
                  icon.attr('symbol', <ExpandAltOutlined />);
                } else {
                  icon.attr('symbol', <MinusCircleOutlined />);
                }
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        layout: {
          type: 'dendrogram',
          direction: 'LR', // H / V / LR / RL / TB / BT
          nodeSep: 50,
          rankSep: 100,
          radial: true,
        },
      });
    }
    graph.data(data);
    graph.render();
  }, []);

  return (
    <Card>
      <div ref={ref}></div>
    </Card>
  );
};

export default MindMapDemo;
