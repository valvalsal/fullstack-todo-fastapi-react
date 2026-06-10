import { NavLink } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './style.css'

const Header = () => {
    return (
        <nav>
            <NavLink to="/"><FontAwesomeIcon icon="fa-regular fa-house"/> Home</NavLink>
            <NavLink to="/create"><FontAwesomeIcon icon="fa-regular fa-calendar-plus" /> Add a todo</NavLink>
        </nav>
    )
}

export default Header