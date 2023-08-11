import { HomeNotebook, loadNebulaNotebooks } from '@/utils/notebook'
import { useEffect, useState } from 'react'
import './home.css'
import NotebooksRenderer from './notebooks-renderer'
import { LogoNebula } from '@/assets'

const Home = () => {
  const [notebooks, setNotebooks] = useState<HomeNotebook[]>()

  useEffect(() => {
    ;(async () => {
      try {
        const nebula_notebooks = await loadNebulaNotebooks()
        console.log(nebula_notebooks)
        setNotebooks(nebula_notebooks.notebooks)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <div className="app__home">
      <img style={{ width: '10rem' }} src={LogoNebula} />
      {notebooks && <NotebooksRenderer notebooks={notebooks} />}
    </div>
  )
}

export default Home
