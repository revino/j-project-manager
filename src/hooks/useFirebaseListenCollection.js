import { useEffect, useState } from 'react';

export default function useFirebaseListenCollection(refQuery) {

  const [data, setData] = useState(null);
  const [ref, setRef] = useState(refQuery);
  const [error, setError] = useState(null);

  useEffect(() =>{ 

    if(!ref) {
      setData(undefined)
      return;
    };
    const unsubscribe  = ref.onSnapshot((el)=>{
      setData(el);
    },setError);

    return () =>{
      unsubscribe();
    }
  }, [ref]);

  return {data, error, setRef};

} 