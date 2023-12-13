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
    role?: number;
  };

  type Pagination = {
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
    username?: string;
    password?: string;
    checkPassword?: string;
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
}
