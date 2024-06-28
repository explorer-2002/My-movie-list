import { useState,useEffect } from "react";

export function useLocalStorageState(initialState,key){
    const [value, setValue] = useState(function(){
        const stored = localStorage.getItem(key)
        if(stored)return JSON.parse(stored)
    
        return initialState
      });

      useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
      },[key,value])
    
      return [value,setValue]
}