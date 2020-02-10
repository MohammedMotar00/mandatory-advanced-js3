import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {token$} from "./TokenStore";
import jwt from 'jsonwebtoken';

class LoggedinUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',

            currentTime: null,
            tokenExpireTime: null,

            token: '',
        }
    }

    componentDidMount() {
        this.subscription = token$.subscribe(token => {
            const decoded = jwt.decode(token);

            console.log(token)
            console.log(decoded);

            if (token && decoded) {
                this.setState({ email: decoded.email });
                this.setState({ tokenExpireTime: decoded.exp });
            }
            else {
                this.setState({ email: null })
            }
        })
    }

    componentDidUpdate() {
        if (this.state.email === null) {
            this.setState({ email: '' })
        }
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
