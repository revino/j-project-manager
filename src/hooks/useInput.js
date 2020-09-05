import { useState, useCallback, useRef } from 'react';

export default function useSelect(options) {
  const {
    initialValue
  } = options;
  
  const [value, setValue] = useState(!!initialValue || '');
  const isValid = useRef(true);

  // change
  const onChange = useCallback(e => {
    const value = e.target.value || '';
    isValid.current = value !== "" && value !== null 

    setValue(value);

  }, []);

  return [value, onChange, isValid.current];

}