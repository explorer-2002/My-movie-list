import { useEffect, useRef, useState } from "react";
import './index.css'
import StarRating from './StarRating'
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    title: "Inception",
    Year: "2010",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    title: "Back to the Future",
    Year: "1985",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


function Logo(){
    return (
      <div className="logo">
        <span role="img">🍿</span>
        <h1>My movie list</h1>
      </div>
    )
}

function NumResults({movies}){
    return (
      <p className="num-results">
      Found <strong>{movies.length}</strong> results
      </p>
    );
}

function Navbar({children}){
  

    return  (
    <nav className="nav-bar">
      {children}
   
    </nav>
    );
}

function Search({query,setQuery}){
  
    const inputEle = useRef(null)

    useEffect(() => {

      document.addEventListener('keydown',(e) => {

        if(document.activeElement === inputEle.current)
          return;

        if(e.code === 'Enter'){
          inputEle.current.focus()
          setQuery('')
        }
      })
     
    },[setQuery])

    return (
      <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)} ref={inputEle}
    />
    )
}

function Movie({movie,setSelectedId}){
    return (
      <li onClick={() => setSelectedId((selectedId) => selectedId === movie.imdbID ? null:movie.imdbID)} >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
    )
}



function MovieList({movies,setSelectedId}){
 

    return (
      <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} setSelectedId={setSelectedId} key={movie.imdbID}  />
      ))}
    </ul>
    )
}

function Box({children}){
  
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && 
       children
    }
  </div>

  )
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie?.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie?.userRating));
  const avgRuntime = average(watched.map((movie) => movie?.runtime));

  return (
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime.toFixed(2)} min</span>
      </p>
    </div>
  </div>

  )
}

function WatchedMovie({movie,onDeleteWatched}){
  return <li>
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
                <div>
                  <p>
                    <span>⭐️</span>
                    <span>{movie?.imdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{movie?.userRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{movie?.runtime} min</span>
                  </p>

                  <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
                </div>
              </li>
}

function WatchedList({watched,onDeleteWatched}){
  return (
    <ul className="list">
            {watched.map((movie) => (
              <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
            ))}
          </ul>
  )
}

// function WatchedBox(){
//   // const [watched, setWatched] = useState(tempWatchedData);
  
//   const [isOpen2, setIsOpen2] = useState(true);

  

//     return (
//       <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched}/>
//         </>
//       )}
//     </div>
//     )
// }

function Main({children}){
  
  
  return (
    <main className="main">
        {children}
      </main>
  )
}

function ErrorMessage({message}){
  return (
    <p className="error">
      <span>⚠</span> {message}
    </p>
  )
}

function SelectedMovie({selectedId,onClose,onAddWatched,watched}){
  const[movie,setMovie] = useState({})
  const {Title:title,Year:year,Poster:poster,Runtime:runtime,imdbRating,Plot:plot,Released:released,Actors:actors,Director:director,Genre:genre} = movie;
  const [loading,setLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  
  const countRef = useRef(0);

  useEffect(() => {
    if(userRating)
    countRef.current++
  },[userRating])

  const isWatched = watched.map((prevMovie) => prevMovie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((prevWatched) => prevWatched.imdbID === selectedId)?.userRating;

  function handleAdd(){
    const newWatchedMovie = {
      imdbID:selectedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime:Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions:countRef.current
    }

    onAddWatched(newWatchedMovie)
    onClose()
  }

  useKey('keydown','Escape',onClose);

  useEffect(() => {
    async function getMovieDetails(){
        setLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=703af998&i=${selectedId}`)
        const data = await res.json()
        setLoading(false);
        setMovie(data)

    }

    getMovieDetails()
  },[selectedId])

  useEffect(() => {
    if(!title)return;

    document.title = `Movie | ${title}`

    return function(){
      document.title = 'My movie list'
    }

  },[title])

  return (
    <div className="details">
      {loading ?  <Loader /> :
      <>
      <header>
      <button onClick={onClose} className="btn-back">&larr;</button>

      <img src={poster} alt={`Poster of ${title}`} />

      <div className="details-overview">
          <h2>{title}</h2>

          <p>
            released &bull; {runtime}
          </p>

          <p>{genre}</p>
          <p><span>⭐</span>{imdbRating}</p>
      </div>

      </header>

      <section className="">
        { !isWatched ? 
        <>
        <StarRating maxrating={10} size={24} key={selectedId} onSetRating={setUserRating} />
        { userRating > 0 &&
        <button className="btn-add" onClick={handleAdd}>
                      + Add to list
        </button>
        }
        </>  : <p>You aleady rated this movie {watchedUserRating} 🌟</p>
      }
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      </> }
    </div>
  )
}

export default function App() {
 
  const [query, setQuery] = useState('');
  const [selectedId,setSelectedId] = useState('')

  // const [watched, setWatched] = useState(function(){
  //   const stored = localStorage.getItem('watched')
  //   if(stored)return JSON.parse(stored)

  //   return []
  // });

  const [watched,setWatched] = useLocalStorageState([],'watched');

  const tempQuery = 'interstellar';

  function handleCloseMovie(){
    setSelectedId(null)
  }

  function handleAddWatched(movie){
    
    setWatched((watched) =>  [...watched,movie])
    console.log(movie)
    
  }

  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  const {movies,isLoading,error} = useMovies(query,handleCloseMovie)

  
 

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query}  setQuery={setQuery} />

        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader /> }
          {!isLoading && !error && <MovieList movies={movies} setSelectedId={setSelectedId}/>}
          {error && <ErrorMessage message={error}/>}

        </Box>

        <Box>
          {selectedId ? <SelectedMovie selectedId={selectedId} onClose={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} /> :
          <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched} />
          </>
          }
        </Box>
      </Main>
    </>
  );
}


function Loader(){
  return (
    <p className="loader">Loading...</p>
  )
}