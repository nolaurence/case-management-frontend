import request from '@/services/request';
import type { TreeDataNode } from "antd";

export async function getOrganizationTree(rootId: number) {
  return request<API.Response<TreeDataNode>>(`/organization/${rootId}/tree`, {
    method: 'GET'
  });
}

export async function getProjects(payload: API.ProjectsRequest) {
  return request<API.Response<API.PagedData<API.ProjectInfo>>>('/projects/get', {
    method: 'POST',
    data: payload,
  });
}

export async function addProject(payload: API.CreateProjectRequest) {
  return request<API.Response<boolean>>('/projects/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateProject(payload: API.UpdateProjectRequest) {
  return request<API.Response<boolean>>('/projects/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTestCaseTree(rootId: string) {
  return request<API.Response<API.TcTreeNode>>(`/tc/get?rootUid=${rootId}`, {
    method: 'GET',
  });
}

export async function nodeOperate(changeAction: TC.ChangeAction) {
  return request<API.Response<boolean>>(`/tc/ops`, {
    method: 'POST',
    data: changeAction,
  });
}
