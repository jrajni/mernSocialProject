const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require("../../models/User")
const { check, validationResult } = require('express-validator')

// @route GET api/profile/me
// @desc Get Current User's Profile
// access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            console.log("backend working")
            res.status(400).json({ msg: "There is no profile for this user" })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("SErver Error")
    }
})

// @route POST api/profile/me
// @desc Current or update User's Profile
// access Private
router.post('/', [
    auth,
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
], async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body

    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    // Build Social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate({ user: req.user.id },
                { $set: profileFields },
                { new: true })
            res.json(profile)
        } else {
            // create
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

// @route GET api/profile
// @desc Get all Profile
// access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})


// @route GET api/profile/user/:user_id
// @desc Get Profile by userid
// access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile)
            return res.status(400).json({ msg: "there is no profile for this user" })
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId')
            return res.status(400).json({ msg: "no profile found for this user" })

        res.status(500).send("Server Error")
    }
})


// @route DELETE api/profile
// @desc DELETE Profile,user &posts
// access Private
router.delete('/', auth, async (req, res) => {
    try {
        // @todo=remove userposts
        // remove profile

        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: "User removed" })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})


// @route PUT api/profile/experience
// @desc Add Profile experience
// access Private
router.put('/experience', [auth,
    check('title', 'title is required').not().isEmpty()
    , check('company', 'company is required').not().isEmpty()

    , check('from', 'from date is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }
    const {
        title,
        company,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.msg)
        res.status(500).send("server error")
    }
})

// @route DELETE api/profile/experience/:exp_id
// @desc DELETE experience from profile
// access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        // get remove index
        const removeItem = profile.experience.map((item) => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeItem, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})


// @route PUT api/profile/education
// @desc Add Profile education
// access Private
router.put('/education', [auth,
    check('school', 'school is required').not().isEmpty()
    , check('degree', 'degree is required').not().isEmpty()
    // , check('fieldofstudy', 'fieldofstudy is required').not().isEmpty()

    , check('from', 'from date is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }
    const {
        school,
        degree,
        from,
        to,
        fieldofstudy,
        description
    } = req.body;
    const newEdu = {
        school,
        degree,
        from,
        to,
        fieldofstudy,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})

// @route DELETE api/profile/education/:exp_id
// @desc DELETE education from profile
// access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        // get remove index
        const removeItem = profile.education.map((item) => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeItem, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router