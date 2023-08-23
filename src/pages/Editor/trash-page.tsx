import Button from '@/components/Button'
import { TbRefreshDot } from 'react-icons/tb'
import { TiDocumentDelete } from 'react-icons/ti'
import './trash-page.css'
import { MdDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { ModalTypes, NebulaModal } from '@/features/modalSlice'
import { useNebulaCore } from '@/context/nebula'
import { useNavigate } from 'react-router-dom'
type Props = {
  trashPage: TrashPage
}

const TrashPage = ({ trashPage }: Props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const nebula = useNebulaCore()
  const handleDeletePagePermanent = (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => {
    ev.stopPropagation()
    dispatch(
      NebulaModal.showModal({
        id: 'removePagePermanent',
        type: ModalTypes.CONFIRMATION,
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
  const handleRecoverPage = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation()
    nebula.core.recoverPage(trashPage.__id, navigate)
  }

  return (
    <div className="sidebar__trash-page">
      <div className="sidebar__trash-page__left">
        <TiDocumentDelete className="trash-page-button-icon" />
        <span className="trash-text">{trashPage.title}</span>
      </div>
      <div className="sidebar__trash-page__right">
        <Button onClick={handleRecoverPage} variant="transparent">
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
