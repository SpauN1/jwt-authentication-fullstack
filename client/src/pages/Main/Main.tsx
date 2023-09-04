import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '../../store';
import Login from '../../components/Login/Login';

const Main: FC = () => {
  const isLoggedIn = useSelector(
    (state: IRootState) => !!state.auth.authData.accessToken
  );
  return (
    <div>
      <h1>Main</h1>
      {isLoggedIn ? <div>Вы успешно авторизировались </div> : <Login />}
    </div>
  );
};

export default Main;
