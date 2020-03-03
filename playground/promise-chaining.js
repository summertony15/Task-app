require('../source/db/mongoose')
const User = require('../source/models/user')

//5e54c2e1dbf9a864222d1456

// User.findByIdAndUpdate('5e54c64063e50a64d569e279', { age: 1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age:1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount("5e54c64063e50a64d569e279", 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})