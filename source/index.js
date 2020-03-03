const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()
//process.env.PORT 是heroku環境
const port = process.env.PORT || 3000

//with middleware function
//可以限制登入
// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled.')
//     }else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     if(req.method){
//         res.status(503).send('Site is under maintenance')
//     }
// })



app.use(express.json()) //Automatically Parse json to an object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on '+ port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async() => {
    // const task = await Task.findById('5e5deb9cac177cf98e486dfd')
    // await task.populate('author').execPopulate() // 可以找出author資訊
    // console.log(task.author)

    // const user = await User.findById('5e5dda114e235ff657d02fd6')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
  
}

main()