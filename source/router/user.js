const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const router = new express.Router()
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')


//Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body) //req.body是Http Request的body內容
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }catch(e) {
        res.status(400).send(e) //將status設定為相對應的狀態(400)
    }
})

//User login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    }catch(e) {
        res.status(400).send('Unable')
        }
})

//User logout
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

//Logout allUsers
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

//Read all users
// router.get('/users', auth,  async (req, res) => {
//    try{
//     const users = await User.find({})
//     res.send(users)
//    }catch(e){
//     res.status(500).send(e)
//    }
// })

//Read user profile
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})


// //Read user by ID
// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         //mongoose 就算沒找到相對應id 也部會是error，因此要反向思考
//         if(!user){  
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

//Update user
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "email", "password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates! '})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update] )
        await req.user.save()

        res.send(req.user)
    } catch(e){
        res.status(400).send(e)
    }

})

//Delete user(only when login)
router.delete('/users/me', auth,  async(req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
    
})

//upload files
const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload an image '))
        }
        callback(undefined, true)
    }
})

//User create avatar
//Use sharp to resize images
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})


//User delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Access the image for a user by ID
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
        throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e) {
        res.status(404).send()
    }
})

module.exports = router