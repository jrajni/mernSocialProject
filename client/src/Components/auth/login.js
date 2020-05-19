import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'
import { setAlert } from '../../actions/alert'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const { email, password } = formData
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = async (e) => {
        e.preventDefault();
        login(email, password)
        // console.log("success")
    }
    //    REDIRECT IF LOGGED IN 
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> Log Into Your Account</p>
                <form className="form" onSubmit={e => { onSubmit(e) }}>

                    <div className="form-group">
                        <input
                            value={email}
                            type="email"
                            onChange={e => { onChange(e) }}
                            placeholder="Email Address"
                            name="email"
                            required />

                    </div>
                    <div className="form-group">
                        <input
                            value={password}
                            onChange={e => { onChange(e) }}

                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                        />
                    </div>

                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have Account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    )
}
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, { login })(Login);