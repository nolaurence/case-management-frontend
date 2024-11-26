import React, { useContext } from 'react';
import { Tooltip, message } from 'antd';
import { AimOutlined, EditOutlined, EyeOutlined, MoonOutlined, SearchOutlined } from '@ant-design/icons';
// import { useDispatch, useSelector } from 'react-redux';

// import { langList } from '@/config';
// import i18n from '@/i18n';
import Scale from './Scale';
import { MindMapContext } from '@/pages/MindView';
import { changeEditMode, changeDarkMode } from '@/pages/MindView/context/actionCreator';
import "./index.less";

// const { Option } = Select;

const NavigatorToolbar: React.FC = () => {
  const { mindMap, globalState } = useContext(MindMapContext);
  // @ts-ignore
  const { isReadonly, isDark } = globalState?.state;
  const dispatch = globalState?.dispatch;
  // const [lang, setLang] = useState<string>(i18n.locale);
  // const [openMiniMap, setOpenMiniMap] = useState(false);
  // const [version, setVersion] = useState(pkg.version);
  // const dispatch = useDispatch();
  // const isReadonly = useSelector((state: RootState) => state.isReadonly);
  // const isDark = useSelector((state: RootState) => state.localConfig.isDark);

  // useEffect(() => {
  //   setLang(i18n.locale);
  // }, [i18n.locale]);

  const readonlyChange = () => {
    if (dispatch) {
      dispatch(changeEditMode(!isReadonly));
    }
    mindMap?.setMode(isReadonly ? 'edit' : 'readonly');
  };

  // const toggleMiniMap = () => {
  //   setOpenMiniMap(!openMiniMap);
  //   // Emit event to bus or context
  // };

  const showSearch = () => {
    message.info('🚧开发中');
  };

  const toggleDark = () => {
    if (dispatch) {
      dispatch(changeDarkMode(!isDark));
    }
  };

  const backToRoot = () => {
    mindMap?.renderer.setRootNodeCenter();
  };

  return (
    <div className="navigatorContainer" style={{ backgroundColor: isDark ? '#262a2e' : 'hsla(0, 0%, 100%, 0.8)', opacity: 0.8 }}>
      <div className="item">
        <Tooltip title="回到根节点" placement="top">
          <AimOutlined onClick={backToRoot} />
        </Tooltip>
      </div>
      <div className="item">
        <SearchOutlined onClick={showSearch} />
      </div>
      <div className="item">
        <Tooltip title={isReadonly ? "切换为编辑模式" : '切换为只读模式'} placement="top">
          { isReadonly ? <EditOutlined onClick={readonlyChange} /> : <EyeOutlined onClick={readonlyChange} />}
        </Tooltip>
      </div>
      {/*<div className="item">*/}
      {/*  <Fullscreen isDark={isDark} mindMap={mindMap} />*/}
      {/*</div>*/}
      <div className="item">
        <Scale isDark={isDark} />
      </div>
      <div className="item">
        <MoonOutlined onClick={toggleDark} />
      </div>
      {/*<div className="item">*/}
      {/*  <Demonstrate isDark={isDark} mindMap={mindMap} />*/}
      {/*</div>*/}
    </div>
  );
};

export default NavigatorToolbar;
