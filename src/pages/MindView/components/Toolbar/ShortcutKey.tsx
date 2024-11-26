import { MindMapContext } from '@/pages/MindView';
import { changeShowShortcutKeyDrawer } from '@/pages/MindView/context/actionCreator';
import { Drawer } from 'antd';
import React, { useContext } from 'react';
import './shortcut.less';

const ShortcutKey: React.FC = () => {
  const { globalState } = useContext(MindMapContext);
  // @ts-ignore
  const { showShortcutKeyDrawer } = globalState.state;
  const dispatch = globalState?.dispatch;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrl = isMac ? '⌘' : 'Ctrl';
  const enter = isMac ? 'Return' : 'Enter';
  const macFn = isMac ? 'fn + ' : '';

  const shortcutKeyList = [
    {
      type: '节点操作',
      list: [
        { icon: 'icontianjiazijiedian', name: '插入下级节点', value: 'Tab | Insert' },
        { icon: 'iconjiedian', name: '插入同级节点', value: enter },
        { icon: 'icondodeparent', name: '插入父节点', value: 'Shift + Tab' },
        { icon: 'iconshangyi', name: '上移节点', value: `${ctrl} + ↑` },
        { icon: 'iconxiayi', name: '下移节点', value: `${ctrl} + ↓` },
        { icon: 'icongaikuozonglan', name: '插入概要', value: `${ctrl} + G` },
        { icon: 'iconzhankai', name: '展开/收起节点', value: '/' },
        { icon: 'iconshanchu', name: '删除节点', value: 'Delete | Backspace' },
        { icon: 'iconshanchu', name: '仅删除当前节点', value: 'Shift + Backspace' },
        { icon: 'iconfuzhi', name: '复制节点', value: `${ctrl} + C` },
        { icon: 'iconjianqie', name: '剪切节点', value: `${ctrl} + X` },
        { icon: 'iconniantie', name: '粘贴节点', value: `${ctrl} + V` },
        { icon: 'iconbianji', name: '编辑节点', value: macFn + 'F2' },
        { icon: 'iconhuanhang', name: '文本换行', value: 'Shift + Enter' },
        { icon: 'iconhoutui-shi', name: '回退', value: `${ctrl} + Z` },
        { icon: 'iconqianjin1', name: '前进', value: `${ctrl} + Y` },
        { icon: 'iconquanxuan', name: '全选', value: `${ctrl} + A` },
        { icon: 'iconquanxuan', name: '多选', value: `右键 / ${ctrl} + 左键` },
        { icon: 'iconzhengli', name: '一键整理布局', value: `${ctrl} + L` },
        { icon: 'iconsousuo', name: '搜索和替换', value: `${ctrl} + F` },
      ],
    },
    {
      type: '画布操作',
      list: [
        { icon: 'iconfangda', name: '放大', value: `${ctrl} + +` },
        { icon: 'iconsuoxiao', name: '缩小', value: `${ctrl} + -` },
        { icon: 'iconfangda', name: '放大/缩小', value: `${ctrl} + 鼠标滚动` },
        { icon: 'icondingwei', name: '回到根节点', value: `${ctrl} + Enter` },
        { icon: 'iconquanping1', name: '适应画布', value: `${ctrl} + i` },
      ],
    },
    {
      type: '大纲操作',
      list: [
        { icon: 'iconhuanhang', name: '文本换行', value: 'Shift + Enter' },
        { icon: 'iconshanchu', name: '删除节点', value: 'Delete' },
        { icon: 'icontianjiazijiedian', name: '插入下级节点', value: 'Tab' },
        { icon: 'iconjiedian', name: '插入同级节点', value: enter },
        { icon: 'icondodeparent', name: '上移一个层级', value: 'Shift + Tab' },
      ],
    },
  ];

  return (
    <Drawer
      title="快捷键"
      placement="right"
      open={showShortcutKeyDrawer}
      onClose={() => {
        // @ts-ignore
        dispatch?.(changeShowShortcutKeyDrawer(false));
      }}
      mask={false}
    >
      <div className="box">
        {shortcutKeyList.map((item) => (
          <div key={item.type}>
            <div className="title">{item.type}</div>
            <div className="list">
              {item.list.map((item2) => (
                <div className="item" key={item2.value}>
                  {item2.icon && <span className={`icon iconfont ${item2.icon}`}></span>}
                  <span className="name" title={item2.name}>
                    {item2.name}
                  </span>
                  <div className="value" title={item2.value}>
                    {item2.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default ShortcutKey;
