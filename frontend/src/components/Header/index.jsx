import { NavLink } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useAuth from '../../hooks/useAuth'

import './style.css'

const Header = () => {
    const { logout, isConnected, user } = useAuth()

    if (!isConnected) {
        return null
    }

    return (
        <header className="navbar">
            <nav className="menu">
                <NavLink to="/"><FontAwesomeIcon icon="fa-regular fa-house"/> Home</NavLink>
                <NavLink to="/create"><FontAwesomeIcon icon="fa-regular fa-calendar-plus" /> Add a todo</NavLink>
            </nav>
            <div className="user-actions">
                { isConnected && <>
                    <div>Hello {user.username}</div>
                    <button type="button" onClick={logout}>Logout</button>
                </>}
            </div>
        </header>
    )
}

export default Header