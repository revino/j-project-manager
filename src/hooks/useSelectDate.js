import { useState,useCallback } from 'react';

export default function useSelect(defaultData) {
  const [value, setValue] = useState(defaultData);

  // change
  const onChange = useCallback((date) => {
    setValue(date);
  },[]);

  return [value, onChange];

}