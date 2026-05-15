import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  /** Allow decimal point. Default false (integers only). */
  allowDecimal?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * Number input that lets the user type freely (clearing, typing "6." on the
 * way to "6.84", typing "0" before "0.5", etc.). Holds the in-progress text
 * locally and only commits a parsed number to the parent when the typed text
 * is a complete, valid number ≥ `min`. Reverts to the prop value on blur if
 * the field is left in an invalid state.
 */
export function NumberInput({
  value, onChange, min = 0, allowDecimal = false,
  className, placeholder, ariaLabel,
}: Props) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  const re = allowDecimal ? /^$|^\d*\.?\d*$/ : /^$|^\d*$/;

  const tryCommit = (raw: string) => {
    if (raw === '' || raw === '.') return false;
    const n = parseFloat(raw);
    if (Number.isNaN(n) || n < min) return false;
    // Avoid committing intermediate forms like "6." (parseFloat → 6) or "01"
    if (String(n) !== raw) return false;
    onChange(n);
    return true;
  };

  return (
    <input
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      value={text}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        const raw = text.trim();
        const n = parseFloat(raw);
        if (raw === '' || Number.isNaN(n) || n < min) {
          setText(String(value));
        } else {
          onChange(n);
          setText(String(n));
        }
      }}
      onChange={e => {
        const v = e.target.value;
        if (!re.test(v)) return;
        setText(v);
        tryCommit(v);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className={className}
    />
  );
}
