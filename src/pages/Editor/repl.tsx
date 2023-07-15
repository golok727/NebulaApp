import './repl.css'
import useCodeMirror from '@/hooks/use-codemirror'
import React from 'react'

const initialDoc = `# Radhey Shyam
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
 1. \`ctrl\` + \`shift\` + \`k\`  = delete line


**This is amazing**
This is !~~cool~~ \
This is working as *expected* all glories to 
**Shrimati Radhika Rani**

`
interface Props {}
const Repl: React.FC<Props> = () => {
  const [editorRef, view] = useCodeMirror({
    initialDoc,
    onChange: () => {},
  })

  return (
    <div className="editor__repl-container">
      <div ref={editorRef} className="editor__repl" />
    </div>
  )
}

export default Repl
