import { Outlet, useParams } from 'react-router-dom'

const HomeWrapper = () => {
  const params = useParams()
  return <Outlet />
}

export default HomeWrapper
