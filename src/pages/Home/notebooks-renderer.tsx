import { dateFormatter, getRandomNotebookImage } from '@/utils/helper'
import { HomeNotebook } from '@/utils/notebook'
import { IoIosCreate } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ModalTypes, NebulaModal } from '@/features/modalSlice'
import Button from '@/components/Button'
import { SlOptions } from 'react-icons/sl'

import './notebooks-renderer.css'
type Props = {
  notebooks: HomeNotebook[]
}

const NotebooksRenderer = (props: Props) => {
  const { notebooks } = props
  const dispatch = useDispatch()
  const handleAddNotebook = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'createNotebook',
        type: ModalTypes.CREATE_NOTEBOOK,
        label: 'Create Notebook',
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
        subtractHalfWidth: true,
      })
    )
  }
  return (
    <ul className="home__notebooks">
      <div
        onClick={handleAddNotebook}
        tabIndex={0}
        className="home__notebook create"
      >
        <IoIosCreate />
      </div>
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

        <Button variant="transparent">
          <SlOptions />
        </Button>
      </div>
    </li>
  )
}
