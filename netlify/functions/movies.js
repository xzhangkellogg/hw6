// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event.queryStringParameters)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  // console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  // Get the parameter for which 
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // Write if-else logic to generate difference result when user do and do not provide year&genre info
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please specify both year and genre in the url.` // a string of data
    }
  }
  else {
  // Create a new object that contains an array and the accumulator to be returned by the API
    let returnValue = {
      numResults: 0,
      movies: []
    }
    // Loop through the movies
    for (let i=0; i < moviesFromCsv.length; i++) {
      // Store each movie from the API in memory
      let movie = moviesFromCsv[i]
      // Determine whether a movie meets the criteria specified by the user AND contain both a run time and a genre
      if (movie.startYear == year && movie.genres.toLowerCase().includes(genre.toLowerCase()) && movie.genre !== `\\N` && movie.runtimeMinutes !== `\\N`) { 
        // Create a new movie object containing the pertinent fields
        let movieObject = {
          title: movie.primaryTitle,
          year: movie.startYear,
          genres: movie.genres
        }
        // Add (push) the movie object to the final Array
        returnValue.movies.push(movieObject)
        // Increment the counter of movies that match the criteria
        returnValue.numResults = returnValue.numResults + 1
      }
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue)
    }
  }
}