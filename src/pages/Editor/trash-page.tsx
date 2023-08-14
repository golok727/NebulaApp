import Button from '@/components/Button'
import { TbRefreshDot } from 'react-icons/tb'
import { TiDocumentDelete } from 'react-icons/ti'
import './trash-page.css'
import { MdDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { NebulaModal } from '@/features/modalSlice'
type Props = {
  trashPage: TrashPage
}

const TrashPage = ({ trashPage }: Props) => {
  const dispatch = useDispatch()
  const handleDeletePagePermanent = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'removePagePermanent',
        type: 'context/confirm',
        x: 0,
        y: 0,
        label: 'Confirm delete page',
        dangerLevel: 2,
        for: 'Delete Page',
        information:
          'You are about to delete this page and its sub pages Permanently.\nDeleted page will not be available again',
        fullScreen: true,
        props: {
          type: 'removePagePermanent',
          pageId: trashPage.__id,
        },
      })
    )
  }
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
        <Button onClick={handleDeletePagePermanent} variant="transparent">
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
