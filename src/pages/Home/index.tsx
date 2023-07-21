import './home.css'
import { Link } from 'react-router-dom'
import NebulaLogo from '../../assets/logo-nebula.svg'
import MenuButton from '../../components/Button'
import { invoke } from '@tauri-apps/api/tauri'
import { v4 as uuidv4 } from 'uuid'
import { FormEvent, useEffect, useState } from 'react'
const disabled = false

const Home = () => {
  const [noteName, setNoteName] = useState('')
  const [notebooks, setNotebooks] =
    useState<{ _id_: string; notebook_name: string }[]>()
  const handleCreateNewNotebook = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!noteName) {
      alert('Please enter a on empty Notebook name')
      return
    }
    try {
      const res = await invoke('create_notebook', {
        notebookName: noteName,
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = (await invoke('get_notebooks')) as any
        console.log(notebooks)
        setNotebooks(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <div className="app__home">
      <img src={NebulaLogo} />
      <Link to={`/editor/${uuidv4()}`}>
        <MenuButton variant="navigation">Create Note</MenuButton>
      </Link>

      <form onSubmit={handleCreateNewNotebook}>
        <input
          type="text"
          name="notebook_name"
          id="notebook_name"
          placeholder="Notebook Name"
          value={noteName}
          onChange={(ev) => setNoteName(ev.target.value)}
        />
        <input
          type="submit"
          value="Create Notebook"
          disabled={disabled || noteName.length <= 3}
        />
      </form>

      <ul>
        {notebooks &&
          notebooks.length > 0 &&
          notebooks.map((notebook) => (
            <li key={notebook._id_}>
              <Link to={`/editor/${notebook._id_}`}>
                {notebook.notebook_name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Home
