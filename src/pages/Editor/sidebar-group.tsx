import './sidebar-group.css'

import React from 'react'
interface Props {
  groupTitle: string
  children: React.ReactNode
}
const SidebarGroup = ({ groupTitle, children }: Props) => {
  return (
    <div className="sidebar__group">
      <header className="sidebar__group__header">{groupTitle}</header>

      <section className="sidebar__group__content">{children}</section>
    </div>
  )
}

export default SidebarGroup
