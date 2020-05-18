const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// @route POST api/users
// @desc Register USer
// access Public
router.post('/', [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please include a valid Email").isEmail(),
    check("password", "Please enter password with 6 or more character").isLength({
        min: 6
    })

], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body
    try {
        let user = await User.findOne({ email })
        // see if user exists

        if (user) {
            return res.status(400).json({ errors: [{ msg: "user already exist" }] })

        }

        // get users gravatar
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })
        // encrypt password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        const payload = {
            user: {
                id: user.id
            }
        }
        // return jsonwebtoken

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            }
        )

        // res.send("USer Registered")


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }

})

module.exports = router