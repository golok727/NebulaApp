import { RootState } from '@/app/store'
import { NebulaCache } from '@/features/cacheSlice'
import useNebulaProtocol, {
  NEBULA_PROTOCOL_REGEX,
} from '@/hooks/use-nebula-protocol'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const RemarkImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const imageSrc = useNebulaProtocol(props.src || '', false, 300)
  const dispatch = useDispatch()
  const cachedImageSrc = useSelector(
    (state: RootState) => state.cache.images[props.src || '']
  )

  return (
    <img
      onLoad={(ev) => {
        if (
          cachedImageSrc === undefined &&
          NEBULA_PROTOCOL_REGEX.test(props.src || '')
        ) {
          dispatch(
            NebulaCache.setImageCache({
              identifier: props.src || '',
              url: ev.currentTarget.src,
            })
          )
        }
      }}
      loading="lazy"
      style={{ maxWidth: '30em' }}
      {...props}
      alt=""
      src={imageSrc}
    />
  )
}

export default RemarkImg
