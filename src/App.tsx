import './app.css'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Editor from '@/pages/Editor'
import Modal from './components/Modal'
import useKeyboard from './keyboard/use-keyboard'
import TopBar from './components/topbar'
function App() {
  useKeyboard()
  return (
    <div className="app-container">
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:notebook/:pageId" element={<Editor />} />
        <Route path="/editor/:notebook/" element={<Editor />} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
      <Modal />
    </div>
  )
}

export default App
