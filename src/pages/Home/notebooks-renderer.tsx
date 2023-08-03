import { dateFormatter, getRandomNotebookImage } from '@/utils/helper'
import { HomeNotebook } from '@/utils/notebook'
import './notebooks-renderer.css'
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
      <div className="home__notebook">
        <img src={getRandomNotebookImage()} />
        <div>
          <span className="home__notebook__name">{notebook.name}</span>
          <span className="home__notebook__last-accessed-at">
            Created: {dateFormatter(notebook.created_at)}
          </span>
        </div>
        <Link
          className="home__notebook__open-btn"
          to={'/editor/' + notebook.__id}
        >
          Open
        </Link>
      </div>
    </li>
  )
}
