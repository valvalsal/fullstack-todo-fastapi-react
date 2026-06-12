import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './style.css'

const Loader = () => {
    return (
        <div className="loader">
            <FontAwesomeIcon icon="fa-solid fa-spinner" spin size="xl" />
        </div>
    )
}

export default Loader