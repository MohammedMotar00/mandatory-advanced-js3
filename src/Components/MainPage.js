import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import jwt from 'jsonwebtoken';

import { token$ } from "./TokenStore";

class MainPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            currentTime: null,
            tokenExpireTime: null,
            tokenExpired: false
        }
    }

    componentDidMount() {
        this.interval = setInterval( () => {
            this.setState({
                currentTime : new Date().getTime() / 1000   // <-- Gör en sån på alla sidor, så du returnerar automatiskt till login eller main sidan (beroende på vilken sida du är på!)
            })
        }, 1000)

        this.subscription = token$.subscribe(token => {
            const decoded = jwt.decode(token);

            if (decoded) {
                this.setState({ tokenExpireTime: decoded.exp });
            }
            else {
                return null;
            }
        })
    }

    componentDidUpdate() {
        let { currentTime, tokenExpireTime } = this.state;

        if (currentTime > tokenExpireTime) {
            console.log('token expired');

            localStorage.removeItem("token");
            // this.setState({ tokenExpired: true });
        }
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }


    render() {
        const { tokenExpired } = this.state;

        if (tokenExpired) return <Redirect to="/" />

        return (
            <div>
            <div className="container">
                <div className="div-img-background">
                    <Helmet>
                        <title>Main page</title>
                    </Helmet>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ margin: '1.5rem', padding: '1.4rem' }}>
                            <Link className="links" to="/login">
                                <p>LogIn</p>
                            </Link>
                        </div>

                        <div style={{ margin: '1.5rem', padding: '1.4rem', }}>
                            <Link className="links" to="/register">
                                <p>Register</p>
                            </Link>
                        </div>
                    </div>

                    <div className="text">
                        <p>Welcome to the worlds biggest todo website</p>
                        <p>If you wan't to try out this app, it's FREE!!!</p>
                        <p>You only need to sign-in to add your daily activities</p>
                        <p>
                            If you haven't already an account, <br/> you can register now for free in just few minutes...
                            click <Link className="links" to="/register"><strong style={{ color: 'red' }}>here</strong></Link> to register
                        </p>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default MainPage
