import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getCommand, getHandler, getKeyBindings } from './keyboard'

const useKeyboard = () => {
  const dispatch = useDispatch()
  const handleKeyDown = useCallback((ev: KeyboardEvent) => {
    const binding = getKeyBindings(ev)
    const command = getCommand(binding)
    if (command !== undefined) {
      const handler = getHandler(command)
      if (handler) handler(dispatch)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
export default useKeyboard
