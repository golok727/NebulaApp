import { useState } from 'react'
import { MouseEventHandler, ReactNode } from 'react'
import { CiStickyNote } from 'react-icons/ci'
import { SlOptions } from 'react-icons/sl'
import { IoMdAdd } from 'react-icons/io'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import './sidebar-expandable.css'
import Button from '@/components/Button'
interface Props {
  page: Page
}
const SidebarExpandable = (props: Props) => {
  const { page } = props
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpand = () => {
    setIsExpanded((prev) => !prev)
  }
  return (
    <div className="sidebar-expandable_container">
      <PageButton onExpandClick={handleExpand} isExpanded={isExpanded}>
        {page.title}
      </PageButton>
      {isExpanded ? (
        <>
          {page.subPages && page.subPages.length > 0 ? (
            <div className="sidebar-expandable_container__subpage">
              {page.subPages.map((subPage) => {
                return <SidebarExpandable key={subPage._id_} page={subPage} />
              })}
            </div>
          ) : (
            <div className="sidebar-expandable_container__no-sub-pages">
              No Subpages
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
  children: ReactNode
  isExpanded?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onExpandClick?: () => void
  onAddClick?: () => void
  onOptionsClick?: () => void
}) => {
  return (
    <div
      className="sidebar-expandable_container__button"
      onClick={props.onClick}
    >
      <div className="sidebar-expandable_container__button__left">
        <Button
          onClick={() => props.onExpandClick && props.onExpandClick()}
          variant="transparent"
        >
          {props.isExpanded ? (
            <ChevronDownIcon width={14} />
          ) : (
            <ChevronRightIcon width={14} />
          )}
        </Button>

        <CiStickyNote className="icon" />
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
