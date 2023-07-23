import Button from '@/components/Button'
import './sidebar-group.css'

import React from 'react'
import { AiOutlineReload } from 'react-icons/ai'

import { CiStickyNote } from 'react-icons/ci'
import { VscSaveAll } from 'react-icons/vsc'
interface Props {
  groupTitle: string
  children: React.ReactNode
}
const SidebarGroup = ({ groupTitle, children }: Props) => {
  return (
    <div className="sidebar__group">
      <header className="sidebar__group__header">
        <span>{groupTitle}</span>

        <div className="controls">
          <Button variant="transparent">
            <CiStickyNote />
          </Button>

          <Button variant="transparent">
            <VscSaveAll />
          </Button>

          <Button variant="transparent">
            <AiOutlineReload />
          </Button>
        </div>
      </header>

      <section className="sidebar__group__content">{children}</section>
    </div>
  )
}

export default SidebarGroup
