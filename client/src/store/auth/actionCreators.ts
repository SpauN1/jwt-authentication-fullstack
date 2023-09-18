import { Dispatch } from '@reduxjs/toolkit';
import { AxiosPromise } from 'axios';

import { store } from '..';
import api from '../../api';
import { history } from '../../utils/history';
import { isTokenExpired } from '../../utils/jwt';
import { ILoginRequest, ILoginResponse } from './../../api/auth/types';
import {
  loadProfileFailure,
  loadProfileStart,
  loadProfileSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logoutSuccess,
} from './authReducer';

export const loginUser =
  (data: ILoginRequest) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch(loginStart());

      const res = await api.auth.login(data);

      dispatch(loginSuccess(res.data.accessToken));
      dispatch(getProfile());
    } catch (e: any) {
      console.error(e);

      dispatch(loginFailure(e.message));
    }
  };

export const logoutUser =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.auth.logout();

      dispatch(logoutSuccess());

      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

export const getProfile =
  () =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch(loadProfileStart());

      const res = await api.auth.getProfile();

      dispatch(loadProfileSuccess(res.data));
    } catch (e: any) {
      console.error(e);

      dispatch(loadProfileFailure(e.message));
    }
  };

// переменная для хранения запроса токена (для избежания race condition)
let refreshTokenRequest: AxiosPromise<ILoginResponse> | null = null;

export const getAccessToken =
  () =>
  async (dispatch: Dispatch<any>): Promise<string | null> => {
    try {
      const accessToken = store.getState().auth.authData.accessToken;

      if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshTokenRequest === null) {
          refreshTokenRequest = api.auth.refreshToken();
        }

        const res = await refreshTokenRequest;
        refreshTokenRequest = null;

        dispatch(loginSuccess(res.data.accessToken));

        return res.data.accessToken;
      }

      return accessToken;
    } catch (e) {
      console.error(e);

      return null;
    }
  };
