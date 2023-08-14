import Button from '@/components/Button'
import { TbRefreshDot } from 'react-icons/tb'
import { TiDocumentDelete } from 'react-icons/ti'
import './trash-page.css'
import { MdDelete } from 'react-icons/md'
type Props = {
  trashPage: TrashPage
}

const TrashPage = ({ trashPage }: Props) => {
  return (
    <div className="sidebar__trash-page">
      <div className="sidebar__trash-page__left">
        <TiDocumentDelete className="trash-page-button-icon" />
        <span className="trash-text">{trashPage.title}</span>
      </div>
      <div className="sidebar__trash-page__right">
        <Button variant="transparent">
          <TbRefreshDot />
        </Button>
        <Button variant="transparent">
          <MdDelete />
        </Button>

        <span className="trash-text-days-remaining">
          {trashPage.days_remaining} days left
        </span>
      </div>
    </div>
  )
}

export default TrashPage
