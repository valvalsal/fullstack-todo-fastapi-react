import api from '../api'

const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams()
        for (const key in credentials) {
            params.append(key, credentials[key])
        }

        const response = await api.post(
            '/auth/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        return response.data
    } catch(e) {
        console.error("Login error:", e)
    }
}

const fetchUserProfile = async () => {
    try {
        const response = await api.get('/users/me')
        return response.data
    } catch(e) {
        console.error("Profile fetch error:", e)
    }
}

export { loginUser, fetchUserProfile }