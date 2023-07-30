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
import { appWindow } from '@tauri-apps/api/window'
import {
  toggleNoDistractionsMode,
  toggleSplitMode,
  toggleSidebar,
  togglePreviewOnly,
} from '@/features/appSlice'
import { currentPageAndNoteName, isInView } from '@/features/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { FiMaximize, FiMinimize } from 'react-icons/fi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import useView from '@/hooks/use-view'
const TopBar = () => {
  const currentView = useView()
  const {
    sidebar: showSidebar,
    preview: showPreview,
    appMode,
  } = useSelector(isInView)
  const { currentNotebookName, currentPageName } = useSelector(
    currentPageAndNoteName
  )
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
    <div data-tauri-drag-region className="top-bar">
      <div className="top-bar__left">
        <Link to="/" className="top-bar__link">
          <img src={AppLogo} alt="AppLogo" className="app-logo" />
        </Link>
        {currentView === 'editor' && (
          <>
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
          </>
        )}

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

      <div className="top-bar__mid">
        {currentPageName && <span>{currentPageName} - </span>}
        {currentNotebookName && <span>{currentNotebookName} - </span>}
        Nebula
        {/* <MenuItems /> */}
      </div>
      <div className="top-bar__right">
        {currentView === 'editor' && (
          <div className="views">
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
              {!showPreview ? (
                <EyeIcon width={19} />
              ) : (
                <EyeSlashIcon width={19} />
              )}
            </Button>
          </div>
        )}
        <div className="window-controls">
          <Button
            onClick={() => appWindow.minimize()}
            variant="title-bar-control minimize"
          >
            <FiMinimize style={{ fontSize: 16 }} />
          </Button>

          <Button
            onClick={() => appWindow.toggleMaximize()}
            variant="title-bar-control maximize"
          >
            <FiMaximize style={{ fontSize: 15 }} />
          </Button>

          <Button
            onClick={() => appWindow.close()}
            variant="title-bar-control close"
          >
            <AiOutlineCloseCircle style={{ fontSize: 16 }} />
          </Button>
        </div>
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
