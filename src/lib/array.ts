export function exchange<T>(list: T[], fromIndex: number, toIndex: number) {
  const result = list.slice();
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function insertAfter<T>(list: T[], prevItem: T, newItem: T) {
  const prevIndex = list.indexOf(prevItem);
  const curr = list.slice();
  if (prevIndex === -1) return curr;
  curr.splice(prevIndex + 1, 0, newItem);
  return curr;
}
