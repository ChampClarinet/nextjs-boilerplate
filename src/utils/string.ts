/** Format a number with comma separators and optional two-decimal padding. */
export const addCommaInNumber = (value: number | string, options?: AddCommaOptions): string => {
  const raw = typeof value === "number" ? String(value) : value;
  if (raw.length <= 3) {
    if (options?.decimal) {
      const dotIndex = raw.indexOf(".");
      if (dotIndex === -1) {
        return `${raw}.00`;
      }
      const frac = raw.slice(dotIndex + 1);
      const padded = frac.length >= 2 ? frac.slice(0, 2) : frac.padEnd(2, "0");
      return `${raw.slice(0, dotIndex)}.${padded}`;
    }
    return raw;
  }

  const hasSign = raw[0] === "-";
  const start = hasSign ? 1 : 0;
  const dotIndex = raw.indexOf(".", start);
  const intPart = dotIndex === -1 ? raw.slice(start) : raw.slice(start, dotIndex);
  const fracPart = dotIndex === -1 ? "" : raw.slice(dotIndex);

  if (intPart.length <= 3) {
    if (options?.decimal) {
      const frac = dotIndex === -1 ? "" : raw.slice(dotIndex + 1);
      const padded = frac.length >= 2 ? frac.slice(0, 2) : frac.padEnd(2, "0");
      return (hasSign ? "-" : "") + intPart + `.${padded}`;
    }
    return (hasSign ? "-" : "") + intPart + fracPart;
  }

  const firstGroupLength = intPart.length % 3 || 3;
  let formatted = intPart.slice(0, firstGroupLength);
  for (let i = firstGroupLength; i < intPart.length; i += 3) {
    formatted += `,${intPart.slice(i, i + 3)}`;
  }

  if (options?.decimal) {
    const frac = dotIndex === -1 ? "" : raw.slice(dotIndex + 1);
    const padded = frac.length >= 2 ? frac.slice(0, 2) : frac.padEnd(2, "0");
    return (hasSign ? "-" : "") + formatted + `.${padded}`;
  }

  return (hasSign ? "-" : "") + formatted + fracPart;
};

/** Options for number formatting. */
type AddCommaOptions = {
  decimal?: boolean;
};
