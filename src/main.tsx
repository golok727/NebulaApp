import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store'
import NebulaCoreProvider from './context/nebula'
import { CodeMirrorProvider } from './hooks/codemirror-context'
import { FileUploadProvider } from './context/file-upload-context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <NebulaCoreProvider>
        <CodeMirrorProvider>
          <FileUploadProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FileUploadProvider>
        </CodeMirrorProvider>
      </NebulaCoreProvider>
    </Provider>
  </React.StrictMode>
)
