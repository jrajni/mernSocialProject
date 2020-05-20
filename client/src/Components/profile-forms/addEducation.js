import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'
import { Link, withRouter } from 'react-router-dom'
const AddEducation = ({ addExperience, history }) => {

    const [formData, setFormData] = useState({
        degree: "",
        school: "",
        from: "",
        to: "",
        current: false,
        description: ""
    })
    const [toDateDisabled, toggleDisabled] = useState(false)
    const {
        degree,
        school,
        from,
        to,
        current,
        description
    } = formData
    const onChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }
    return (
        <Fragment>
            <h1 class="large text-primary">
                Add An Education
      </h1>
            <p class="lead">
                <i class="fas fa-code-branch"></i> Add any School or bootcampm that you have attended
      </p>
            <small>* = required field</small>
            <form class="form" onSubmit={e => {

                e.preventDefault()
                console.log("working")
                addEducation(formData, history)
            }}>
                <div class="form-group">
                    <input type="text"
                        value={degree} onChange={e => { onChange(e) }}
                        placeholder="* Job degree" name="degree" required />
                </div>
                <div class="form-group">
                    <input type="text"
                        value={school} onChange={e => { onChange(e) }}
                        placeholder="* school" name="school" required />
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

AddEducation.propTypes = {
    addExperience: PropTypes.func.isRequired,
}

export default connect(null, { addEducation })(withRouter(AddEducation))
