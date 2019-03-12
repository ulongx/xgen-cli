import { request } from '../utils'

export async function login (params) {
  return request('/api/login', {
    method: 'post',
    data: params
  })
}

export async function logout (params) {
  return request('/api/logout', {
    method: 'post',
    data: params
  })
}

export async function userInfo (params) {
  return request('/api/userInfo', {
    method: 'get',
    data: params
  })
}

export async function changepw(params) {
  console.log(JSON.stringify(params));
  return request('/pc/changePw', {
    method: 'post',
    body: JSON.stringify(params),
  });
}