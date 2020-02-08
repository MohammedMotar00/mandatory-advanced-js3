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

        let validEmail = /^([A-Z\d\.-]+)@([A-Z\d-]+)\.([A-Z]{2,8})(\.[A-Z]{2,8})?$/i.test(email);
        let validPassword = /^[A-Za-z]?\w{3,14}?$/i.test(password);

        if (!validEmail) {
            return null
        }
        else if (!validPassword) {
            return null
        }
        else {

        let data = {
            email: email,
            password: password
        }

        axios
            .post(`${API_ROOT}/auth`, data)
        .then(res => {
            let token = res.data.token;
            console.log(token);

            updateToken(token);

            this.setState({ loggedIn: true })
        })
        .catch(err => {
            console.log(err);

            this.setState({ invalidLogin: true });

            if (this.state.invalidLogin) {
                this.setState({ errLogin: 'Invalid email or password! Please try again...' })
            } else {
                this.setState({ errLogin: '' })
            }

            updateToken(null);
        })
    }
    }


    render() {
        const { email, password, loggedIn, errLogin } = this.state;

        if (loggedIn) return <Redirect to="/todo" />


        return (
            <>
            <div className="register-login-container">
                <div className="my-login-page">
                    <div className="navLinks-container">
                        <Helmet>
                            <title>LogIn</title>
                        </Helmet>

                        <div className="navlinks">
                            <Link className="login-links" to="/">
                                <p>Main Page</p>
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={e => e.preventDefault()}>
                        <div className="login-box">
                            <div className="form-head">
                                <h2>Login</h2>
                            </div>

                            <div className="form-body">
                                <input type="email" value={email} onChange={this.emailOnchange} placeholder="example@example.com"/>
                                <input type="password" value={password} onChange={this.passwordOnchange} placeholder="Password... Between 3 and 14" />
                            </div>

                            <div className="form-footer login-button">
                                <button onClick={this.loginValidator}>Log in</button>
                            </div>

                            <br/>

                            <p style={{ color: 'red', fontSize: '2rem' }}>{errLogin}</p>
                        </div>
                    </form>

                    <div className="not-registered">
                        <p>Haven't registered yet?</p>
                        <p>Please click on register button to register!</p>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </div>
            </div>
            </div>
            </>
        )
    }
}

export default LogIn
