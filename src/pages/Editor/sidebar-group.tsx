import Button from '@/components/Button'
import './sidebar-group.css'

import React from 'react'
import { AiOutlineReload } from 'react-icons/ai'

import { CiStickyNote } from 'react-icons/ci'
import { VscSaveAll, VscCollapseAll } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { NebulaModal } from '@/features/modalSlice'
import { collapseAll } from '@/features/editorSlice'
interface Props {
  groupTitle: string
  children: React.ReactNode
}
const SidebarGroup = ({ groupTitle, children }: Props) => {
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )
  const dispatch = useDispatch()
  const handleAddPage = (ev: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      NebulaModal.showModal({
        id: 'pageCreate',
        type: 'page/create',
        parentId: null,
        insertAfterId: currentPage !== null ? currentPage.__id : null,
        x:
          ev.detail === 0
            ? ev.currentTarget.getBoundingClientRect().left
            : ev.pageX,
        y:
          ev.detail === 0
            ? ev.currentTarget.getBoundingClientRect().top + 10
            : ev.pageY + 10,
        label: 'Create Page',
      })
    )
  }
  const handleCollapseAll = () => {
    dispatch(collapseAll())
  }
  return (
    <div className="sidebar__group">
      <header className="sidebar__group__header">
        <span>{groupTitle}</span>

        <div className="controls">
          <Button onClick={handleAddPage} variant="transparent">
            <CiStickyNote />
          </Button>

          <Button variant="transparent">
            <VscSaveAll />
          </Button>

          <Button variant="transparent">
            <AiOutlineReload />
          </Button>

          <Button onClick={handleCollapseAll} variant="transparent">
            <VscCollapseAll />
          </Button>
        </div>
      </header>

      <section className="sidebar__group__content">{children}</section>
    </div>
  )
}

export default SidebarGroup
