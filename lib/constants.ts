import { Country, DateFormatDef, ExpectedField } from "./types";

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", digits: 10 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "US", name: "USA", flag: "🇺🇸", digits: 10 },
  { code: "GB", name: "UK", flag: "🇬🇧", digits: 11 },
  { code: "AE", name: "UAE", flag: "🇦🇪", digits: 9 },
  { code: "AU", name: "Australia", flag: "🇦🇺", digits: 10 },
];

export const DATE_FORMATS: DateFormatDef[] = [
  { label: "YYYY-MM-DD", re: /^\d{4}-\d{2}-\d{2}$/ },
  { label: "DD-MM-YYYY", re: /^\d{2}-\d{2}-\d{4}$/ },
  { label: "MM/DD/YYYY", re: /^\d{2}\/\d{2}\/\d{4}$/ },
  { label: "DD/MM/YYYY", re: /^\d{2}\/\d{2}\/\d{4}$/ },
  { label: "YYYY/MM/DD", re: /^\d{4}\/\d{2}\/\d{2}$/ },
  { label: "DD MMM YYYY", re: /^\d{2} [A-Za-z]{3} \d{4}$/ },
];

/** Indices into DATE_FORMATS that are active by default. */
export const DEFAULT_ACTIVE_DATE_FORMATS = [0, 1];

export const DATETIME_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/;

export const EXPECTED_FIELDS: ExpectedField[] = [
  { key: "order_id", label: "Order ID", type: "id" },
  { key: "product_name", label: "Product Name", type: "text" },
  { key: "amount", label: "Amount", type: "number" },
  { key: "payment_mode", label: "Payment Mode", type: "text" },
  { key: "order_date", label: "Order Date", type: "date" },
  { key: "phone", label: "Phone Number", type: "phone" },
  { key: "country_code", label: "Country Code", type: "text" },
  { key: "customer_name", label: "Customer Name", type: "text" },
];

export const DEFAULT_CHUNK_SIZE = 5;
export const VALIDATION_BATCH_SIZE = 50;
export const SKIP_VALUE = "(skip)";
