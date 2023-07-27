import './app.css'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Editor from '@/pages/Editor'
import Modal from './components/Modal'
import useKeyboard from './keyboard/use-keyboard'
function App() {
  useKeyboard()
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:notebook/:pageId" element={<Editor />} />
        <Route path="/editor/:notebook/" element={<Editor />} />
      </Routes>
      <Modal />
    </div>
  )
}

export default App
