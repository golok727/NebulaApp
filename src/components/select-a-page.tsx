import { LayeredPeaks, LogoNebula } from '@/assets'
import './select-a-page.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
const SelectAPage = () => {
  const currentNoteName = useSelector(
    (state: RootState) => state.editor.currentNotebook?.name
  )
  return (
    <div className="editor__select-a-page">
      <div
        className="editor__select-a-page-inner"
        style={{
          backgroundImage: `url(${LayeredPeaks})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <img src={LogoNebula} alt="" />
        <span className="tool-tip">
          Press <code>ctrl</code> + <code>n</code> for new page in &apos;
          {currentNoteName ?? ' this notebook '}&apos;
        </span>
      </div>
    </div>
  )
}

export default SelectAPage
