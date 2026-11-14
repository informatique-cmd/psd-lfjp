import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { parseLocaleNumber } from '@/lib/pageDataSanitizer';

export interface LocaleNumberInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value: number | string | undefined;
  onValueChange: (nextValue: number) => void;
  min?: number;
  max?: number;
  allowEmptyToUndefined?: boolean;
  onEmptyChange?: () => void;
}

/**
 * Decimal input accepting both French comma ("17,2") and dot ("17.2") seamlessly,
 * emitting normalized finite JS numbers in real time for synchronized chart updates.
 */
export const LocaleNumberInput: React.FC<LocaleNumberInputProps> = ({
  value,
  onValueChange,
  min,
  max,
  allowEmptyToUndefined = false,
  onEmptyChange,
  className,
  onBlur,
  onFocus,
  ...rest
}) => {
  const formatNum = (val: number | string | undefined) => {
    if (val === undefined || val === null) return '';
    return String(val);
  };

  const [text, setText] = useState<string>(() => formatNum(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setText(formatNum(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);

    if (raw.trim() === '') {
      if (allowEmptyToUndefined && onEmptyChange) {
        onEmptyChange();
      } else {
        onValueChange(0);
      }
      return;
    }

    // Do not emit premature parse if trailing separator only, wait for next digit or blur
    const trimmed = raw.trim();
    if (trimmed.endsWith(',') || trimmed.endsWith('.')) {
      const partial = parseLocaleNumber(trimmed.slice(0, -1));
      if (partial !== null) {
        const clamped = clampNumber(partial, min, max);
        onValueChange(clamped);
      }
      return;
    }

    const parsed = parseLocaleNumber(trimmed);
    if (parsed !== null) {
      onValueChange(clampNumber(parsed, min, max));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const trimmed = text.trim();
    if (trimmed === '' && allowEmptyToUndefined) {
      setText('');
      if (onEmptyChange) onEmptyChange();
    } else {
      const parsed = parseLocaleNumber(trimmed);
      const finalVal = clampNumber(parsed !== null ? parsed : (parseLocaleNumber(value) ?? 0), min, max);
      setText(String(finalVal));
      onValueChange(finalVal);
    }
    onBlur?.(e);
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={handleChange}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={handleBlur}
      className={className}
      {...rest}
    />
  );
};

function clampNumber(val: number, min?: number, max?: number): number {
  let next = val;
  if (typeof min === 'number' && Number.isFinite(min)) {
    next = Math.max(min, next);
  }
  if (typeof max === 'number' && Number.isFinite(max)) {
    next = Math.min(max, next);
  }
  return next;
}
