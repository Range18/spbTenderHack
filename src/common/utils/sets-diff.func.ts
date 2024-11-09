export function difference(s1: Set<number>, s2: Set<number>) {
  if (!(s1 instanceof Set) || !(s2 instanceof Set)) {
    console.log('The given objects are not of type MySet');
    return null;
  }
  const newSet = new Set<number>();
  s1.forEach((elem) => newSet.add(elem));
  s2.forEach((elem) => newSet.delete(elem));
  return newSet;
}
