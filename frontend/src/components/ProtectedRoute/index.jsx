import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router'

import useAuth from '../../hooks/useAuth'
import Loader from '../Loader'

const ProtectedRoute = () => {
    const { isConnected, loading }= useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return

        if (!isConnected) {
            navigate('/login')
        }
    }, [isConnected, loading, navigate])

    if (loading) {
        return <Loader />
    }

    if (!isConnected) {
        return null
    }

    return <Outlet />
}

export default ProtectedRoute