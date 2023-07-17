import AppLogo from '@/assets/logo-nebula.svg'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  UserCircleIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import MenuButton from './Button'
import './topbar.css'

import {
  toggleNoDistractionsMode,
  togglePreviewMode,
  toggleSidebar,
} from '@/features/appSlice'
import { isInView } from '@/hooks/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'

const TopBar = () => {
  const {
    sidebar: showSidebar,
    preview: showPreview,
    appMode,
  } = useSelector(isInView)
  const dispatch = useDispatch()

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }
  const handleToggleDistractionMode = () => {
    dispatch(toggleNoDistractionsMode())
  }

  const handleTogglePreview = () => {
    dispatch(togglePreviewMode())
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

        <Button
          onClick={handleToggleSidebar}
          disabled={appMode == 'no-distractions'}
          variant={'transparent'}
        >
          {showSidebar ? (
            <ChevronDoubleLeftIcon width={19} />
          ) : (
            <ChevronDoubleRightIcon width={19} />
          )}
        </Button>

        <Button onClick={handleToggleDistractionMode} variant="transparent">
          <ViewColumnsIcon width={19} />
        </Button>

        <Button
          onClick={handleTogglePreview}
          disabled={appMode == 'no-distractions'}
          variant="transparent"
        >
          {!showPreview ? <EyeIcon width={19} /> : <EyeSlashIcon width={19} />}
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
