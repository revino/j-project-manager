import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { useSnackbar } from 'notistack';


export default function useFirebaseListenCollection(refQuery) {
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();

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
      enqueueSnackbar("갱신 성공", { variant: 'success' } );
    },(e)=>{
      console.log(e);
      setError(e);
      enqueueSnackbar(e.code, { variant: 'error'});
      history.push('/login');
    });

    return () =>{
      unsubscribe();
    }
  }, [ref,history,enqueueSnackbar]);

  return {data, error, setRef};

} 