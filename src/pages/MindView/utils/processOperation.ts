import { message } from 'antd';
// import {Simulate} from "react-dom/test-utils";

const diffNodes = (oldNodes: TC.NodeData[], newNodes: TC.NodeData[]): TC.DiffResult => {
  const oldNodeMap = new Map<string, TC.NodeData>();
  const newNodeMap = new Map<string, TC.NodeData>();

  // 将旧节点和新节点分别存入Map中，以便快速查找
  oldNodes.forEach((node) => oldNodeMap.set(node.data.uid, node));
  newNodes.forEach((node) => newNodeMap.set(node.data.uid, node));

  const addedNodes: TC.NodeData[] = [];
  const removedNodes: TC.NodeData[] = [];
  const unchangedNodes: TC.NodeData[] = [];

  // 检查新节点中哪些是新增的
  newNodes.forEach((newNode) => {
    if (!oldNodeMap.has(newNode.data.uid)) {
      addedNodes.push(newNode);
    } else {
      unchangedNodes.push(newNode);
    }
  });

  // 检查旧节点中哪些是移除的
  oldNodes.forEach((oldNode) => {
    if (!newNodeMap.has(oldNode.data.uid)) {
      removedNodes.push(oldNode);
    }
  });

  return {
    addedNodes,
    removedNodes,
    unchangedNodes,
  };
};

enum ActionPattern {
  UpdateCreate = 'update+create',
  Update = 'update',
  UpdateUpdate = 'update+update',
  UpdateUpdateUpdate = 'update+update+update',
  UpdateDelete = 'update+delete',
  // 可以根据需要继续添加新的模式
}

export function processOperation(actionList: TC.ChangeDetail[]): TC.ChangeAction {
  if (actionList.length === 0) {
    return { action: 'unknown' };
  }
  const rawAction = actionList.map((changeDetail) => changeDetail.action);

  const rawActionString = rawAction.join('+');
  switch (rawActionString) {
    case ActionPattern.UpdateCreate: {
      // 新增节点
      return {
        action: 'add',
        node: {
          ...actionList[1].data,
          parentUid: actionList[0].data.data.uid,
        },
      };
    }
    case ActionPattern.Update: {
      // 更新节点
      return {
        action: 'update',
        node: actionList[0].data,
      };
    }
    case ActionPattern.UpdateUpdate: {
      // 移动节点
      const fromParentId = actionList[1].data.data.uid;
      const toParentId = actionList[0].data.data.uid;
      const diffResult = diffNodes(
        actionList[0].oldData?.children || [],
        actionList[0].data?.children || [],
      );
      const movedNodeUid = diffResult.addedNodes[0]
        ? diffResult.addedNodes[0].data.uid
        : diffResult.removedNodes[0]?.data.uid;
      return {
        action: 'move',
        moveData: {
          from: fromParentId,
          to: toParentId,
          nodeUid: movedNodeUid,
        },
      };
    }
    case ActionPattern.UpdateUpdateUpdate: {
      // 移动节点，但移动的节点是一棵子树
      const fromParentId = actionList[2].data.data.uid;
      const toParentId = actionList[0].data.data.uid;
      const diffResult = diffNodes(
        actionList[0].oldData?.children || [],
        actionList[0].data?.children || [],
      );
      const movedNodeUid = diffResult.addedNodes[0]
        ? diffResult.addedNodes[0].data.uid
        : diffResult.removedNodes[0]?.data.uid;
      return {
        action: 'move',
        moveData: {
          from: fromParentId,
          to: toParentId,
          nodeUid: movedNodeUid,
        },
      };
    }
    case ActionPattern.UpdateDelete: {
      // 删除节点
      return {
        action: 'delete',
        node: actionList[1].data,
      };
    }
    default:
      // message.error(`未知的操作：${rawActionString}`);
      // return {
      //   action: 'unknown',
      // };
      break;
  }
  // 单create，为创建同级节点操作，下一步单update需要将子节点过滤处理看看是否有变动，好更新创建的节点的parentId
  // update + delete + delete + ... 剪切和删除子树操作
  if (rawActionString.startsWith('update+delete')) {
    // 剪切子树操作
    const deleteActionList = actionList.filter((action) => action.action === 'delete');
    return {
      action: 'batchDelete',
      nodeList: deleteActionList.map((changeDetail) => changeDetail.data),
    };
  }

  // update + create + create + ... 粘贴和创建子树操作
  if (rawActionString.startsWith('update+create')) {

    // 构建新增节点的Map
    const addActionList = actionList.filter((action) => action.action === 'create');
    const addNodeMap = new Map<string, (TC.NodeData & { parentUid?: string })>();
    addActionList.forEach((action) => {
      addNodeMap.set(action.data.data.uid, action.data);
    });

    const addUidList = addNodeMap.keys().toArray();

    actionList.forEach((action) => {
      const childrenUidList = action.data.children?.map((child) => child.data.uid) || [];
      const commonUid = childrenUidList.filter(uid => addUidList.includes(uid));
      commonUid.forEach(uid => {
        addNodeMap.set(uid, {
          ...addNodeMap.get(uid)!,
          parentUid: action.data.data.uid,
        });
      })
    });

    return {
      action: 'batchAdd',
      nodeList: addNodeMap.values().toArray(),
    };
  }

  // 最后的兜底情况
  message.error(`未知的操作：${rawActionString}`);
  return {
    action: 'unknown',
  };
}
