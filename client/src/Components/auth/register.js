import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    const { email, password, name, password2 } = formData
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("password donot match", 'danger')
        }
        else {
            register({ name, email, password })
        }
    }
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => { onSubmit(e) }}>
                    <div className="form-group">
                        <input type="text"
                            value={name}
                            onChange={e => { onChange(e) }}
                            placeholder="Name"
                            name="name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            value={email}
                            type="email"
                            onChange={e => { onChange(e) }}
                            placeholder="Email Address"
                            name="email"
                        />
                        <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                        >
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
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            minLength="6"
                            name="password2"
                            onChange={e => { onChange(e) }}
                            name="password2"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </section>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})


Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}
export default connect(null, { setAlert, register })(Register);