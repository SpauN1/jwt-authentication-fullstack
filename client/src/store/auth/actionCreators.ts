import { Dispatch } from '@reduxjs/toolkit';
import { ILoginRequest } from './../../api/auth/types';

import api from '../../api';
import { history } from '../../utils/history';
import {
  loadProfileFailure,
  loadProfileStart,
  loadProfileSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logoutSuccess,
} from './authReducer';
import { store } from '..';

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

export const getAccessToken =
  () =>
  (dispatch: Dispatch<any>): string | null => {
    try {
      const accessToken = store.getState().auth.authData.accessToken;

      return accessToken;
    } catch (e) {
      console.error(e);

      return null;
    }
  };
