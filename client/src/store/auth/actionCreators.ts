import { Dispatch } from '@reduxjs/toolkit';
import { ILoginRequest } from './../../api/auth/types';

import api from '../../api';
import { loginStart, loginSuccess, loginFailure } from './authReducer';

export const loginUser =
  (data: ILoginRequest) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(loginStart());

      const res = await api.auth.login(data);

      dispatch(loginSuccess(res.data.accessToken));
      // dispatch(getProfile())
    } catch (e: any) {
      console.error(e);

      dispatch(loginFailure(e.message));
    }
  };
