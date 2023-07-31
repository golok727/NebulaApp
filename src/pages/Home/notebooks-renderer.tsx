import { getRandomNotebookImage } from '@/utils/helper'
import { HomeNotebook } from '@/utils/notebook'
import './notebooks-renderer.css'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  notebooks: HomeNotebook[]
}

const NotebooksRenderer = (props: Props) => {
  const { notebooks } = props

  return (
    <ul className="home__notebooks">
      {notebooks.map((notebook) => (
        <EachNotebook key={notebook.__id} notebook={notebook} />
      ))}
    </ul>
  )
}

export default NotebooksRenderer

const EachNotebook = (props: { notebook: HomeNotebook }) => {
  const { notebook } = props
  return (
    <li>
      <Link to={'/editor/' + notebook.__id}>
        <div className="home__notebook">
          <img src={getRandomNotebookImage()} />
          <div>
            <span>{notebook.name}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}
