// Small immutable helpers for editing ordered lists (blocks, rows, items).

export const updateAt = (list, index, value) => list.map((item, i) => (i === index ? value : item));

export const removeAt = (list, index) => list.filter((_, i) => i !== index);

export const insertAt = (list, index, value) => [...list.slice(0, index), value, ...list.slice(index)];

/** Moves the item at `index` by `offset` places (-1 up, +1 down); out-of-range moves do nothing. */
export function moveItem(list, index, offset) {
  const target = index + offset;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Text area value for a list of strings, one per line. */
export const linesToText = (items) => (items || []).join("\n");
export const textToLines = (text) => text.split("\n").map((line) => line.trim()).filter(Boolean);
