import Button from '@/components/Button'
import React, { useCallback, useMemo } from 'react'
import './sidebar-group.css'

import { RootState } from '@/app/store'
import { useNebulaCore } from '@/context/nebula'
import {
  collapseAll,
  togglePageGroup,
  toggleTrashGroup,
} from '@/features/editorSlice'
import { NebulaModal } from '@/features/modalSlice'
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
  const trashPagesLength = useSelector(
    (state: RootState) => state.editor.currentNotebook?.trash_pages.length ?? 0
  )

  const dispatch = useDispatch()
  const nebula = useNebulaCore()
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
  const handleRecoverAll = () => {
    nebula.core.recoverAll()
  }
  const handleDeleteAll = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'removeAllPagesPermanent',
        type: 'context/confirm',
        x: 0,
        y: 0,
        label: 'Clear Trash',
        dangerLevel: 2,
        for: 'Delete Page',
        information:
          'You are about to delete all pages in trash and their sub pages Permanently.\nDeleted pages will not be available again',
        fullScreen: true,
        props: {
          type: 'removeAllPagesPermanent',
        },
      })
    )
  }

  const sidebarGroupState = useSelector(
    (state: RootState) => state.editor.sidebarGroup
  )
  const isExpanded = useMemo(() => {
    if (groupFor === GroupTypes.Page) return sidebarGroupState.pages
    if (groupFor === GroupTypes.Trash) return sidebarGroupState.trash
  }, [groupFor, sidebarGroupState])

  const getGroupHandler = useCallback(() => {
    if (groupFor === GroupTypes.Page) {
      return () => {
        dispatch(togglePageGroup())
      }
    }
    if (groupFor === GroupTypes.Trash) {
      return () => {
        dispatch(toggleTrashGroup())
      }
    }
  }, [groupFor, sidebarGroupState])
  return (
    <div className="sidebar__group">
      <header className="sidebar__group__header">
        <div className="sidebar__group__header__left">
          <Button variant="menu" onClick={getGroupHandler()}>
            {isExpanded ? <BiCollapseVertical /> : <BiExpandVertical />}
          </Button>
          <span>{groupTitle}</span>
          {trashPagesLength > 0 && groupFor === GroupTypes.Trash && (
            <span className="trash_pages_length">{`( ${trashPagesLength} )`}</span>
          )}
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
            <Button
              disabled={trashPagesLength === 0}
              onClick={handleRecoverAll}
              variant="transparent"
            >
              <TbRefreshDot />
            </Button>
            <Button
              disabled={trashPagesLength === 0}
              onClick={handleDeleteAll}
              variant="transparent"
            >
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
          transition: 'all .2s ease',
        }}
        className="sidebar__group__content"
      >
        <div style={{ overflow: 'hidden' }}>{children}</div>
      </section>
    </div>
  )
}

export default SidebarGroup
