import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store'
import NebulaCoreProvider from './context/nebula'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <NebulaCoreProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NebulaCoreProvider>
    </Provider>
  </React.StrictMode>
)
