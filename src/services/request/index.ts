import { RequestOptions } from '@/services/request/type';
// import { window } from '@probe.gl/env';
import { message, notification } from 'antd'; // 假设你使用了 Ant Design
import axios from 'axios';
import { history } from 'umi';

// 与后端约定的响应数据格式
// interface ResponseStructure {
//   success: boolean;
//   data: any;
//   errorCode?: number;
//   errorMessage?: string;
//   showType?: ErrorShowType;
// }

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 创建一个映射，用来保存枚举成员名和对应的枚举值
const ErrorShowTypeMap: { [key: string]: ErrorShowType } = {
  SILENT: ErrorShowType.SILENT,
  WARN_MESSAGE: ErrorShowType.WARN_MESSAGE,
  ERROR_MESSAGE: ErrorShowType.ERROR_MESSAGE,
  NOTIFICATION: ErrorShowType.NOTIFICATION,
  REDIRECT: ErrorShowType.REDIRECT,
};

let baseURL: string;
let allowCROSCredentials = false;
if (window.location.hostname === 'localhost') {
  baseURL = 'http://localhost:7001/';
  allowCROSCredentials = true;
} else {
  baseURL = `https://${window.location.hostname}/`;
  allowCROSCredentials = false;
}

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: baseURL, // 你的 API 基础 URL
  withCredentials: allowCROSCredentials, // 是否允许跨域携带 cookie
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头或进行其他配置
    // config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
axiosInstance.interceptors.response.use((response) => {
  // 从config中获取skipErrorHandler
  const { data, config } = response;
  // @ts-ignore
  if (config.skipErrorHandler) {
    return data;
  }
  if (data.success) {
    return data;
  } else {
    // 根据data.errorShowType 判断如何处理错误
    let errorShowType = ErrorShowType.WARN_MESSAGE;
    if (data.errorShowType in ErrorShowTypeMap) {
      errorShowType = ErrorShowTypeMap[data.errorShowType];
    }
    switch (errorShowType) {
      case ErrorShowType.SILENT:
        // do nothing
        break;
      case ErrorShowType.WARN_MESSAGE:
        message.warning(`后端报错: ${data.errorMessage}`);
        break;
      case ErrorShowType.ERROR_MESSAGE:
        message.error(`后端报错: ${data.errorMessage}`);
        break;
      case ErrorShowType.NOTIFICATION:
        notification.error({
          description: `后端报错: ${data.errorMessage}`,
          message: data.errorCode,
        });
        break;
      case ErrorShowType.REDIRECT:
        history.push('/welcome');
        break;
    }
  }
});

async function request<T = any>(url: string, options: RequestOptions): Promise<T> {
  const { method, ...restOptions } = options;

  // 调用 axios 实例
  const response = await axiosInstance({
    url,
    method,
    ...restOptions,
  });
  return response as T; // 返回的响应已经处理为后端返回的 data
}

export default request;
