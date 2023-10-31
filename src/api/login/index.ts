import { request } from '@/utils/request';

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request(
    {
      url: 'auth/login',
      method: 'post',
      data,
    },
    {
      isGetDataDirectly: false,
    },
  );
}
