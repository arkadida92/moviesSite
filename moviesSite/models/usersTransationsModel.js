const usersTransactionsDal = require('../dals/usersTransactionsDal')

exports.addNewUser = async (id) => {
    let resp = await usersTransactionsDal.readFile()
    let users = resp.users

    let newUser = { userId: id, todayTransactions: 0 }
    console.log(newUser)
    usersTransactionsDal.saveToFile({ users: [...users, newUser] })
}

exports.increaseTransaction = async (id) => {
    let resp = await usersTransactionsDal.readFile()
    let users = resp.users

    let user = users.filter(user => user.userId === id)[0]

    let updatedUser = { userId: id, todayTransactions: user.todayTransactions + 1 }

    users = users.filter(user => user.userId !== id)
    users = [...users, updatedUser]
    users.sort((a, b) => (a.userId > b.userId) ? 1 : ((b.userId > a.userId) ? -1 : 0))

    usersTransactionsDal.saveToFile({ users: users })
}

exports.deleteUser = async id => {
    let resp = await usersTransactionsDal.readFile()
    let users = resp.users

    let newUsers = users.filter(user => user.userId !== id)

    usersTransactionsDal.saveToFile({ users: newUsers })
}

exports.getTodayTransactions = async id => {
    let resp = await usersTransactionsDal.readFile()
    let users = resp.users

    let user = users.filter(u => u.userId === id)[0]

    return user.todayTransactions
}