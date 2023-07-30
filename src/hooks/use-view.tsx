import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
const useView = () => {
  const location = useLocation()

  const currentView = useMemo(() => {
    if (location.pathname == '/') {
      return 'home'
    }
    if (location.pathname.startsWith('/editor')) {
      return 'editor'
    }
  }, [location])

  return currentView
}

export default useView
