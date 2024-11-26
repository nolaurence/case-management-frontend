import React, { useState, useEffect, useRef, useContext } from 'react';
import { Tooltip, Input } from 'antd';
import './Scale.less';
import { MindMapContext } from '@/pages/MindView';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  // mindMap: {
  //   view: {
  //     scale: number;
  //     narrow: () => void;
  //     enlarge: () => void;
  //     setScale: (scale: number, cx: number, cy: number) => void;
  //   };
  //   on: (event: string, listener: () => void) => void;
  //   off: (event: string, listener: () => void) => void;
  //   width: number;
  //   height: number;
  // };
  isDark: boolean;
}

const Scale: React.FC<Props> = ({ isDark }) => {

  const { mindMap } = useContext(MindMapContext);

  const [scaleNum, setScaleNum] = useState<number>(100);
  const [cacheScaleNum, setCacheScaleNum] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleScale = (scale: number) => {
    setScaleNum(scale * 100);
  };

  const handleDrawClick = () => {
    if (inputRef.current) inputRef.current.blur();
  };

  const narrow = () => {
    // @ts-ignore
    mindMap?.view.narrow();
  };

  const enlarge = () => {
    // @ts-ignore
    mindMap?.view.enlarge();
  };

  const onScaleNumInputFocus = () => {
    setCacheScaleNum(scaleNum);
  };

  useEffect(() => {
    if (mindMap && mindMap.view) {
      mindMap.on('scale', handleScale);
      mindMap.on('draw_click', handleDrawClick);

      setScaleNum(mindMap.view.scale * 100);
    }

    return () => {
      mindMap?.off('scale', handleScale);
      mindMap?.off('draw_click', handleDrawClick);
    };
  }, [mindMap]);

  const onScaleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newScaleNum = Number(value);

    if (isNaN(newScaleNum) || newScaleNum <= 0) {
      setScaleNum(cacheScaleNum);
    } else {
      const cx = mindMap?.width / 2;
      const cy = mindMap?.height / 2;
      mindMap?.view.setScale(newScaleNum / 100, cx, cy);
    }
  };

  return (
    <div className={`scaleContainer ${isDark ? 'isDark' : ''}`}>
      <Tooltip title={'Zoom Out'} placement="top">
        <MinusOutlined onClick={narrow} />
        {/*<div className="btn el-icon-minus" onClick={narrow}></div>*/}
      </Tooltip>
      <div className="scaleInfo">
        <Input
          type="text"
          maxLength={3}
          value={scaleNum}
          onChange={onScaleNumChange}
          onFocus={onScaleNumInputFocus}
          style={{ width: '50px', textAlign: 'center' }}
        />
        %
      </div>
      <Tooltip title={'Zoom In'} placement="top">
        <PlusOutlined onClick={enlarge} />
        {/*<div className="btn el-icon-plus" onClick={enlarge}></div>*/}
      </Tooltip>
    </div>
  );
};

export default Scale;
