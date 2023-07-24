import './home.css'
import { Link, useNavigate } from 'react-router-dom'
import NebulaLogo from '../../assets/logo-nebula.svg'
import { invoke } from '@tauri-apps/api/tauri'
import { FormEvent, useEffect, useState } from 'react'
const disabled = false

const Home = () => {
  const [noteName, setNoteName] = useState('')
  const navigate = useNavigate()

  const [notebooks, setNotebooks] =
    useState<{ _id_: string; notebook_name: string }[]>()
  const handleCreateNewNotebook = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!noteName) {
      alert('Please enter a on empty Notebook name')
      return
    }
    try {
      const res = (await invoke('create_nebula_notebook', {
        notebookName: noteName.trim(),
      })) as any
      console.log(res)
      navigate(`/editor/${res._id_}/`)

      setNoteName('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const nebula_notebooks = (await invoke('load_nebula_notebooks')) as any
        console.log(nebula_notebooks.notebooks)
        const res = (await invoke('get_notebooks')) as any
        setNotebooks(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <div className="app__home">
      <img src={NebulaLogo} />
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
              <Link to={`/editor/${notebook._id_}/`}>
                {notebook.notebook_name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Home
