import { message } from 'antd';
import { createContext, useEffect, useReducer, useState } from 'react';
import MindMap from 'simple-mind-map';
import { useParams } from 'umi';
// @ts-ignore
import Drag from 'simple-mind-map/src/plugins/Drag.js';
// @ts-ignore
import Themes from 'simple-mind-map-plugin-themes';
// @ts-ignore
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js';
// @ts-ignore
import NavigatorToolbar from '@/pages/MindView/components/NavigatorToolbar';
// @ts-ignore
import Export from 'simple-mind-map/src/plugins/Export.js';
import Toolbar from './components/Toolbar';
// import SidebarTrigger from './components/SidebarTrigger';
import { getTestCaseTree } from '@/services/ant-design-pro/tc';
import globalReducer from './context';

type GlobalState = {
  isReadonly: boolean;
  isDark: boolean;
  activeSidebar: string;
  showShortcutKeyDrawer: boolean;
};

interface GlobalParams {
  mindMap?: MindMap;
  globalState?: {
    state: GlobalState;
    dispatch: React.Dispatch<any>;
  };
}

const MindMapContext = createContext<GlobalParams>({} as GlobalParams);

const Xmind: React.FC = () => {
  const [globalState, globalDispatch] = useReducer(globalReducer, {
    isReadonly: false,
    isDark: false,
    showShortcutKeyDrawer: false,
    activeSidebar: '',
  });
  const [mindMapGlobalStatus, setMindMapGlobalStatus] = useState<GlobalParams>({});
  const params = useParams();

  const combined = {
    mindMap: mindMapGlobalStatus.mindMap,
    globalState: {
      state: globalState,
      dispatch: globalDispatch,
    },
  };

  // 注册插件
  MindMap.usePlugin(Drag).usePlugin(Export).usePlugin(ExportXMind);

  // 注册主题
  Themes.init(MindMap);

  useEffect(() => {
    const init = async () => {
      // @ts-ignore
      const mindMap = new MindMap({
        el: document.getElementById('mindMapContainer'),
        data: {
          data: {
            text: '根节点',
          },
          children: [],
        },
      });
      setMindMapGlobalStatus({ ...mindMapGlobalStatus, mindMap });

      // 加载思维导图数据
      const rootUid = params.rootUid;
      if (rootUid) {
        const response = await getTestCaseTree(rootUid);
        if (!response || !response.success) {
          message.error('获取用例树失败');
          return;
        }
        mindMap.setData(response.data);
      }
    };
    init();
  }, []);

  return (
    <MindMapContext.Provider value={combined}>
      <Toolbar />
      <div
        id="mindMapContainer"
        className="mindMapContainer"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <NavigatorToolbar />
    </MindMapContext.Provider>
  );
};

export { MindMapContext };
export default Xmind;
