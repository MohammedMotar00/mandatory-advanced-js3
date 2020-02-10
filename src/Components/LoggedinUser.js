import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {token$} from "./TokenStore";
import jwt from 'jsonwebtoken';

import '../App.css';

class LoggedinUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: null
        }
    }

    componentDidMount() {

        this.subscription = token$.subscribe(token => {
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
                    <p className="loggedIn-user">{email}</p>
                </Link>
            </>
        )
    }
}

export default LoggedinUser
