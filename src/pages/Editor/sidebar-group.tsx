import Button from '@/components/Button'
import './sidebar-group.css'

import { RootState } from '@/app/store'
import { collapseAll } from '@/features/editorSlice'
import { NebulaModal } from '@/features/modalSlice'
import React, { useState } from 'react'
import { AiOutlineReload } from 'react-icons/ai'
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi'
import { CiStickyNote } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { TbRefreshDot } from 'react-icons/tb'
import { VscCollapseAll } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
export const GroupTypes = {
  Page: 'Page',
  Trash: 'Trash',
} as const

interface Props {
  groupTitle: string
  children: React.ReactNode
  for: keyof typeof GroupTypes
}
const SidebarGroup = ({ groupTitle, children, for: groupFor }: Props) => {
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )
  const dispatch = useDispatch()
  const handleAddPage = (ev: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      NebulaModal.showModal({
        id: 'pageCreate',
        type: 'page/create',
        parentId: currentPage !== null ? currentPage.parent_id : null,
        insertAfterId: currentPage !== null ? currentPage.__id : null,
        x: ev.currentTarget.getBoundingClientRect().left,
        y: ev.currentTarget.getBoundingClientRect().top + 10,
        label: 'Create Page',
      })
    )
  }
  const handleCollapseAll = () => {
    dispatch(collapseAll())
  }
  const [isExpanded, setIsExpanded] = useState(
    groupFor === GroupTypes.Page ? true : false
  )
  return (
    <div className="sidebar__group">
      <header className="sidebar__group__header">
        <div className="sidebar__group__header__left">
          <Button variant="menu" onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? <BiCollapseVertical /> : <BiExpandVertical />}
          </Button>
          <span>{groupTitle}</span>
        </div>

        {groupFor === GroupTypes.Page && (
          <div className="controls">
            {' '}
            <Button onClick={handleAddPage} variant="transparent">
              <CiStickyNote />
            </Button>
            <Button variant="transparent">
              <AiOutlineReload />
            </Button>
            <Button onClick={handleCollapseAll} variant="transparent">
              <VscCollapseAll />
            </Button>
          </div>
        )}

        {groupFor === GroupTypes.Trash && (
          <div className="controls">
            <Button variant="transparent">
              <TbRefreshDot />
            </Button>
            <Button variant="transparent">
              <MdDelete />
            </Button>
          </div>
        )}
      </header>
      <section
        style={{
          overflow: 'hidden',
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'all .5s ease',
        }}
        className="sidebar__group__content"
      >
        <div style={{ overflow: 'hidden' }}>{children}</div>
      </section>
    </div>
  )
}

export default SidebarGroup
