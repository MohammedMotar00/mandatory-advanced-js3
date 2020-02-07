import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';

import { updateToken } from './TokenStore';

import { Helmet } from 'react-helmet';

class LogIn extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',

            loggedIn: false,
            // token: false

            invalidLogin: false,
            errLogin: '',

            tokenValid: false,
        }
    }

    emailOnchange = (e) => {
        this.setState({ email: e.target.value })
    }

    passwordOnchange = (e) => {
        this.setState({ password: e.target.value })
    }

    loginValidator = () => {
        let { email, password } = this.state;
        const API_ROOT = 'http://3.120.96.16:3002';

        let data = {
            email: email,
            password: password
        }

        axios
            .post(`${API_ROOT}/auth`, data)
        .then(res => {
            console.log(res);
            let token = res.data.token;

            updateToken(token);

            this.setState({ loggedIn: true })
        })
        .catch(err => {
            console.log(err);
            // this.setState({ token: true });

            this.setState({ invalidLogin: true });

            if (this.state.invalidLogin) {
                this.setState({ errLogin: 'Invalid email or password! Please try again...'});
            }
            else {
                this.setState({ errLogin: '' });
            }

            updateToken(null);
        })
    }


    render() {
        const { email, password, loggedIn, errLogin } = this.state;

        if (loggedIn) return <Redirect to="/todo" />

        // if (token) return <Redirect to="/login" />


        return (
            <>
            <Helmet>
                <title>LogIn</title>
            </Helmet>

            <Link to="/">
                <p>Main Page</p>
            </Link>

            <form onSubmit={e => e.preventDefault()}>
                <label>
                    Email:
                    <input type="email" minLength="3" value={email} onChange={this.emailOnchange}/>
                </label>

                <label>
                    Password:
                    <input type="password" minLength="1" value={password} onChange={this.passwordOnchange}/>
                </label>

                <button onClick={this.loginValidator}>Log in</button>
                <br/>
                <p>{ errLogin }</p>
            </form>

            <div>
                <p>Haven't registered yet?</p>
                <p>Please click on register button to register!</p>
                <Link to="/register">
                    <button>Register</button>
                </Link>
            </div>
            </>
        )
    }
}

export default LogIn
