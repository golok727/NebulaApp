import { HTMLAttributes, ReactNode } from 'react'
import './button.css'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  disabled?: boolean
  variant?:
    | 'menu'
    | 'navigation'
    | 'default'
    | 'transparent'
    | 'transparent white'
}
const Button: React.FC<Props> = ({
  children,
  variant = 'default',
  disabled = false,
  ...props
}) => {
  return (
    <button disabled={disabled} {...props} className={`app__button ${variant}`}>
      {children}
    </button>
  )
}

export default Button
