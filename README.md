![logo-nebula](/assets/logo-nebula.svg)

Nebula is a markdown editor app made using `tauri`

![logo-nebula](/assets/nebula-preview.png)


## Dev 

```bash
yarn tauri dev
# or
npm run tauri dev
```


## Build 

```bash
yarn tauri build
#or
npm run tauri build
```

- The application will be available in `src-tauri/target/release`
- The installer will be in `src-tauri/target/release/build`

# Getting Started

### Preview Modes

You can toggle between `Edit-Mode` and `Preview-Mode` with the help of

`Ctrl + /` **or**  `Ctrl + e` -> This will toggle b/w those two modes

If you want a live preview use the split-screen mode
`Ctrl` + `Shift` + `/` -> This will toggle split screen mode

### Editing Shortcuts

Nebula provides a bunch of shortcuts to make your life easier

- `Ctrl` + `1 to 6` will allow you to add headers from `h1` to `h6` or switch b/w them
- `Ctrl` + `l` to add a _horizontal line_ below the current line
- `Ctrl` + `b` to make a text **bold** or add a bold **syntax** if text is not selected
- `Alt` + `i` to make a text _italic_ ...
- `Alt`+ `k` to ~~strike-through~~ a text
- `Alt` + `backtick` to make a `code block`

### Code Blocks

Code blocks can be made with **three** backticks followed by the supported _Language_

_Here is an example for javascript_

```javascript
const hello = () => {
  return 'world'
}
```

### Adding Images

You can add images from any source. `Nebula` provides an `Asset Browser` to store all the image
assets in a single space so that you can access the assets in any notebook and reuse them without leaving the app.
To open the `Asset Browser` use the `Box Icon` in the title bar or use the
shortcut `Ctrl` + `Shift` + `A`
