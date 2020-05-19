import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCurrentProfile } from '../../actions/profile'
const Dashboard = (
    { getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {

    }, [])
    return loading && profile === null && <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            Welcome {user && user.name}

        </p>
        {profile !== null ?
            <Fragment>has</Fragment> :
            <Fragment><p>You don't have profile .Please add some
                </p>
                <Link to="/create-profile">Create Profile</Link>
            </Fragment>}
    </Fragment>
}

Dashboard.propTypes = {

    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
