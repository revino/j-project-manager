import { useEffect, useRef } from 'react';


export const useComparatorRef = (value,isEqual,onChange) => {
  const ref = useRef(value);
  const changeValue = (value)=>{
    ref.current = value;
  }
  useEffect(() => {

    if (!isEqual(value, ref.current)) {

      ref.current = value;
      if (onChange) {
        onChange();
      }
    }
  });
  return {ref, changeValue};
};

export const useIsEqualRef = (value,onChange) => {
  
  const isEqual = (v1,v2) => {
    const bothNull = !v1 && !v2;
    const equal = !!v1 && !!v2 && v1.isEqual(v2);
    return bothNull || equal;
  }
  return useComparatorRef(value, isEqual, onChange);
};