const dal = require('../dals/moviesDal')

exports.getAllMovies = async () => {
    let resp = await dal.getMovies()
    let allMovies = resp.data
    //console.log(allMovies)
    return allMovies
}

exports.getAllGenres = async () => {
    let resp = await dal.getMovies()
    let movies = resp.data

    let genresArr = movies.map(movie => movie.genres)
    let genres = [].concat.apply([], genresArr)
    let uniqueGenres = genres.filter((value, index, self) => self.indexOf(value) === index)

    //console.log(uniqueGenres)
    return uniqueGenres
}

exports.getAllLanguages = async () => {
    let resp = await dal.getMovies()
    let movies = resp.data

    let languages = movies.map(movie => movie.language)
    languages = languages.filter((value, index, self) => self.indexOf(value) === index)
    //console.log(languages)
    return languages
}

exports.findMovies = async (name, language, genre) => {
    let resp = await dal.getMovies()
    let allMovies = resp.data

    let filteredMovies = allMovies.filter(movie =>
        movie.name.toLowerCase().includes(name.toLowerCase()) &&
            ((language === 'Any' || movie.language === language) ? true : false) &&
            (genre === 'Any' || movie.genres.some(mgenre => mgenre === genre)) ? true : false)

    return filteredMovies
}

exports.findMoviesByGenre = async genres => {
    let resp = await dal.getMovies()
    let allMovies = resp.data

    let filteredMovies = allMovies.filter(movie => movie.genres.filter(g => genres.includes(g)).length === genres.length)

    return filteredMovies
}