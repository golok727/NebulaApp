import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getCommand, getHandler, getKeyBindings } from './keyboard'
import useView from '@/hooks/use-view'
import { useNebulaCore } from '@/context/nebula'

const useKeyboard = () => {
  const dispatch = useDispatch()
  const currentView = useView()
  const nebula = useNebulaCore()

  const handleKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      const binding = getKeyBindings(ev)
      const command = getCommand(binding, currentView)
      if (command !== undefined) {
        const handler = getHandler(command, currentView)
        if (handler) handler(dispatch, nebula)
      }
    },
    [currentView, dispatch, nebula]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
export default useKeyboard
