const jsonfile = require('jsonfile')

exports.saveToFile = (obj) => {
    jsonfile.writeFile(__dirname + '/../data/NewMovies.json', obj, err => {
        err ? console.log(err) : console.log('Saved!')
    })
}

exports.readFile = () => {
    return new Promise((res, rej) => {
        jsonfile.readFile(__dirname + '/../data/NewMovies.json', (err, data) => {
            err ? rej(err) : res(data)
        })
    })
}