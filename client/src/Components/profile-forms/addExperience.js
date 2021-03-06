import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'
import { Link, withRouter } from 'react-router-dom'
const AddExperience = ({ addExperience, history }) => {

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        from: "",
        to: "",
        current: false,
        description: ""
    })
    const [toDateDisabled, toggleDisabled] = useState(false)
    const {
        title,
        company,
        from,
        to,
        current,
        description
    } = formData
    const onChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }
    return (
        <Fragment>
            <h1 class="large text-primary">
                Add An Experience
      </h1>
            <p class="lead">
                <i class="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
      </p>
            <small>* = required field</small>
            <form class="form" onSubmit={e => {
                e.preventDefault()
                addExperience(formData, history)
            }}>
                <div class="form-group">
                    <input type="text"
                        value={title} onChange={e => { onChange(e) }}
                        placeholder="* Job Title" name="title" required />
                </div>
                <div class="form-group">
                    <input type="text"
                        value={company} onChange={e => { onChange(e) }}
                        placeholder="* Company" name="company" required />
                </div>
                {/* <div class="form-group">
                    <input type="text"
                        value={location} onChange={e => { onChange(e) }}
                        placeholder="Location" name="location" />
                </div> */}
                <div class="form-group">
                    <h4>From Date</h4>
                    <input type="date"
                        value={from} onChange={e => { onChange(e) }}
                        name="from" />
                </div>
                <div class="form-group">
                    <p><input type="checkbox"
                        value={current}
                        checked={current}
                        onChange={e => {
                            setFormData({ ...formData, current: !current })
                            toggleDisabled(!toDateDisabled)
                        }
                        }
                        name="current" value="" /> {" "}Current Job</p>
                </div>
                <div class="form-group">
                    <h4>To Date</h4>
                    <input
                        value={to} onChange={e => { onChange(e) }}
                        type="date" name="to"
                        disabled={toDateDisabled ? 'disabled' : ''}
                    />
                </div>
                <div class="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        value={description} onChange={e => { onChange(e) }}
                        rows="5"
                        placeholder="Job Description"
                    ></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <a class="btn btn-light my-1" href="dashboard.html">Go Back</a>
            </form>

        </Fragment>
    )
}

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired,
}

export default connect(null, { addExperience })(withRouter(AddExperience))
