import AppLogo from '@/assets/logo-nebula.svg'
import {
  toggleNoDistractionsMode,
  togglePreviewOnly,
  toggleSidebar,
  toggleSplitMode,
} from '@/features/appSlice'
import { currentPageAndNoteName, isInView } from '@/features/selectors'
import useView from '@/hooks/use-view'
import {
  ArchiveBoxIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { FiMaximize, FiMinimize } from 'react-icons/fi'
import { TbMaximizeOff } from 'react-icons/tb'
import { PiSlideshow, PiSlideshowFill } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { default as Button, default as MenuButton } from './Button'
import './topbar.css'
import { appWindow } from '@tauri-apps/api/window'
import { UnlistenFn } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { useCallback, useEffect, useState } from 'react'
const TopBar = () => {
  const [isWindowMaximized, setIsWindowMaximized] = useState(false)
  const [windowTitle, setWindowTitle] = useState('Nebula')
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
  const openSettingsWindow = async () => {
    await invoke('open_settings_window')
  }

  const handleToggleSplitMode = () => {
    dispatch(toggleSplitMode())
  }

  const handleTogglePreviewOnly = () => {
    dispatch(togglePreviewOnly())
  }
  const updateIsWindowMaximized = useCallback(async () => {
    const resolvedPromise = await appWindow.isMaximized()
    setIsWindowMaximized(resolvedPromise)
  }, [])

  useEffect(() => {
    updateIsWindowMaximized()
    let unlisten: UnlistenFn | undefined = undefined
    const listen = async () => {
      unlisten = await appWindow.onResized(() => {
        updateIsWindowMaximized()
      })
    }
    listen()
    return () => unlisten && unlisten()
  }, [updateIsWindowMaximized])
  useEffect(() => {
    ;(async () => {
      const title = await appWindow.title()
      setWindowTitle(title)
    })()
  }, [])

  return (
    <div data-tauri-drag-region className="top-bar">
      <div className="top-bar__left">
        <Link to="/" className="top-bar__link">
          <img src={AppLogo} alt="AppLogo" className="app-logo" />
        </Link>
        {currentView.editor && (
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
        {!currentView.settings && (
          <>
            <Button variant="transparent">
              <ArchiveBoxIcon width={19} />
            </Button>

            <Button onClick={() => openSettingsWindow()} variant="transparent">
              <EllipsisHorizontalCircleIcon width={19} />
            </Button>

            <Button variant="transparent">
              <UserCircleIcon width={19} />
            </Button>
          </>
        )}
      </div>

      <div className="top-bar__mid">
        {currentPageName && <span>{currentPageName} - </span>}
        {currentNotebookName && <span>{currentNotebookName} - </span>}
        {<span>{windowTitle}</span>}
        {/* <MenuItems /> */}
      </div>
      <div className="top-bar__right">
        {currentView.editor && (
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
            style={{ ...(currentView.settings ? { display: 'none' } : {}) }}
            onClick={() => appWindow.toggleMaximize()}
            variant="title-bar-control maximize"
          >
            {isWindowMaximized ? (
              <TbMaximizeOff style={{ fontSize: 15 }} />
            ) : (
              <FiMaximize style={{ fontSize: 15 }} />
            )}
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
