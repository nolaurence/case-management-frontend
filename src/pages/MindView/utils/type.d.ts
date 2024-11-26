// @ts-ignore
/* eslint-disable */

declare namespace TC {
  type NodeData = {
    isRoot?: boolean;
    data: {
      text: string;
      expand: boolean;
      uid: string;
      richText?: string;
      image?: string;
      imageTitle?: string;
      imageSize?: {
        width: number;
        height: number;
        custom?: boolean;
      };
      hyperlink?: string;
      hyperlinkTitle?: string;
      note?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      tag?: string[];
      generalization?: NodeData[];
      associativeLineTargets?: string[];
      associativeLineText?: string;
    };
    children?: NodeData[];
  };

  type ChangeDetail = {
    action: string;
    data: NodeData;
    oldData?: NodeData;
  };

  type ChangeAction = {
    action: string;
    node?: NodeData & { parentUid?: string };
    moveData?: {
      nodeUid: string;
      from: string;
      to: string;
    };
    nodeList?: (NodeData & { parentUid?: string })[];
  };

  type DiffResult = {
    addedNodes: NodeData[];
    removedNodes: NodeData[];
    unchangedNodes: NodeData[];
  };
}

