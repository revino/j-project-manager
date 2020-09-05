import { useState, useCallback } from 'react';

export default function useSelect(defaultData,type) {
  const [value, setValue] = useState(defaultData);

  // change
  const onChange = useCallback(e => {
    let value;
    if(type === "checkbox"){
      value = e.target.checked;
    }
    else{
      value = e.target.value;
    }

    setValue(value);

  }, [type]);

  return [value, onChange];

}