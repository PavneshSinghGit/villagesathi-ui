/**
 * Generates SathiMarket Auth API PDF for mobile app development.
 * Run: node scripts/generate-sathimarket-auth-pdf.mjs
 */
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'docs');
const OUT_FILE = join(OUT_DIR, 'SathiMarket-Auth-API-Mobile-Guide.pdf');

const BRAND = { r: 61, g: 0, b: 48 };
const GOLD = { r: 212, g: 160, b: 23 };
const MUTED = { r: 100, g: 116, b: 139 };

function wrap(doc, text, x, y, maxW, lineH = 5.5) {
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

function heading(doc, title, y) {
  if (y > 265) { doc.addPage(); y = 20; }
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(14, y - 5, 182, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, 16, y + 1);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');
  return y + 12;
}

function sub(doc, title, y) {
  if (y > 270) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(title, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  return y + 7;
}

function body(doc, text, y, maxW = 182) {
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  return wrap(doc, text, 14, y, maxW) + 3;
}

function codeBlock(doc, lines, y) {
  if (y > 240) { doc.addPage(); y = 20; }
  const h = lines.length * 4.2 + 6;
  doc.setFillColor(245, 240, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(14, y - 3, 182, h, 2, 2, 'FD');
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 30, 80);
  let cy = y + 2;
  for (const line of lines) {
    doc.text(line, 16, cy);
    cy += 4.2;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  return y + h + 4;
}

function table(doc, head, rows, y) {
  autoTable(doc, {
    startY: y,
    head: [head],
    body: rows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [BRAND.r, BRAND.g, BRAND.b], textColor: 255 },
    alternateRowStyles: { fillColor: [250, 245, 255] },
  });
  return doc.lastAutoTable.finalY + 8;
}

function build() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 0;

  // ── Cover ──────────────────────────────────────────────────────────
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(0, 88, 210, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('SathiMarket', 105, 50, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Authentication & Registration API Guide', 105, 62, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(220, 200, 210);
  doc.text('VillageSathi — Mobile App Integration (Step by Step)', 105, 74, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Generated from villagesathi-ui web codebase', 105, 100, { align: 'center' });
  doc.text(`Document date: ${new Date().toLocaleDateString('en-IN')}`, 105, 108, { align: 'center' });
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setFont('helvetica', 'bold');
  doc.text('api.villagesathi.in', 105, 120, { align: 'center' });

  doc.addPage();
  y = 20;

  // ── TOC ────────────────────────────────────────────────────────────
  y = heading(doc, '1. Table of Contents', y);
  const toc = [
    '2. Overview & Base Configuration',
    '3. Role IDs (Admin / Merchant / Customer)',
    '4. Mobile App — Recommended Implementation Order',
    '5. API: GET /Auth/get-roles',
    '6. API: GET /Categories/GetAll',
    '7. API: POST /Auth/register (Merchant + Shop)',
    '8. Merchant Register — Conditional Shop Fields (roleId = 2)',
    '9. API: POST /Auth/Login (Merchant)',
    '10. API: POST /Customer/Register',
    '11. API: POST /Customer/Login',
    '12. Error Handling & Response Conventions',
    '13. Token & Local Storage (Web vs Mobile)',
    '14. Quick Reference — All Endpoints',
  ];
  doc.setFontSize(9);
  toc.forEach((line, i) => {
    doc.text(`${i + 1}. ${line.replace(/^\d+\.\s*/, '')}`, 18, y);
    y += 6;
  });

  doc.addPage();
  y = 20;

  // ── 2 Overview ─────────────────────────────────────────────────────
  y = heading(doc, '2. Overview & Base Configuration', y);
  y = body(doc, 'All SathiMarket auth APIs use the same axios base URL configured in the web app:', y);
  y = codeBlock(doc, [
    'Base URL: https://api.villagesathi.in/api',
    'Local dev: https://localhost:7092/api  (see .env VITE_API_URL)',
    '',
    'Headers (every request):',
    '  Content-Type: application/json',
    '  Accept: */*',
    '',
    'Protected routes (after login):',
    '  Authorization: Bearer <token>',
  ], y);
  y = body(doc, 'Image base URL (shop images, not auth): https://api.villagesathi.in', y);

  // ── 3 Roles ─────────────────────────────────────────────────────────
  y = heading(doc, '3. Role IDs', y);
  y = table(doc,
    ['RoleId', 'Role', 'Used In'],
    [
      ['1', 'Admin', 'Admin portal — POST /Auth/Login, role check = 1'],
      ['2', 'Merchant / Shopkeeper', 'Merchant login & register — role check = 2'],
      ['3', 'Customer', 'Customer login & register — role check = 3'],
    ],
    y
  );

  // ── 4 Mobile order ─────────────────────────────────────────────────
  y = heading(doc, '4. Mobile App — Step-by-Step Build Order', y);
  y = sub(doc, 'Phase A — Merchant (Shopkeeper) flow', y);
  y = body(doc, 'Step 1: On Merchant Register screen load, call GET /Auth/get-roles and GET /Categories/GetAll in parallel.', y);
  y = body(doc, 'Step 2: Show Account fields: name, mobileNo, password, roleId dropdown.', y);
  y = body(doc, 'Step 3: When user selects roleId = 2, show Shop Information section (shopName, categoryId, shopAddress).', y);
  y = body(doc, 'Step 4: On submit, POST /Auth/register with full JSON body (see Section 7–8).', y);
  y = body(doc, 'Step 5: On success, navigate to Merchant Login screen.', y);
  y = body(doc, 'Step 6: POST /Auth/Login with mobileNo + password. Verify RoleId === 2.', y);
  y = body(doc, 'Step 7: Save token + user/shop object. Use shopId for orders, inventory, profile APIs.', y);

  y = sub(doc, 'Phase B — Customer flow', y);
  y = body(doc, 'Step 1: Customer Register — collect identity + address, POST /Customer/Register.', y);
  y = body(doc, 'Step 2: Customer Login — POST /Customer/Login. Verify RoleId === 3.', y);
  y = body(doc, 'Step 3: Save user profile (userId, name, mobileNo, roleId, city, villageId).', y);
  y = body(doc, 'Step 4: Use userId for orders, cart checkout, addresses (ManageAddress API).', y);

  if (y > 230) { doc.addPage(); y = 20; }

  // ── 5 get-roles ────────────────────────────────────────────────────
  y = heading(doc, '5. GET /Auth/get-roles', y);
  y = body(doc, 'Purpose: Populate Account Type dropdown on Merchant Register screen.', y);
  y = sub(doc, 'Request', y);
  y = codeBlock(doc, ['GET /Auth/get-roles', 'No body. No query parameters.'], y);
  y = sub(doc, 'Response (example)', y);
  y = codeBlock(doc, [
    '[',
    '  { "id": 2, "roleName": "Merchant" },',
    '  { "id": 3, "roleName": "Customer" }',
    ']',
  ], y);
  y = body(doc, 'UI maps: option value = role.id, label = role.roleName. For shopkeeper registration select id = 2.', y);

  // ── 6 categories ───────────────────────────────────────────────────
  y = heading(doc, '6. GET /Categories/GetAll', y);
  y = body(doc, 'Purpose: Category dropdown inside Shop Information (only when roleId = 2).', y);
  y = sub(doc, 'Request', y);
  y = codeBlock(doc, ['GET /Categories/GetAll'], y);
  y = sub(doc, 'Response (example)', y);
  y = codeBlock(doc, [
    '{',
    '  "Data": [',
    '    { "categoryID": 1, "categoryName": "Grocery" },',
    '    { "categoryID": 2, "categoryName": "Medical" }',
    '  ]',
    '}',
  ], y);
  y = body(doc, 'Web app also accepts flat array: response.Data || response. Auto-select first category on load.', y);

  doc.addPage();
  y = 20;

  // ── 7 register ─────────────────────────────────────────────────────
  y = heading(doc, '7. POST /Auth/register', y);
  y = body(doc, 'Purpose: Register merchant/shopkeeper (and other roles if API allows). Web uses lowercase path /Auth/register; authApi.js also defines /Auth/Register.', y);
  y = sub(doc, 'Request — Full merchant payload (roleId = 2)', y);
  y = codeBlock(doc, [
    'POST /Auth/register',
    '{',
    '  "name": "Ramesh Kumar",',
    '  "mobileNo": "9876543210",',
    '  "password": "SecurePass@123",',
    '  "villageId": 1,',
    '  "roleId": "2",',
    '  "shopName": "Sathi Grocery Store",',
    '  "categoryId": "1",',
    '  "shopAddress": "Main Road, Village XYZ"',
    '}',
  ], y);
  y = sub(doc, 'Field reference', y);
  y = table(doc,
    ['Field', 'Type', 'Required', 'Notes'],
    [
      ['name', 'string', 'Yes', 'Owner full name'],
      ['mobileNo', 'string', 'Yes', '10 digits — login ID'],
      ['password', 'string', 'Yes', 'Plain text over HTTPS'],
      ['villageId', 'number', 'Yes', 'Web default: 1'],
      ['roleId', 'string|number', 'Yes', '2 = Merchant'],
      ['shopName', 'string', 'If roleId=2', 'Shop display name'],
      ['categoryId', 'string|number', 'If roleId=2', 'From Categories API'],
      ['shopAddress', 'string', 'If roleId=2', 'Full physical address'],
    ],
    y
  );

  // ── 8 conditional ──────────────────────────────────────────────────
  y = heading(doc, '8. Conditional Shop Fields (roleId = 2)', y);
  y = body(doc, 'Frontend logic: const isBusiness = Number(formData.roleId) === 2;', y);
  y = body(doc, 'When isBusiness is true, render Shop Information block with 3 extra required fields. When false, hide shop UI but formData may still contain empty shop fields on submit.', y);
  y = sub(doc, 'UI fields when shopkeeper selected', y);
  y = table(doc,
    ['UI Label', 'JSON key', 'Control'],
    [
      ['Shop Name', 'shopName', 'Text input'],
      ['Category', 'categoryId', 'Select from Categories/GetAll'],
      ['Physical Address', 'shopAddress', 'Textarea'],
    ],
    y
  );
  y = sub(doc, 'Success response', y);
  y = codeBlock(doc, [
    '{ "success": true, "message": "Registration successful" }',
    '// OR',
    '{ "Success": true, "Message": "..." }',
  ], y);
  y = sub(doc, 'Error response', y);
  y = codeBlock(doc, ['{ "message": "Mobile already registered" }'], y);
  y = body(doc, 'On success: show toast → navigate to /merchant-login (mobile: MerchantLogin screen).', y);

  doc.addPage();
  y = 20;

  // ── 9 merchant login ───────────────────────────────────────────────
  y = heading(doc, '9. POST /Auth/Login (Merchant)', y);
  y = body(doc, 'Purpose: Unified login used by Merchant and Admin. Merchant app must reject users where RoleId !== 2.', y);
  y = sub(doc, 'Request', y);
  y = codeBlock(doc, [
    'POST /Auth/Login',
    '{',
    '  "mobileNo": "9876543210",',
    '  "password": "yourPassword"',
    '}',
  ], y);
  y = sub(doc, 'Success response (example)', y);
  y = codeBlock(doc, [
    '{',
    '  "Success": 1,',
    '  "Message": "Login successful",',
    '  "token": "eyJhbGciOiJIUzI1NiIs...",',
    '  "Data": {',
    '    "RoleId": 2,',
    '    "ShopId": 15,',
    '    "name": "Ramesh Kumar",',
    '    "mobileNo": "9876543210",',
    '    "shopName": "Sathi Grocery Store"',
    '  }',
    '}',
  ], y);
  y = body(doc, 'Accept both casings: Success/success, Data/data, RoleId/roleId, ShopId/shopId.', y);
  y = body(doc, 'Mobile: if Number(data.RoleId || data.roleId) !== 2 → show "Merchant account only".', y);
  y = body(doc, 'Store: token + user object. Dashboard uses shopId for /Orders/GetByShop, /ShopItems/GetByShop, /Shops/GetById.', y);

  // ── 10 customer register ───────────────────────────────────────────
  y = heading(doc, '10. POST /Customer/Register', y);
  y = sub(doc, 'Request', y);
  y = codeBlock(doc, [
    'POST /Customer/Register',
    '{',
    '  "name": "Aman Singh",',
    '  "mobileNo": "9876543211",',
    '  "password": "secret123",',
    '  "villageId": 0,',
    '  "fullAddress": "House 12, Ward 3",',
    '  "landmark": "Near Temple",',
    '  "city": "Barabanki",',
    '  "state": "Uttar Pradesh",',
    '  "pincode": "225001"',
    '}',
  ], y);
  y = table(doc,
    ['Field', 'Validation (web UI)'],
    [
      ['name', 'Required'],
      ['mobileNo', '10 digits'],
      ['password', 'Min 6 characters'],
      ['fullAddress, city', 'Required'],
      ['pincode', '6 digits'],
      ['landmark', 'Optional'],
      ['state', 'Default: Uttar Pradesh'],
    ],
    y
  );
  y = sub(doc, 'Success', y);
  y = codeBlock(doc, ['{ "Success": 1, "Message": "Account created successfully" }'], y);

  // ── 11 customer login ──────────────────────────────────────────────
  y = heading(doc, '11. POST /Customer/Login', y);
  y = sub(doc, 'Request', y);
  y = codeBlock(doc, [
    'POST /Customer/Login',
    '{ "mobileNo": "9876543211", "password": "secret123" }',
  ], y);
  y = sub(doc, 'Success — flat response (web reads top-level fields)', y);
  y = codeBlock(doc, [
    '{',
    '  "Success": 1,',
    '  "UserId": 101,',
    '  "Name": "Aman Singh",',
    '  "MobileNo": "9876543211",',
    '  "RoleId": 3,',
    '  "RoleName": "Customer",',
    '  "City": "Lucknow",',
    '  "VillageId": 1',
    '}',
  ], y);
  y = body(doc, 'Mobile: if RoleId !== 3 → deny access. Save: userId, name, mobileNo, roleId, roleName, city, villageId.', y);
  y = body(doc, 'Note: Web stores customer in customerUser localStorage; token may not be in response — confirm with backend for mobile Bearer auth.', y);

  doc.addPage();
  y = 20;

  // ── 12 errors ──────────────────────────────────────────────────────
  y = heading(doc, '12. Error Handling & Response Conventions', y);
  y = table(doc,
    ['Check', 'Meaning'],
    [
      ['Success === 1', 'Customer APIs success flag'],
      ['success === true', 'Auth register / some login responses'],
      ['Success === 1 || success === true', 'Use OR for login/register'],
      ['message / Message', 'Error text — show to user'],
      ['HTTP 4xx/5xx', 'Use response.data.message or .title'],
    ],
    y
  );
  y = body(doc, 'Always send JSON body as UTF-8. Use HTTPS in production. Validate 10-digit mobile and role before navigating to role-specific home.', y);

  // ── 13 token ───────────────────────────────────────────────────────
  y = heading(doc, '13. Token & Storage (Web vs Mobile)', y);
  y = table(doc,
    ['User type', 'Login API', 'Storage key (web)', 'Role check'],
    [
      ['Merchant', '/Auth/Login', 'user + token', 'RoleId === 2'],
      ['Customer', '/Customer/Login', 'customerUser', 'RoleId === 3'],
      ['Admin', '/Auth/Login', 'user + token', 'roleId === 1'],
    ],
    y
  );
  y = body(doc, 'Mobile recommendation: SecureStore/Keychain for token; separate keys merchantUser vs customerUser. Attach Bearer token on all protected API calls.', y);

  // ── 14 quick ref ───────────────────────────────────────────────────
  y = heading(doc, '14. Quick Reference — All Auth Endpoints', y);
  y = table(doc,
    ['#', 'Method', 'Endpoint', 'Screen'],
    [
      ['1', 'GET', '/Auth/get-roles', 'Merchant Register'],
      ['2', 'GET', '/Categories/GetAll', 'Merchant Register (shop)'],
      ['3', 'POST', '/Auth/register', 'Merchant Register submit'],
      ['4', 'POST', '/Auth/Login', 'Merchant Login'],
      ['5', 'POST', '/Customer/Register', 'Customer Register'],
      ['6', 'POST', '/Customer/Login', 'Customer Login'],
    ],
    y
  );

  // Footer on last pages
  const pages = doc.getNumberOfPages();
  for (let i = 2; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text('SathiMarket Auth API — VillageSathi Mobile Guide', 14, 290);
    doc.text(`Page ${i} of ${pages}`, 196, 290, { align: 'right' });
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  doc.save(OUT_FILE);
  console.log('PDF created:', OUT_FILE);
}

build();
