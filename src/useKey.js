import { useEffect } from "react";

export function useKey(eventType,keycode,onClose){
    useEffect(() => {
        function callback(e){
          if(e.code === keycode)
            onClose();
        }
    
        document.addEventListener(eventType,callback)
    
        return function(){
          document.removeEventListener(eventType,callback)
        }
      },[onClose,keycode,eventType])
}