
interface MyObject {
  [key: string]: any;
}
export function compareObjects(obj1: MyObject, obj2: MyObject) {

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if number of keys match
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate through keys and compare values
  for (const key of keys1) {
    // If the value of a key in obj1 is an object itself, recursively compare
    if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {

      if (!compareObjects(obj1[key] as MyObject, obj2[key] as MyObject))  return false;
        
    } else {
      // Compare values directly
      if (obj1[key] !== obj2[key]) {
          return false;
      }
    }
  }

  // If all key-value pairs are equal, return true
  return true;
}