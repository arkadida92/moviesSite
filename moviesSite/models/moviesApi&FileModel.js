const moviesFileModel = require('../models/moviesFileModel')
const moviesModel = require('../models/moviesModel');

exports.findMovies = async (name, language, genre) => {
    let fileMovies = await moviesFileModel.findMovies(name, language, genre)
    let apiMovies = await moviesModel.findMovies(name, language, genre)

    let filteredMovies = apiMovies.concat(fileMovies)

    filteredMovies = filteredMovies.map(movie =>
        ({ id: movie.id, name: movie.name, genres: movie.genres, language: movie.language, image: movie.image.medium }))

    //console.log(filteredMovies)
    return filteredMovies
}

exports.findMoviesByGenre = async genres => {
    let fileMovies = await moviesFileModel.findMoviesByGenre(genres)
    let apiMovies = await moviesModel.findMoviesByGenre(genres)

    let filteredMovies = apiMovies.concat(fileMovies)

    filteredMovies = filteredMovies.map(movie =>
        ({ id: movie.id, name: movie.name, genres: movie.genres, language: movie.language, image: movie.image.medium }))

    //console.log(filteredMovies)
    return filteredMovies
}

exports.getMovie = async id => {
    let fileMovies = await moviesFileModel.getMovies()
    let apiMovies = await moviesModel.getAllMovies()

    let allMovies = apiMovies.concat(fileMovies)

    let movie = allMovies.filter(movie => movie.id === id)

    if (movie.length > 0) {
        movie = movie[0]
        return ({ id: movie.id, name: movie.name, genres: movie.genres, language: movie.language, image: movie.image.medium })
    }

    return null
}