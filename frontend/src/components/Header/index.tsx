import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCalendarPlus } from '@fortawesome/free-regular-svg-icons';

import useRequiredAuth from '@/hooks/useRequiredAuth';

import './style.css';

const Header = () => {
  const { logout, user } = useRequiredAuth();

  return (
    <header className="navbar">
      <nav className="menu">
        <NavLink to="/">
          <FontAwesomeIcon icon={faHouse} /> Home
        </NavLink>
        <NavLink to="/create">
          <FontAwesomeIcon icon={faCalendarPlus} /> Add a todo
        </NavLink>
      </nav>
      <div className="user-actions">
        <div>Hello {user.username}</div>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
