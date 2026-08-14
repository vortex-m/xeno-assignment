import { DateFormatDef, ValidationResult } from "./types";
import { DATETIME_RE } from "./constants";

export function validatePhone(
  val: string | undefined,
  countryCode: string,
  expectedDigits: number
): ValidationResult {
  if (!val) return { ok: false, msg: "Phone missing" };
  const digits = val.replace(/\D/g, "");
  if (digits.length !== expectedDigits) {
    return {
      ok: false,
      msg: `Phone must be ${expectedDigits} digits for ${countryCode || "IN"} (got ${digits.length})`,
    };
  }
  return { ok: true };
}

export function validateDate(
  val: string | undefined,
  activeFormats: DateFormatDef[]
): ValidationResult {
  if (!val) return { ok: false, msg: "Date missing" };
  if (DATETIME_RE.test(val)) return { ok: true };
  for (const f of activeFormats) {
    if (f.re.test(val)) return { ok: true };
  }
  return {
    ok: false,
    msg: `Date format not recognized: "${val}". Expected one of: ${activeFormats
      .map((f) => f.label)
      .join(", ")}`,
  };
}

export function validateAmount(val: string | undefined): ValidationResult {
  if (val === "" || val === undefined) return { ok: false, msg: "Amount missing" };
  if (isNaN(+val) || +val < 0) return { ok: false, msg: `Invalid amount: "${val}"` };
  return { ok: true };
}

export function validateId(val: string | undefined): ValidationResult {
  if (!val) return { ok: false, msg: "ID missing" };
  return { ok: true };
}

export function validateRequiredText(
  val: string | undefined,
  fieldLabel: string
): ValidationResult {
  if (!val) return { ok: false, msg: `${fieldLabel} is empty` };
  return { ok: true };
}
