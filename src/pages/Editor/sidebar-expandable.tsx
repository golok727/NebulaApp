import { useState } from 'react'
import { MouseEventHandler, ReactNode } from 'react'
import { SlOptions } from 'react-icons/sl'
import { IoMdAdd } from 'react-icons/io'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import './sidebar-expandable.css'
import Button from '@/components/Button'
import { useParams } from 'react-router-dom'
import { BsFiletypeMd } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { isExpanded } from '@/features/selectors'
import { toggleExpanded } from '@/features/editorSlice'
import { useNavigate } from 'react-router-dom'
interface Props {
  page: PageSimple
}
const SidebarExpandable = (props: Props) => {
  const { page } = props
  const isPageExpanded = useSelector(isExpanded(page.__id))
  const { pageId, notebook: notebookId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleExpand = () => {
    dispatch(toggleExpanded(page.__id))
  }
  const handleOnClick = () => {
    console.log('Click')
    if (notebookId) {
      console.log(window.location.href)
      navigate(`/editor/${notebookId}/${page.__id}`)
    }
  }

  return (
    <div className="sidebar-expandable_container">
      <PageButton
        isActive={pageId === page.__id}
        onExpandClick={handleExpand}
        isExpanded={isPageExpanded}
        onClick={handleOnClick}
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
  children: string
  isExpanded?: boolean
  isActive?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onExpandClick?: () => void
  onAddClick?: () => void
  onOptionsClick?: () => void
}) => {
  const { isActive = false } = props

  return (
    <div
      className={`sidebar-expandable_container__button ${
        isActive ? 'active' : ''
      }`}
      onClick={props.onClick}
    >
      <div className="sidebar-expandable_container__button__left">
        <Button
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
        </span>
      </div>
      <div className="sidebar-expandable_container__button__options">
        <Button variant="transparent">
          <SlOptions />
        </Button>

        <Button variant="transparent">
          <IoMdAdd />
        </Button>
      </div>
    </div>
  )
}
