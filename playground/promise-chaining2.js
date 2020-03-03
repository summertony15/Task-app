require('../source/db/mongoose')
const Task = require('../source/models/task')

//5e54ab77d0c1985fb378e4bd

// Task.findByIdAndDelete('5e54c6f0b24328651064c8b0', { completed: true}).then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed:false })
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })


const deletetaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deletetaskAndCount("5e54ab77d0c1985fb378e4bd").then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})