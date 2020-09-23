import { useEffect, useState } from 'react';
import { useIsEqualRef } from './useIsEqualRef';

import { useHistory } from "react-router-dom";

import { useSnackbar } from 'notistack';

export default function useFirebaseOnceCollection(refQuery) {
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();


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
      enqueueSnackbar("갱신 성공", { variant: 'success' } );
      setIsLoading(false);
    }).catch((e) => {
      console.log(e);
      setError(e);
      enqueueSnackbar(e.code, { variant: 'error'});
      history.push('/login');

    });
  }, [ref,history,enqueueSnackbar]);

  return {data, isLoading, error};

} 