const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//Create task
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })


    try{
        await task.save()
        res.status(201).send(task)
    }catch{
        res.status(400).send(e)
    }
})

//Read tasks
//GET/tasks?completed=false
//GET/tasks?limit=10?skip=0(pagination)
//GET/tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1

    }

    try{
        //const tasks = await Task.find({ completed: true, author: req.user._id}).sort({ ... })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

//Read task by ID
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, author: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//Update Tasks By ID
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body) //Convert req.body from an object to array properties
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates'})
    }
    try{
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id})  
        
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete task By ID
router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router