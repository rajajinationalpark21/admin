import { useEffect } from "react";

const MARKS = { b: "**", i: "*" };

// Text inputs whose selection can be read (email, number and password inputs cannot).
const isMarkable = (el) =>
  el instanceof HTMLTextAreaElement ||
  (el instanceof HTMLInputElement && ["text", "search", "url", ""].includes(el.type));

/** Sets an input's value so React's onChange fires, as if the admin had typed it. */
function setTypedValue(el, value) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// "*" also ends "**", so italic only counts a single star as its mark.
const endsWithMark = (text, mark) => text.endsWith(mark) && (mark === "**" || !text.endsWith("**") || text.endsWith("***"));
const startsWithMark = (text, mark) => text.startsWith(mark) && (mark === "**" || !text.startsWith("**") || text.startsWith("***"));

/** Wraps the selection in the mark, or removes the mark if the selection already has it. */
export function toggleMark(value, start, end, mark) {
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);
  const m = mark.length;

  if (selected.length > 2 * m && startsWithMark(selected, mark) && endsWithMark(selected, mark)) {
    const inner = selected.slice(m, -m);
    return { value: before + inner + after, start, end: start + inner.length };
  }
  if (endsWithMark(before, mark) && startsWithMark(after, mark)) {
    return { value: before.slice(0, -m) + selected + after.slice(m), start: start - m, end: end - m };
  }
  // Keep surrounding spaces outside the mark: "**word** " rather than "**word **".
  const lead = selected.match(/^\s*/)[0];
  const trail = selected.match(/\s*$/)[0];
  const core = selected.trim();
  const from = start + lead.length + m;
  return { value: before + lead + mark + core + mark + trail + after, start: from, end: from + core.length };
}

/**
 * Ctrl+B / Ctrl+I (Cmd on a Mac) in any admin text field wraps the selected
 * words in **bold** or *italic*, which the website shows as bold or italic.
 */
export default function useTextMarkShortcuts() {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey) return;
      const mark = MARKS[event.key.toLowerCase()];
      const el = event.target;
      if (!mark || !isMarkable(el) || el.readOnly || el.disabled) return;
      const { selectionStart: start, selectionEnd: end } = el;
      if (start === null || start === end || !el.value.slice(start, end).trim()) return;

      event.preventDefault();
      const next = toggleMark(el.value, start, end, mark);
      setTypedValue(el, next.value);
      // Keep the words selected, so a second Ctrl+B / Ctrl+I removes the mark.
      // Set now and again after React has re-rendered the controlled field.
      const select = () => document.activeElement === el && el.setSelectionRange(next.start, next.end);
      select();
      setTimeout(select, 0);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
