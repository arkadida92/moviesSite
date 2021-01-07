const axios = require('axios')

exports.getMovies = () => {
    return axios.get('https://api.tvmaze.com/shows')
}