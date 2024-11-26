// @ts-ignore
/* eslint-disable */
import request from '@/services/request';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.UserInfo;
  }>('/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.RegisterResult>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function searchUser(body: API.SearchUserParams) {
  return request<API.Response<API.PagedData<API.UserInfo>>>('/user/search/paged', {
    method: 'POST',
    data: body,
  });
}

export async function uploadImage(image: File) {
  let formData: FormData = new FormData();

  formData.append('file', image);

  return request<string>('/image/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 添加销售记录 POST **/
export async function addSalesRecord(body: API.SubmitRequest) {
  return request<API.Response<boolean>>('/salesRecord/add', {
    method: 'POST',
    data: body,
  });
}

/** 搜索销售记录 GET **/
export async function searchSalesRecord(startTimeMs: number, endTimeMs: number, clientId: number) {
  let reqURL = `/salesRecord/list?startTimeMs=${startTimeMs}&endTimeMs=${endTimeMs}`;
  if (clientId) {
    reqURL += `&clientId=${clientId}`;
  }
  return request<API.Response<API.SalesRecord[]>>(reqURL, {
    method: 'GET',
  });
}

/** 通过id获取销售记录 GET **/
export async function getSalesRecordById(recordId: number) {
  return request<API.Response<API.SalesRecord>>(`/salesRecord/id/${recordId}`, {
    method: 'GET',
  });
}

/** 修改销售记录 POST **/
export async function updateSalesRecord(record: API.SalesRecord) {
  return request<API.Response<boolean>>('/salesRecord/update', {
    method: 'POST',
    data: record,
  });
}

/** 删除销售记录 GET **/
export async function deleteSalesRecord(id: number) {
  return request<API.Response<boolean>>(`/salesRecord/delete?id=${id}`, {
    method: 'GET',
  });
}

/** 计算总价 POST **/
export async function getTotalPrice(salesRecordList: API.SalesRecord[]) {
  return request<API.Response<number>>('/salesRecord/sum', {
    method: 'POST',
    data: salesRecordList,
  });
}

/** 获取客户列表 POST **/
export async function getClientList(clientQuery: API.ClientQuery) {
  return request<API.Response<API.PagedData<API.ClientInfo>>>('/clients/page', {
    method: 'POST',
    data: clientQuery,
  });
}

/** 根据id获取客户信息 GET **/
export async function getClientById(clientId: number) {
  return request<API.Response<API.ClientInfo>>(`/clients/id?clientId=${clientId}`, {
    method: 'GET',
  });
}

/** 添加客户 POST **/
export async function addClient(body: API.AddClientRequest) {
  return request<API.Response<boolean>>('/clients/add', {
    method: 'POST',
    data: body,
  });
}

/** 修改客户 POST **/
export async function updateClient(body: API.UpdateClientRequest) {
  1;
  return request<API.Response<boolean>>('/clients/update', {
    method: 'POST',
    data: body,
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function getEnv(options?: { [key: string]: any }) {
  return request<API.Response<string>>('/maintenance/environment', {
    method: 'GET',
    ...(options || {}),
  });
}
