export const wrapFunction =
  (fn: Function) =>
  (...args: any[]) =>
    fn(...args).catch(args[2]);
