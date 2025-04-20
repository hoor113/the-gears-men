import { DefaultOptionType } from './use-tree-data';

export const recursiveFindParent = (
  array: DefaultOptionType[],
  value: string,
): DefaultOptionType | null => {
  for (const item of array) {
    if (item.value === value) {
      return item;
    } else if (item.children) {
      const parent = recursiveFindParent(item.children, value);
      if (parent) {
        return item;
      }
    }
  }
  return null;
};

export const getParents = (
  array: DefaultOptionType[],
  value: string,
): DefaultOptionType[] => {
  const parents = [];
  let parent = recursiveFindParent(array, value);
  while (parent) {
    parents.push(parent);
    parent = parent.children?.length
      ? recursiveFindParent(parent.children, value)
      : null;
  }
  return parents;
};

export const recursiveChildren = (
  item: DefaultOptionType,
  updateState?: boolean,
) => {
  let newSelected: Record<string, any> = {};
  item.children?.forEach((c) => {
    newSelected[c.value] = updateState;
    newSelected = {
      ...newSelected,
      ...recursiveChildren(c, updateState),
    };
  });
  return newSelected;
};

// const flattenObject = (obj: { [x: string]: any }, prefix = '') =>
//   Object.keys(obj).reduce((acc, k) => {
//     const pre = prefix.length ? prefix + '.' : '';
//     if (typeof obj[k] === 'object')
//       Object.assign(acc, flattenObject(obj[k], pre + k));
//     else acc[pre + k] = obj[k];
//     return acc;
//   }, {} as any);
