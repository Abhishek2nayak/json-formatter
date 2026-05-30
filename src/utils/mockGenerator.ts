import { faker } from '@faker-js/faker';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [k: string]: JsonValue };

// ── Smart field-name → faker function map ──────────────────────

type FakerFn = () => JsonValue;

const FIELD_MAP: [RegExp, FakerFn][] = [
  // Identity
  [/^(id|uuid|guid)$/i,                               () => faker.string.uuid()],
  [/^(_id|objectId|object_id)$/i,                     () => faker.database.mongodbObjectId()],
  // Person
  [/^(name|fullName|full_name|displayName|display_name)$/i, () => faker.person.fullName()],
  [/^(firstName|first_name|fname)$/i,                 () => faker.person.firstName()],
  [/^(lastName|last_name|lname|surname)$/i,            () => faker.person.lastName()],
  [/^(username|userName|user_name|handle|login)$/i,    () => faker.internet.username()],
  [/^(gender|sex)$/i,                                 () => faker.helpers.arrayElement(['male', 'female', 'non-binary'])],
  [/^(age)$/i,                                        () => faker.number.int({ min: 18, max: 80 })],
  [/^(birthDate|birthdate|dob|dateOfBirth|date_of_birth)$/i, () => faker.date.birthdate().toISOString().split('T')[0]],
  // Contact
  [/^(email|emailAddress|email_address|mail)$/i,       () => faker.internet.email()],
  [/^(phone|phoneNumber|phone_number|mobile|tel|cell)$/i, () => faker.phone.number()],
  // Internet
  [/^(url|website|link|homepage|webUrl|web_url|siteUrl|site_url)$/i, () => faker.internet.url()],
  [/^(avatar|avatarUrl|avatar_url|profilePicture|profile_picture|photo|image|picture|thumbnail)$/i, () => faker.image.avatar()],
  [/^(password|pwd|pass)$/i,                          () => faker.internet.password({ length: 12 })],
  [/^(ip|ipAddress|ip_address|ipv4)$/i,               () => faker.internet.ip()],
  [/^(ipv6)$/i,                                       () => faker.internet.ipv6()],
  [/^(userAgent|user_agent|browser)$/i,               () => faker.internet.userAgent()],
  // Location
  [/^(address|streetAddress|street_address|street|addr)$/i, () => faker.location.streetAddress()],
  [/^(city|town)$/i,                                  () => faker.location.city()],
  [/^(state|province|region|county)$/i,               () => faker.location.state()],
  [/^(country|countryName|country_name)$/i,            () => faker.location.country()],
  [/^(countryCode|country_code)$/i,                   () => faker.location.countryCode()],
  [/^(zip|zipCode|zip_code|postalCode|postal_code|postcode)$/i, () => faker.location.zipCode()],
  [/^(lat|latitude)$/i,                               () => faker.location.latitude()],
  [/^(lng|lon|longitude)$/i,                          () => faker.location.longitude()],
  [/^(timezone|timeZone|time_zone)$/i,                () => faker.location.timeZone()],
  // Company / Work
  [/^(company|companyName|company_name|employer|organization|org)$/i, () => faker.company.name()],
  [/^(jobTitle|job_title|position|role|occupation|title)$/i, () => faker.person.jobTitle()],
  [/^(department|dept|division)$/i,                   () => faker.commerce.department()],
  [/^(industry|sector)$/i,                            () => faker.helpers.arrayElement(['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'])],
  // Finance
  [/^(price|amount|cost|fee|rate|salary|wage|budget|balance|total|subtotal|tax)$/i, () => parseFloat(faker.commerce.price({ min: 1, max: 999 }))],
  [/^(currency|currencyCode|currency_code)$/i,        () => faker.finance.currencyCode()],
  [/^(iban)$/i,                                       () => faker.finance.iban()],
  [/^(creditCard|credit_card|cardNumber|card_number|ccNumber|cc_number)$/i, () => faker.finance.creditCardNumber()],
  [/^(accountNumber|account_number|bankAccount|bank_account)$/i, () => faker.finance.accountNumber()],
  // Dates / Time
  [/^(createdAt|created_at|registeredAt|registered_at|joinedAt|joined_at)$/i, () => faker.date.past({ years: 2 }).toISOString()],
  [/^(updatedAt|updated_at|modifiedAt|modified_at|lastUpdated|last_updated)$/i, () => faker.date.recent({ days: 30 }).toISOString()],
  [/^(deletedAt|deleted_at)$/i,                       () => faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.2 }) ?? null],
  [/^(publishedAt|published_at|postedAt|posted_at)$/i, () => faker.date.recent({ days: 60 }).toISOString()],
  [/^(expiresAt|expires_at|expiryDate|expiry_date|expiration)$/i, () => faker.date.future({ years: 1 }).toISOString()],
  [/^(date|dateTime|date_time|timestamp|time)$/i,      () => faker.date.recent().toISOString()],
  [/^(year)$/i,                                       () => faker.number.int({ min: 2000, max: 2024 })],
  // Content / Text
  [/^(title|heading|subject|label)$/i,                () => faker.lorem.sentence({ min: 3, max: 8 })],
  [/^(description|bio|about|summary|overview|excerpt|intro|abstract)$/i, () => faker.lorem.paragraph()],
  [/^(content|body|text|article|post|message|note|comment)$/i, () => faker.lorem.paragraphs(2)],
  [/^(slug|permalink)$/i,                             () => faker.helpers.slugify(faker.lorem.words(3))],
  [/^(tag|tags|label|labels|keyword|keywords|category|categories)$/i, () => faker.helpers.arrayElements(['tech', 'news', 'tutorial', 'guide', 'update', 'review'], { min: 1, max: 3 })],
  // Product / Commerce
  [/^(productName|product_name|itemName|item_name|product|item|sku)$/i, () => faker.commerce.productName()],
  [/^(productCategory|product_category)$/i,           () => faker.commerce.department()],
  [/^(quantity|qty|stock|inventory|count)$/i,          () => faker.number.int({ min: 0, max: 1000 })],
  [/^(rating|score|rank|stars)$/i,                    () => faker.number.float({ min: 1, max: 5, fractionDigits: 1 })],
  // Status / Flags
  [/^(status)$/i,                                     () => faker.helpers.arrayElement(['active', 'inactive', 'pending', 'suspended', 'archived'])],
  [/^(active|enabled|isActive|is_active|verified|isVerified|is_verified|published|isPublished|is_published)$/i, () => faker.datatype.boolean()],
  [/^(role|userRole|user_role|accessLevel|access_level|permission)$/i, () => faker.helpers.arrayElement(['admin', 'user', 'editor', 'viewer', 'moderator'])],
  [/^(language|locale|lang)$/i,                       () => faker.helpers.arrayElement(['en', 'fr', 'de', 'es', 'ja', 'zh', 'pt'])],
  [/^(theme|colorScheme|color_scheme)$/i,              () => faker.helpers.arrayElement(['light', 'dark', 'auto'])],
  // Misc
  [/^(color|colour|hex|hexColor|hex_color)$/i,        () => faker.color.rgb({ format: 'hex', casing: 'lower' })],
  [/^(token|apiKey|api_key|accessToken|access_token|refreshToken|refresh_token|secret|secretKey|secret_key)$/i, () => faker.string.alphanumeric(40)],
  [/^(version|versionNumber|version_number|semver)$/i, () => faker.system.semver()],
  [/^(os|platform|device|deviceType|device_type)$/i,  () => faker.helpers.arrayElement(['web', 'ios', 'android', 'desktop'])],
  [/^(width|height|size|dimension)$/i,                () => faker.number.int({ min: 100, max: 2000 })],
  [/^(duration|length|minutes|seconds|hours)$/i,      () => faker.number.int({ min: 1, max: 120 })],
  [/^(views|clicks|impressions|likes|shares|followers|following)$/i, () => faker.number.int({ min: 0, max: 100000 })],
];

function fakerForKey(key: string): FakerFn | null {
  for (const [pattern, fn] of FIELD_MAP) {
    if (pattern.test(key)) return fn;
  }
  return null;
}

// ── Value generator ────────────────────────────────────────────

function generateValue(key: string, sampleValue: JsonValue, depth = 0): JsonValue {
  // Try smart field name detection first
  const smartFn = fakerForKey(key);
  if (smartFn && typeof sampleValue !== 'object') {
    return smartFn();
  }

  if (sampleValue === null) return faker.helpers.maybe(() => faker.lorem.word(), { probability: 0.7 }) ?? null;

  if (typeof sampleValue === 'boolean') return faker.datatype.boolean();

  if (typeof sampleValue === 'number') {
    if (Number.isInteger(sampleValue)) {
      const magnitude = Math.max(1, Math.abs(sampleValue));
      return faker.number.int({ min: 0, max: magnitude * 3 });
    }
    return faker.number.float({ min: 0, max: Math.max(100, sampleValue * 3), fractionDigits: 2 });
  }

  if (typeof sampleValue === 'string') {
    // Try smart fn even for strings
    if (smartFn) return smartFn();
    // Infer from value format
    if (sampleValue.match(/^\d{4}-\d{2}-\d{2}T/)) return faker.date.recent().toISOString();
    if (sampleValue.match(/^\d{4}-\d{2}-\d{2}$/)) return faker.date.recent().toISOString().split('T')[0];
    if (sampleValue.match(/^https?:\/\//)) return faker.internet.url();
    if (sampleValue.match(/^[\w.+-]+@[\w-]+\.\w+$/)) return faker.internet.email();
    if (sampleValue.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/i)) return faker.string.uuid();
    if (sampleValue.match(/^#[0-9a-f]{3,6}$/i)) return faker.color.rgb({ format: 'hex', casing: 'lower' });
    // Fallback based on length
    if (sampleValue.length > 80) return faker.lorem.paragraph();
    if (sampleValue.length > 20) return faker.lorem.sentence();
    return faker.lorem.word();
  }

  if (Array.isArray(sampleValue)) {
    if (sampleValue.length === 0) return [];
    const el = sampleValue[0];
    const count = faker.number.int({ min: 1, max: Math.max(3, sampleValue.length) });
    if (el !== null && typeof el === 'object' && !Array.isArray(el) && depth < 3) {
      return Array.from({ length: count }, () => generateObject(el as Record<string, JsonValue>, depth + 1));
    }
    return Array.from({ length: count }, () => generateValue(key, el, depth + 1));
  }

  if (typeof sampleValue === 'object' && depth < 3) {
    return generateObject(sampleValue as Record<string, JsonValue>, depth + 1);
  }

  return faker.lorem.word();
}

function generateObject(sample: Record<string, JsonValue>, depth = 0): Record<string, JsonValue> {
  const result: Record<string, JsonValue> = {};
  for (const [key, val] of Object.entries(sample)) {
    result[key] = generateValue(key, val, depth);
  }
  return result;
}

// ── Public API ─────────────────────────────────────────────────

export interface GenerateOptions {
  count: number;
  seed?: number;
  locale?: string;
}

export function generateMockData(
  sample: unknown,
  opts: GenerateOptions = { count: 5 }
): JsonValue {
  if (opts.seed !== undefined) faker.seed(opts.seed);

  const root = Array.isArray(sample) ? sample[0] : sample;

  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    throw new Error('Input must be a JSON object or array of objects');
  }

  const obj = root as Record<string, JsonValue>;
  const records = Array.from({ length: opts.count }, () => generateObject(obj));

  return opts.count === 1 ? records[0] : records;
}
