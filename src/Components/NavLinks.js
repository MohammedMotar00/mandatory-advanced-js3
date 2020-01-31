import React from 'react'
import { Link } from 'react-router-dom';

function NavLinks() {
    return (
        <div>
            <Link to="/register">
                <p>Register</p>
            </Link>

            <Link to="/login">
                <p>Log In</p>
            </Link>
        </div>
    )
}

export default NavLinks
