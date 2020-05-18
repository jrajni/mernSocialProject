const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')


// @route POST api/posts
// @desc create a post
// access Private
router.post('/',
    [auth,
        check('text', 'text is required').not().isEmpty()
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        try {

            const user = await User.findById(req.user.id).select('-password')
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save()
            res.json(post)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("SErver error")
        }
    })

// @route GET api/posts
// @desc Get all Posts
// access Private
router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ date: -1 })
        if (!post) return res.status(400).json({ msg: "No Post found" })
        res.json(post)
    } catch (err) {
        if (err.kind === "ObjectId") return res.status(400).json({ msg: "No Post found" })

        console.error(err.message)
        res.status(500).send("SErver Error")
    }
})

// @route GET api/posts:id
// @desc Get Post by id
// access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("SErver Error")
    }
})


// @route DELETE api/post/:id
// @desc DELETE a post
// access Private
router.delete(':id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(400).json({ msg: "No Post found" })
        if (post.user.toString() !== req.user.id) {
            res.status(401).json({ msg: "user not authorized" })
        }
        await post.remove()
        res.json({ msg: "Post Removed" })
    } catch (error) {
        if (err.kind === "ObjectId") return res.status(400).json({ msg: "No Post found" })
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})


// @route PUT api/posts/like/:id
// @desc Like a Post
// access Private
router.put('/like/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post Already Liked" })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save()
        res.json(post)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})


// @route PUT api/posts/unlike/:id
// @desc Like a Post
// access Private
router.put('/unlike/:id', [auth], async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length = 0) {
            return res.status(400).json({ msg: "Has not been liked" })
        }
        // get remove index
        const removeIndex = post.likes.map((like) => { return like.user.toString() }).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})


// @route POST api/posts/comment/:id
// @desc comment on a post
// access Private
router.post('/comment/:id',
    [auth,
        check('text', 'text is required').not().isEmpty()
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        try {

            const user = await User.findById(req.user.id).select('-password')
            const post = await User.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment, 1)
            await post.save()
            res.json(post.comments)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("SErver error")
        }
    })

// @route DELETE /api/posts/comment/:id/:commentid
// @desc DELETE comment
// access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await User.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        if (!comment)
            return res.status(404).json({ msg: "Comment doesnot exist" })
        if (comment.user.toString() !== req.user.id)
            return res.status(401).json({ msg: "User not authorized" })

        const removeIndex = post.comments.map((comment) => { return comment.user.toString() }).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.json(post.comments)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})
module.exports = router