const dal = require('../dals/newMoviesFileDal')

exports.getMovies = async () => {
    let resp = await dal.readFile()
    return resp.movies
}

exports.addMovie = async (name, language, genres) => {
    let resp = await dal.readFile()
    let allMovies = resp.movies
    let newId = resp.lastId + 1
    let newMovie = { id: newId, name, language, genres, image: { medium: "", original: "" } }

    allMovies = [...allMovies, newMovie]
    let newMoviesFile = { lastId: newId, movies: allMovies }

    dal.saveToFile(newMoviesFile)
}

exports.findMovies = async (name, language, genre) => {
    let resp = await dal.readFile()
    let allMovies = resp.movies

    let filteredMovies = allMovies.filter(movie =>
        movie.name.toLowerCase().includes(name.toLowerCase()) &&
            ((language === 'Any' || movie.language === language) ? true : false) &&
            (genre === 'Any' || movie.genres.some(mgenre => mgenre === genre)) ? true : false)

    return filteredMovies
}

exports.findMoviesByGenre = async genres => {
    let resp = await dal.readFile()
    let allMovies = resp.movies

    let filteredMovies = allMovies.filter(movie => movie.genres.filter(g => genres.includes(g)).length === genres.length)

    return filteredMovies
}