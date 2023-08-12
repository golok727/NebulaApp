import { HomeNotebook, loadNebulaNotebooks } from '@/utils/notebook'
import { useEffect, useState } from 'react'
import './home.css'
import NotebooksRenderer from './notebooks-renderer'
import { LogoNebula } from '@/assets'
import { useNebulaCore } from '@/context/nebula'

const Home = () => {
  const nebula = useNebulaCore()
  const [notebooks, setNotebooks] = useState<HomeNotebook[]>()

  useEffect(() => {
    ;(async () => {
      let books = await nebula.core.loadHomeNotebooks()
      setNotebooks(books)
    })()
  }, [])

  return (
    <div className="app__home">
      <div className="app__home__container">
        <img style={{ width: '10rem' }} src={LogoNebula} />
        {notebooks && <NotebooksRenderer notebooks={notebooks} />}
      </div>
    </div>
  )
}

export default Home
