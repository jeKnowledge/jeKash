import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {AuthContextProvider} from './components/GlobalComponent';
//component global aqui
ReactDOM.render(
    <AuthContextProvider>
      <App/>
    </AuthContextProvider>,
  document.getElementById('root')
);