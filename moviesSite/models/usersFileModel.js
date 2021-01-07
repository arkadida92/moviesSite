const usersFileDal = require('../dals/usersFileDal')
const usersTransationsModel = require('../models/usersTransationsModel')


exports.getAllUsers = async () => {
    let resp = await usersFileDal.readFile()
    let users = resp.users
    //console.log(users)
    return users
}

exports.getUser = async id => {
    if (id === 0) return null
    let resp = await usersFileDal.readFile()
    let users = resp.users

    let user = users.filter(user => user.id === id)[0]
    console.log(user)
    return user
}

exports.getUserId = async (uname, password) => {
    let resp = await usersFileDal.readFile()
    let users = resp.users

    let user = users.filter(u => u.username === uname &&
        u.password === password)[0]

    return user.id
}

exports.deleteUser = async id => {
    if (id) {
        let resp = await usersFileDal.readFile()
        let users = resp.users

        let newUsers = users.filter(user => user.id !== id)
        await usersTransationsModel.deleteUser(id)
        usersFileDal.saveToFile({ lastId: resp.lastId, users: newUsers })
    }
}

exports.addNewUser = async (uname, password, numOfTransactions) => {
    let resp = await usersFileDal.readFile()
    let users = resp.users

    let newUser = {
        id: resp.lastId + 1,
        username: uname,
        password: password,
        createdAt: new Date(),
        numOfTransactions: numOfTransactions
    }

    await usersTransationsModel.addNewUser(resp.lastId + 1)

    usersFileDal.saveToFile({ lastId: resp.lastId + 1, users: [...users, newUser] })
}

exports.updateUser = async (id, password, numOfTransactions) => {
    let resp = await usersFileDal.readFile()
    let users = resp.users

    let user = users.filter(user => user.id === id)[0]
    let updatedUser = {
        id: user.id,
        username: user.username,
        password: password,
        createdAt: user.createdAt,
        numOfTransactions: numOfTransactions
    }

    users = users.filter(user => user.id !== id)
    users = [...users, updatedUser]
    users.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))

    usersFileDal.saveToFile({ lastId: resp.lastId, users })
}

exports.isUserGotLimit = async id => {
    let resp = await usersFileDal.readFile()
    let users = resp.users

    let user = users.filter(user => user.id === id)[0]

    let todayLimit = await usersTransationsModel.getTodayTransactions(id)

    let ans = todayLimit === user.numOfTransactions ? true : false
    return ans
}

exports.isUserExist = async (uname, password) => {
    let resp = await usersFileDal.readFile()
    let users = resp.users
    const ans = users.some(user =>
        user.username === uname &&
        user.password === password)
    return ans
}