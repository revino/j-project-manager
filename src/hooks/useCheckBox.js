import { useState, useCallback } from 'react';

export default function useCheckBox(defaultData) {
  const [value, setValue] = useState(defaultData);

  // change
  const onChange = useCallback(e => {
    const {value} = e.target;
    setValue(value);
  }, []);

  return [value, onChange];

}