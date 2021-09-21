function updateAt<T extends any>(arr: T[], idx: number, fn: (param: T) => T) {
  const newValue = fn(arr[idx]);
  return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1, arr.length)];
}

export { updateAt };
