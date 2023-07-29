import AppLogo from '@/assets/logo-nebula.svg'
import {
  ArchiveBoxIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  UserCircleIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import { PiSlideshow, PiSlideshowFill } from 'react-icons/pi'
import MenuButton from './Button'
import './topbar.css'

import {
  toggleNoDistractionsMode,
  toggleSplitMode,
  toggleSidebar,
  togglePreviewOnly,
} from '@/features/appSlice'
import { isInView } from '@/features/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { BsSave } from 'react-icons/bs'
import { RootState } from '@/app/store'
import { invoke } from '@tauri-apps/api/tauri'

const TopBar = () => {
  const {
    sidebar: showSidebar,
    preview: showPreview,
    appMode,
  } = useSelector(isInView)
  const currentPageId = useSelector(
    (state: RootState) => state.editor.currentPage?.__id
  )
  const currentDoc = useSelector((state: RootState) => state.editor.currentDoc)
  const dispatch = useDispatch()
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }
  const handleToggleDistractionMode = () => {
    dispatch(toggleNoDistractionsMode())
  }

  const handleToggleSplitMode = () => {
    dispatch(toggleSplitMode())
  }

  const handleTogglePreviewOnly = () => {
    dispatch(togglePreviewOnly())
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

        <Button
          onClick={handleTogglePreviewOnly}
          disabled={appMode == 'no-distractions'}
          variant={'transparent'}
        >
          {appMode === 'preview-only' ? (
            <PiSlideshowFill style={{ fontSize: 19 }} />
          ) : (
            <PiSlideshow style={{ fontSize: 19 }} />
          )}
        </Button>

        <Button onClick={handleToggleDistractionMode} variant="transparent">
          <ViewColumnsIcon width={19} />
        </Button>

        <Button
          onClick={handleToggleSplitMode}
          disabled={appMode == 'no-distractions'}
          variant="transparent"
        >
          {!showPreview ? <EyeIcon width={19} /> : <EyeSlashIcon width={19} />}
        </Button>

        <Button variant="transparent">
          <ArchiveBoxIcon width={19} />
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
