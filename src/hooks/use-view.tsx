import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
const useView = () => {
  const location = useLocation()

  const currentView = useMemo(() => {
    if (location.pathname == '/') {
      return { home: true, settings: false, editor: false }
    }
    if (location.pathname.startsWith('/editor')) {
      return { home: false, settings: false, editor: true }
    }

    if (location.pathname.startsWith('/settings')) {
      return { home: false, settings: true, editor: false }
    }
    return { home: false, settings: false, editor: false }
  }, [location])

  return currentView
}

export default useView
