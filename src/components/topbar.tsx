import './topbar.css'
import AppLogo from '../assets/logo-nebula.svg'
import MenuButton from './Button'
import {
  EllipsisHorizontalCircleIcon,
  HomeIcon,
  CloudIcon,
  UserCircleIcon,
  ViewColumnsIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

import { Link } from 'react-router-dom'
import Button from './Button'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '../features/appSlice'
import { RootState } from '../app/store'

const TopBar = () => {
  const { showSidebar } = useSelector(({ app }: RootState) => ({
    showSidebar: app.sidebar.showSidebar,
  }))
  const dispatch = useDispatch()

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }
  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <img src={AppLogo} alt="AppLogo" className="app-logo" />
        <MenuItems />
      </div>

      <div className="top-bar__right">
        <Link to="/" className="top-bar__link">
          <HomeIcon width={19} />
        </Link>

        <Button variant="transparent">
          {showSidebar ? (
            <ChevronDoubleLeftIcon onClick={handleToggleSidebar} width={19} />
          ) : (
            <ChevronDoubleRightIcon onClick={handleToggleSidebar} width={19} />
          )}
        </Button>

        <Button variant="transparent">
          <ViewColumnsIcon width={19} />
        </Button>

        <Button variant="transparent">
          <CloudIcon width={19} />
        </Button>

        <Button variant="transparent">
          <EllipsisHorizontalCircleIcon width={19} />
        </Button>

        <Button variant="transparent">
          <UserCircleIcon width={19} />
        </Button>
      </div>
    </div>
  )
}

export default TopBar
const MenuItems = () => {
  return (
    <ul className="top-bar__tray">
      {['File', 'Edit', 'View', 'Help'].map((item, idx) => (
        <li key={idx}>
          <MenuButton variant="menu">{item}</MenuButton>
        </li>
      ))}
    </ul>
  )
}
