import { NebulaModal } from '@/features/modalSlice'
import { getNebulaProtocolUrl } from '@/utils/helper'
import React from 'react'
import { useDispatch } from 'react-redux'

const RemarkImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const url = getNebulaProtocolUrl(props.src || '')
  const dispatch = useDispatch()
  const showPreview = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'ImagePreview',
        type: 'asset/preview',
        fullScreen: true,
        url,
        x: 0,
        y: 0,
      })
    )
  }
  return (
    <img
      loading="lazy"
      style={{ maxWidth: '30em' }}
      {...props}
      alt=""
      onClick={showPreview}
      src={getNebulaProtocolUrl(props.src || '')}
    />
  )
}

export default RemarkImg
