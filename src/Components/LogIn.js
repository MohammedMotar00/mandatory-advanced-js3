import React, { Component } from 'react'
import axios from 'axios';
import { updateToken } from './TokenStore';
import { Redirect } from 'react-router-dom';

class LogIn extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',

            loggedIn: false,
            token: false
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
            updateToken(null);
            this.setState({ token: true });
        })
    }


    render() {
        const { email, password, loggedIn, token } = this.state;

        if (loggedIn) return <Redirect to="/todo" />

        if (token) return <Redirect to="/login" />


        return (
            <form onSubmit={e => e.preventDefault()}>
                <label>
                    Email:
                    <input type="text" value={email} onChange={this.emailOnchange}/>
                </label>

                <label>
                    Password:
                    <input type="password" value={password} onChange={this.passwordOnchange}/>
                </label>

                <button onClick={this.loginValidator}>Log in</button>
            </form>
        )
    }
}

export default LogIn
