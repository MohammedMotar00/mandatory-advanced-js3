import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {token$} from "./TokenStore";
import jwt from 'jsonwebtoken';

class LoggedinUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: ''
        }
    }

    componentDidMount() {
        token$.subscribe(token => {
            const decoded = jwt.decode(token);

            if (token && decoded) {
                this.setState({ email: decoded.email });
            }
            else {
                this.setState({ email: null })
            }
        })
    }


    render() {
        const { email } = this.state;

        return (
            <>
                <Link to="/todo">
                    <p style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: '100', fontSize: '2rem', color: 'white' }}>{email}</p>
                </Link>
            </>
        )
    }
}

export default LoggedinUser
