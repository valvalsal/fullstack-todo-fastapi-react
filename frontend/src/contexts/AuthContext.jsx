import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { loginUser, fetchUserProfile } from '../services/userService'

const AuthContext = createContext({})

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('access_token'))
    const [loading, setLoading] = useState(!!localStorage.getItem('access_token'))
    const navigate = useNavigate()
    
    const login = async (username, password) => {
        try {
            setLoading(true)
            const response = await loginUser({username, password})
            if (response?.access_token) {
                setToken(response.access_token)
                localStorage.setItem('access_token', response.access_token)
                return response
            } else {
                setLoading(false)
                throw new Error('Invalid credentials')
            }
        } catch(e) {
            console.error('Context login error:', e)
            throw e
        }

    }

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('access_token')
        navigate('/')
    }, [navigate])
    
    const isConnected = !!token && !!user

    useEffect(() => {
        if (token && !user) {
            const getUser = async () => {
                try {
                const profile = await fetchUserProfile()
                setUser(profile)
                } catch {
                    logout()
                } finally {
                    setLoading(false)
                }
            }
            getUser()
        }
    }, [token, logout, user])

    return (
        <AuthContext.Provider value={{token, user, login, logout, loading, isConnected}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }
