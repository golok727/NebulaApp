import { v4 as uuidv4 } from 'uuid'
export const pagesDummy: PageEntry[] = [
  {
    _id_: uuidv4(),
    title: 'Radhey Shyam',
    content: {
      doctype: 'markdown',
      body: `# Radhey Shyam
        1. Hello 
        2. World 
        3. This is a thing

        ![This is a image](nebula://assets/shriradha.png)
      
      `,
    },
    starred: true,
    pinned: false,
    subPages: [],
  },

  {
    _id_: uuidv4(),
    title: 'hello code',
    content: {
      doctype: 'markdown',
      body: '## Hello Code',
    },
    starred: false,
    pinned: false,
    subPages: [
      {
        _id_: uuidv4(),
        title: 'Javascript',
        content: {
          doctype: 'markdown',
          body: `
      
      \`\`\`
        const hello = () => {
          return 1 
        }
      \`\`\`
      
      
      `,
        },
        starred: false,
        pinned: false,
        subPages: [
          {
            _id_: uuidv4(),
            title: 'Deeply Nested',
            content: {
              doctype: 'markdown',
              body: '# this is deeply nested',
            },
            starred: false,
            pinned: false,
            subPages: [],
          },
        ],
      },
    ],
  },

  {
    _id_: uuidv4(),
    title: 'Hello World',
    content: {
      doctype: 'markdown',
      body: '# This is a coding thing',
    },
    starred: false,
    pinned: false,
    subPages: [],
  },
]
