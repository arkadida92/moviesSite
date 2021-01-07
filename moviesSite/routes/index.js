var express = require('express');
var router = express.Router();

const moviesFileModel = require('../models/moviesFileModel')
const usersFileModel = require('../models/usersFileModel')
const moviesApiandFileModel = require('../models/moviesApi&FileModel')
const usersTransationsModel = require('../models/usersTransationsModel')


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.authenticated) {
    res.redirect('/menu')
  }
  else {
    res.redirect('/login')
  }
  res.render('index', { title: 'Express' });
});

router.post('/postLoginData', async (req, res, next) => {
  let uname = req.body.uname
  let psw = req.body.psw
  let isAuthenticted = await usersFileModel.isUserExist(uname, psw)

  if (req.session.authenticated) {
    res.redirect('/menu')
  }
  else {
    if (isAuthenticted) {
      req.body.uname === 'Admin' ? req.session.isAdmin = true : req.session.isAdmin = false
      req.session.authenticated = true
      let id = await usersFileModel.getUserId(uname, psw)
      req.session.userId = id
      res.redirect('/menu')
    }
    else {
      res.redirect('/login')
    }
  }
})



router.get('/searchMovies', (req, res, next) => {
  if (req.session.authenticated) {
    let genres = ['Any',
      'Drama', 'Science-Fiction',
      'Thriller', 'Action',
      'Crime', 'Horror',
      'Romance', 'Adventure',
      'Espionage', 'Music',
      'Mystery', 'Supernatural',
      'Fantasy', 'Family',
      'Anime', 'Comedy',
      'History', 'Medical',
      'Legal', 'Western',
      'War', 'Sports'
    ]
    let languages = ['Any', 'English', 'Japanese', "Hebrew", "Russian"]
    res.render('searchMoviesPage', { genres, languages })
  }
  else {
    res.redirect('/login')
  }
})

router.get('/searchResults', async (req, res, next) => {
  if (req.session.authenticated) {
    let isGotLimit = await usersFileModel.isUserGotLimit(req.session.userId)
    if (isGotLimit && !req.session.isAdmin) {
      req.session.authenticated = false
      req.session.id = null
      req.session.reachedTran = true
      res.redirect('/login')
    }
    else {
      let mname = req.query.mname
      let language = req.query.language
      let genre = req.query.genre

      let movies = await moviesApiandFileModel.findMovies(mname, language, genre)
      movies = movies.map(async movie1 => {
        let sameGenresMovies = await moviesApiandFileModel.findMoviesByGenre(movie1.genres)
        sameGenresMovies = sameGenresMovies.filter(movie2 => movie2.name !== movie1.name)
        return ({ movie: movie1, sameGenresMovies })
      })
      let unPromisedMovies = []
      for (let i = 0; i < movies.length; i++) {
        unPromisedMovies.push(await movies[i])
      }
      await usersTransationsModel.increaseTransaction(req.session.userId)


      res.render('searchResultsPage', { moviesData: unPromisedMovies })
    }
  }
  else {
    res.redirect('/login')
  }
})

router.get('/createMovie', async (req, res, next) => {

  if (req.session.authenticated) {
    let genres = [
      'Drama', 'Science-Fiction',
      'Thriller', 'Action',
      'Crime', 'Horror',
      'Romance', 'Adventure',
      'Espionage', 'Music',
      'Mystery', 'Supernatural',
      'Fantasy', 'Family',
      'Anime', 'Comedy',
      'History', 'Medical',
      'Legal', 'Western',
      'War', 'Sports'
    ]
    let languages = ['English', 'Japanese', "Hebrew", "Russian"]

    res.render('createMoviePage', { genres, languages })
  }
  else {
    res.redirect('/login')
  }

})

router.get('/addingMovie', async (req, res, next) => {
  if (req.session.authenticated) {
    let isGotLimit = await usersFileModel.isUserGotLimit(req.session.userId)
    if (isGotLimit && !req.session.isAdmin) {
      req.session.authenticated = false
      req.session.id = null
      req.session.reachedTran = true
      res.redirect('/login')
    }
    else {
      let name = req.query.mname
      let language = req.query.language
      let genres = req.query.genres

      if (typeof genres === "string") genres = [req.query.genres]

      await moviesFileModel.addMovie(name, language, genres)
      await usersTransationsModel.increaseTransaction(req.session.userId)
      res.redirect('/menu')
    }

  }
  else {
    res.redirect('/login')
  }

})

router.get('/usersManagement', async (req, res, next) => {
  if (req.session.authenticated && req.session.isAdmin) {
    let users = await usersFileModel.getAllUsers()
    res.render('usersManagementPage', { users })
  }
  else {
    res.redirect('/login')
  }

})

router.get('/deleteUser/:id', async (req, res, next) => {
  if (req.session.authenticated && req.session.isAdmin) {
    await usersFileModel.deleteUser(parseInt(req.params.id))
    res.redirect('/usersManagement')
  }
  else {
    res.redirect('/login')
  }

})

router.get('/userData/:id', async (req, res, next) => {
  if (req.session.authenticated && req.session.isAdmin) {
    let user = await usersFileModel.getUser(parseInt(req.params.id))
    res.render('userDataPage', { user })
  }
  else {
    res.redirect('/login')
  }

})

router.post('/updateUser', async (req, res, next) => {
  if (req.session.authenticated && req.session.isAdmin) {
    await usersFileModel.updateUser(
      parseInt(req.body.id),
      req.body.psw,
      parseInt(req.body.transactions))
    res.redirect('/usersManagement')
  }
  else {
    res.redirect('/login')
  }

})

router.post('/createUser', async (req, res, next) => {
  if (req.session.authenticated && req.session.isAdmin) {
    await usersFileModel.addNewUser(
      req.body.uname,
      req.body.psw,
      parseInt(req.body.transactions))
    res.redirect('/usersManagement')
  }
  else {
    res.redirect('/login')
  }

})

router.get('/movieData/:id', async (req, res, next) => {
  if (req.session.authenticated) {
    let isGotLimit = await usersFileModel.isUserGotLimit(req.session.userId)
    if (isGotLimit && !req.session.isAdmin) {
      req.session.authenticated = false
      req.session.id = null
      req.session.reachedTran = true
      res.redirect('/login')
    }
    else {
      let movie = await moviesApiandFileModel.getMovie(parseInt(req.params.id))
      await usersTransationsModel.increaseTransaction(req.session.userId)
      res.render('movieDataPage', { movie })
    }

  }
  else {
    res.redirect('/login')
  }
})

module.exports = router;
