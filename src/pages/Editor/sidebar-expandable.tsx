import { MouseEventHandler, ReactNode } from 'react'
import { SlOptions } from 'react-icons/sl'
import { IoMdAdd } from 'react-icons/io'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'
import { useParams } from 'react-router-dom'
import { BsFiletypeMd } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { isExpanded } from '@/features/selectors'
import { toggleExpanded } from '@/features/editorSlice'
import { useNavigate } from 'react-router-dom'
import './sidebar-expandable.css'
import { NebulaModal } from '@/features/modalSlice'
import { RootState } from '@/app/store'
interface Props {
  page: PageSimple
}
const SidebarExpandable = (props: Props) => {
  const { page } = props
  const isPageExpanded = useSelector(isExpanded(page.__id))
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )
  const { pageId, notebook: notebookId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleExpand = () => {
    dispatch(toggleExpanded(page.__id))
  }
  const handleOnClick = () => {
    if (notebookId) {
      navigate(`/editor/${notebookId}/${page.__id}`)
    }
  }
  const handleAddPage = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation()
    dispatch(
      NebulaModal.showModal({
        id: 'pageCreate',
        type: 'page/create',
        parentId: page.__id,
        insertAfterId: null,
        x: ev.currentTarget.getBoundingClientRect().left,
        y: ev.currentTarget.getBoundingClientRect().top,
        label: 'Create Sub-page',
      })
    )
  }

  const handlePageContext = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation()
    if (currentPage) {
      dispatch(
        NebulaModal.showModal({
          id: 'pageContext',
          type: 'page/context',
          pageId: currentPage.__id,
          x: ev.currentTarget.getBoundingClientRect().left,
          y: ev.currentTarget.getBoundingClientRect().top + 10,
          label: 'Options',
        })
      )
    }
  }

  return (
    <div className="sidebar-expandable_container">
      <PageButton
        subPageCount={page.sub_pages.length}
        id={page.__id}
        onAddClick={handleAddPage}
        isActive={pageId === page.__id}
        onExpandClick={handleExpand}
        isExpanded={isPageExpanded}
        onClick={handleOnClick}
        onOptionsClick={handlePageContext}
      >
        {page.title}
      </PageButton>
      {isPageExpanded ? (
        <>
          {page.sub_pages && page.sub_pages.length > 0 ? (
            <div className="sidebar-expandable_container__subpage">
              {page.sub_pages.map((subPage) => {
                return <SidebarExpandable key={subPage.__id} page={subPage} />
              })}
            </div>
          ) : (
            <div className="sidebar-expandable_container__no-sub-pages">
              No SubPages
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default SidebarExpandable
const PageButton = (props: {
  id: string
  children: string
  subPageCount: number
  isExpanded?: boolean
  isActive?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onExpandClick?: () => void
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>
  onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const { isActive = false } = props

  return (
    <div
      id={props.id}
      role="button"
      tabIndex={1}
      className={`sidebar-expandable_container__button ${
        isActive ? 'active' : ''
      }`}
      onClick={props.onClick}
    >
      <div className="sidebar-expandable_container__button__left">
        <Button
          style={{ marginRight: '0.4rem' }}
          onClick={(ev) => {
            ev.stopPropagation()
            props.onExpandClick && props.onExpandClick()
          }}
          variant="transparent"
        >
          {props.isExpanded ? (
            <ChevronDownIcon width={14} />
          ) : (
            <ChevronRightIcon width={14} />
          )}
        </Button>

        <div>
          <BsFiletypeMd className="icon" />
        </div>

        <span className="sidebar-expandable_container__button__text">
          {props.children}

          {props.subPageCount > 0 && (
            <span className="sub-pages-count">{props.subPageCount}</span>
          )}
        </span>
      </div>
      <div className="sidebar-expandable_container__button__options">
        <Button onClick={props.onOptionsClick} variant="transparent">
          <SlOptions />
        </Button>

        <Button onClick={props.onAddClick} variant="transparent">
          <IoMdAdd />
        </Button>
      </div>
    </div>
  )
}
