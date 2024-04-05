import { useState, useEffect } from "react";
 
type SetValueFunction<T> = React.Dispatch<React.SetStateAction<T>>;

const useLocalStorage = <T>(key: string, defaultValue: T): [T, SetValueFunction<T>] => {
  const [data, setData] = useState<T>(() => {
    let currentValue: unknown;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue as T;
  });

  useEffect(() => {
    console.log('localStorage.setItem', data)
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData];
};

export default useLocalStorage;