import {useState,useEffect} from 'react'

export function useMovies(query,handleCloseMovie){
    const [movies, setMovies] = useState([]);
    // const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState('');

    useEffect( () => {

        const controller = new AbortController()
        async function fetchData(){
   
   
         try{
         setIsLoading(true)
         setError('')
   
         const res = await fetch(`https://www.omdbapi.com/?apikey=703af998&s=${query}`,{signal:controller.signal})
   
         if(!res.ok)
           throw new Error("Can't fetch movies");
   
         const data = await res.json()
   
         if(data.Response === 'False')
           throw new Error("Movie not found");
   
         setMovies(data.Search)
         setError('')
         }
   
         catch(err){
           console.log(err.message);
   
           if(err.name !== "AbortError")
           setError(err.message)
   
         }
   
         finally{
           setIsLoading(false)
         }
        }
   
        if(query.length < 3){
           setMovies([])
           setError('')
           handleCloseMovie()
           return
        }
   
        handleCloseMovie()
        fetchData()
   
        return function(){
           controller.abort()
        }
     },[query])

     return {movies,isLoading,error}
}
