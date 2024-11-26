// @ts-ignore
/* eslint-disable */

declare namespace API {

  type UserInfo = {
    account?: string;
    name?: string;
    avatar?: string;
    userid?: number;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    address?: string;
    phone?: string;
    status?: number;
    role: number;
  };

  type SubmitRequest = {
    description: string;
    amount: number;
    imageURL?: string;
    clientId?: number;
  };

  type Response<T> = {
    success: boolean;
    data: T;
    errorCode?: number;
    errorMessage?: string;
  };

  type Pagination = {
    position?: 'top' | 'bottom' | 'both';
    align?: 'start' | 'center' | 'end';
    current?: number;
    pageSize?: number;
    total?: number;
  }

  type PagedData<T> = {
    list?: T[];
    pagination?: Pagination;
  }

  type LoginResult = {
    success?: boolean;
    data?: UserInfo;
    code?: string;
    message?: string;
  };

  type RegisterResult = {
    success?: boolean;
    data?: number;
    code?: string;
    message?: string;
  };

  type SearchUserParams = {
    account?: string;
    name?: string;
    userid?: number;
    pageSize?: number;
    current?: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type RegisterParams = {
    account: string;
    name: string;
    password: string;
    checkPassword: string;
    gender: number;
    email?: string;
    phone?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type SalesRecord = {
    id: number;
    description: string;
    amount: number;
    imageURL?: string;
    clientId?: number;
    clientName?: string;
    creator?: string;
    modifier?: string;
    gmtCreate?: string;
  };

  type ClientQuery = {
    name?: string;
    creator?: string;
    currentPage?: number;
    pageSize?: number;
  }

  type ClientInfo = {
    clientId?: number;
    clientName?: string;
  }

  type AddClientRequest = {
    clientName: string;
    creatorAccount?: string;
  }

  type UpdateClientRequest = {
    clientId: number;
    clientName: string;
    modifierAccount?: string;
  }

  type ProjectsRequest = {
    organizationId: number;
    name?: string;
    creatorName?: string;
    onlyMe?: boolean;
    current: number;
    pageSize: number;
  }

  type ProjectInfo = {
    id: number;
    name: string;
    creatorName: string;
    modifyTime: Date;
  }

  type CreateProjectRequest = {
    name: string;
    organizationId: number;
  }

  type UpdateProjectRequest = {
    id: number;
    name: string;
  }

  type TcTreeNode = {
    id: number;
    parentId: number;
    data: TreeNodeData;
    children: TcTreeNode[];
  }

  type TreeNodeData = {
    text: string;
    generalization: string[];
    tag: string[];
    expand: boolean;
    isActive: boolean;
    uid: string;
  }
}
