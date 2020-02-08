import React, { Component } from 'react'
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import '../Css/Register-Login.css';

class Register extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',

            registered: false,
            alreadyRegistered: false,

            errRegister: ''
        }
    }

    emailOnchange = (e) => {
        this.setState({ email: e.target.value })
    }

    passwordOnchange = (e) => {
        this.setState({ password: e.target.value })
    }

    register = (e) => {
        let { email, password } = this.state;          // OOOBSSSS !!! fixa logik för att inte kunna submit ifall input fältet är tomt!
        const API_ROOT = 'http://3.120.96.16:3002';

        let validEmail = /^([A-Z\d\.-]+)@([A-Z\d-]+)\.([A-Z]{2,8})(\.[A-Z]{2,8})?$/i.test(email);
        let validPassword = /^[A-Za-z]?\w{3,14}?$/i.test(password);
        if (!validEmail ) {
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
            .post(`${API_ROOT}/register`, data)
        .then(res => {
            console.log(res);
            this.setState({ registered: true })
        })
        .catch(err => {
            console.log(err);
            this.setState({ alreadyRegistered: true });

            if (this.state.alreadyRegistered) {
                this.setState({ errRegister: 'Ooopps!!! This account is already registered!' })
            } else {
                this.setState({ errRegister: '' })
            }
        })
    }
    }


    render() {
        const { email, password, registered, errRegister } = this.state;

        if (registered) return <Redirect to="/login" />

        return (
            <div>
            <div className="register-login-container">
                <div className="my-register-page">
                    <div className="navLinks-container">
                        <Helmet>
                            <title>Register</title>
                        </Helmet>

                        <div className="navlinks">
                            <Link className="register-links" to="/login">
                                <p>LogIn</p>
                            </Link>
                        </div>

                        <div className="navlinks">
                            <Link className="register-links" to="/">
                                <p>Main Page</p>
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={e => e.preventDefault()}>
                        <div className="register-box">
                            <div className="form-head">
                                <h2>Register</h2>
                            </div>

                        <div className="form-body">
                            <input type="email" value={email} onChange={this.emailOnchange} placeholder="example@example.com" />
                            <input type="password" value={password} onChange={this.passwordOnchange} placeholder="Password... Between 3 and 14"/>
                        </div>

                        <div className="form-footer">
                            <button onClick={this.register}>Register</button>
                        </div>
                        <br/>
                        <p style={{ color: 'red', fontSize: '2rem' }}>{errRegister}</p>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        )
    }
}

export default Register
