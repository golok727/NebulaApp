import { RootState } from '@/app/store'
import useCodeMirror from '@/hooks/use-codemirror'
import { forwardRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import './repl.css'

const initialDoc = `# Radhey Shyam

**This is amazing**
This is !~~cool~~ This is working as *expected* all glories to 
**Shrimati Radhika Rani**



this is a note's taking app 
this is called **Nebula** this is a free app for you guys this is a cool app
1. this is amazing
2. this is nice
this is a underlined text 
<u>underline</u>
Features
---
This has many featues but it is coming soon...
so stay tuned 
this will work 
:))

SHORTCUTS for the app
---

### This is a table
---
shortcut | action 
---      |  ---
\`ctrl\` + \`shift\` + \`k\`  |  delete line
 \`ctrl\` + \`x\`  | cut the line



`
interface Props {}
const Repl = forwardRef<HTMLDivElement | null, Props>((props, ref) => {
  const replWidth = useSelector((state: RootState) => state.app.replWidth)
  const [editorRef, view] = useCodeMirror({
    initialDoc,
    onChange: () => {},
  })

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
    }
  }, [ref])

  return (
    <div
      ref={ref}
      style={{ minWidth: `${replWidth}px` }}
      className="editor__repl-container"
    >
      <div ref={editorRef} className="editor__repl" />
    </div>
  )
})

export default Repl
