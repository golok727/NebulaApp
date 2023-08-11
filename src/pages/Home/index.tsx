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
      <img style={{ width: '10rem', margin: '.7rem 0' }} src={LogoNebula} />
      {notebooks && <NotebooksRenderer notebooks={notebooks} />}
    </div>
  )
}

export default Home
