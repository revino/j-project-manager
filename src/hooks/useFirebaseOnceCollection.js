import { useEffect, useState } from 'react';
import { useIsEqualRef } from './useIsEqualRef';

export default function useFirebaseOnceCollection(refQuery) {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setData(null);
  };

  const {ref} = useIsEqualRef(refQuery, reset);
  
  useEffect(() =>{ 
    setIsLoading(true);
    if(!ref.current) {
      setData(undefined)
      return;
    };
    ref.current.get().then( el => {
      setData(el);
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      console.log("Error getting documents: ", error);
    });;
  }, [ref]);

  return {data, isLoading, error};

} 