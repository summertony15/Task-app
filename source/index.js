const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()
//process.env.PORT 是heroku環境
const port = process.env.PORT

app.use(express.json()) //Automatically Parse json to an object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on '+ port)
})
