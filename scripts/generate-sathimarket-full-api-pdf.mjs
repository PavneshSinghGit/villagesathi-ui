/**
 * SathiMarket — Complete API PDF (Customer + Merchant pages)
 * Run: node scripts/generate-sathimarket-full-api-pdf.mjs
 */
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'docs');
const OUT_FILE = join(OUT_DIR, 'SathiMarket-Complete-API-Mobile-Guide.pdf');

const BRAND = { r: 61, g: 0, b: 48 };
const GOLD = { r: 212, g: 160, b: 23 };

class PdfBuilder {
  constructor() {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
    this.y = 20;
  }

  ensure(space = 20) {
    if (this.y > 297 - space) {
      this.doc.addPage();
      this.y = 20;
    }
  }

  heading(title) {
    this.ensure(14);
    const { doc } = this;
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(14, this.y - 5, 182, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title, 16, this.y + 1);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    this.y += 12;
  }

  sub(title) {
    this.ensure(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    this.doc.text(title, 14, this.y);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(30, 30, 30);
    this.y += 7;
  }

  para(text, maxW = 182) {
    this.ensure(12);
    this.doc.setFontSize(9);
    this.doc.setTextColor(40, 40, 40);
    const lines = this.doc.splitTextToSize(text, maxW);
    this.doc.text(lines, 14, this.y);
    this.y += lines.length * 5.2 + 3;
  }

  code(lines) {
    this.ensure(lines.length * 4.5 + 10);
    const h = lines.length * 4.1 + 6;
    const { doc } = this;
    doc.setFillColor(245, 240, 255);
    doc.setDrawColor(221, 214, 254);
    doc.roundedRect(14, this.y - 3, 182, h, 2, 2, 'FD');
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(25, 25, 70);
    let cy = this.y + 2;
    for (const line of lines) {
      doc.text(line, 16, cy);
      cy += 4.1;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    this.y += h + 4;
  }

  table(head, body) {
    this.ensure(30);
    autoTable(this.doc, {
      startY: this.y,
      head: [head],
      body,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: { fillColor: [BRAND.r, BRAND.g, BRAND.b], textColor: 255, fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 245, 255] },
    });
    this.y = this.doc.lastAutoTable.finalY + 7;
  }

  pageBreak() {
    this.doc.addPage();
    this.y = 20;
  }

  cover() {
    const { doc } = this;
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
    doc.rect(0, 82, 210, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('SathiMarket', 105, 42, { align: 'center' });
    doc.setFontSize(13);
    doc.text('Complete API Documentation', 105, 54, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(220, 200, 210);
    doc.text('Customer + Merchant — Mobile App Guide', 105, 66, { align: 'center' });
    doc.text('Source: villagesathi-ui/src/pages/SathiMarket', 105, 78, { align: 'center' });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 92, { align: 'center' });
    doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
    doc.setFont('helvetica', 'bold');
    doc.text('https://api.villagesathi.in/api', 105, 104, { align: 'center' });
    this.pageBreak();
  }

  footer() {
    const pages = this.doc.getNumberOfPages();
    for (let i = 2; i <= pages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(120, 120, 120);
      this.doc.text('SathiMarket Complete API — VillageSathi', 14, 290);
      this.doc.text(`Page ${i} / ${pages}`, 196, 290, { align: 'right' });
    }
  }

  save(path) {
    this.footer();
    if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
    this.doc.save(path);
  }
}

function pageBlock(p, title, route, file, apis, notes = '') {
  p.sub(`Page: ${title}`);
  p.para(`Route: ${route}`);
  p.para(`File: src/pages/SathiMarket/${file}`);
  if (notes) p.para(notes);
  if (!apis.length) {
    p.para('No backend API calls — UI-only component.');
    return;
  }
  p.table(
    ['Method', 'Endpoint', 'Purpose'],
    apis.map(a => [a.method, a.endpoint, a.purpose])
  );
}

function apiDetail(p, { method, endpoint, purpose, auth, request, response, notes }) {
  p.sub(`${method} ${endpoint}`);
  p.para(purpose);
  if (auth) p.para(`Auth: ${auth}`);
  if (request?.length) p.code(['Request:', ...request]);
  if (response?.length) p.code(['Response (expected):', ...response]);
  if (notes) p.para(notes);
}

function build() {
  const p = new PdfBuilder();
  p.cover();

  // ── 1 Folder structure ─────────────────────────────────────────────
  p.heading('1. SathiMarket Folder Structure');
  p.code([
    'src/pages/SathiMarket/',
    '├── Customer/',
    '│   ├── Cart.jsx                 → ManageAddress, PlaceOrder',
    '│   ├── CustomerDashBoard.jsx    → GetByUser orders',
    '│   ├── CustomerLogin.jsx        → Customer/Login',
    '│   ├── CustomerRegister.jsx     → Customer/Register',
    '│   ├── ManageAddresses.jsx      → Customer/ManageAddress',
    '│   ├── MyOrders.jsx             → Orders/GetByUser',
    '│   ├── ProductDetailsModal.jsx  → (no API — UI modal)',
    '│   ├── SathiMarket.jsx          → Shops/GetAll',
    '│   ├── ShopDetails.jsx          → Shops/GetById, ShopItems/GetByShop',
    '│   └── WishList.jsx             → EXCLUDED (no backend)',
    '└── Merchant/',
    '    ├── ManageInventory.jsx      → ShopItems CRUD',
    '    ├── ManageProfile.jsx        → Shops GetById, UpdateShop',
    '    ├── MerchantDashBoard.jsx    → Orders, ShopItems',
    '    ├── MerchantLogin.jsx        → Auth/Login',
    '    ├── MerchantRegister.jsx     → Auth register, roles, categories',
    '    └── ShopOrders.jsx           → Orders GetByShop, UpdateStatus',
  ]);

  // ── 2 Base config ──────────────────────────────────────────────────
  p.heading('2. Base Configuration');
  p.code([
    'Base URL:  https://api.villagesathi.in/api',
    'Images:    https://api.villagesathi.in  (VITE_IMAGE_URL)',
    'Headers:   Content-Type: application/json',
    '           Accept: */*',
    'Protected: Authorization: Bearer <token>',
  ]);
  p.table(
    ['RoleId', 'Role', 'Login API'],
    [
      ['1', 'Admin', 'POST /Auth/Login'],
      ['2', 'Merchant / Shopkeeper', 'POST /Auth/Login + RoleId=2'],
      ['3', 'Customer', 'POST /Customer/Login + RoleId=3'],
    ]
  );

  // ── 3 Master index ─────────────────────────────────────────────────
  p.heading('3. Master API Index (All Endpoints)');
  p.table(
    ['Method', 'Endpoint', 'Used In'],
    [
      ['GET', '/Auth/get-roles', 'MerchantRegister'],
      ['POST', '/Auth/register', 'MerchantRegister'],
      ['POST', '/Auth/Login', 'MerchantLogin'],
      ['GET', '/Categories/GetAll', 'MerchantRegister'],
      ['POST', '/Customer/Register', 'CustomerRegister'],
      ['POST', '/Customer/Login', 'CustomerLogin'],
      ['POST', '/Customer/ManageAddress', 'ManageAddresses, Cart'],
      ['GET', '/Shops/GetAll', 'SathiMarket'],
      ['GET', '/Shops/GetById/{id}', 'ShopDetails, ManageProfile'],
      ['POST', '/Shops/UpdateShop', 'ManageProfile'],
      ['GET', '/ShopItems/GetByShop/{shopId}', 'ShopDetails, ManageInventory, Dashboard'],
      ['POST', '/ShopItems/AddItem', 'ManageInventory (multipart)'],
      ['DELETE', '/ShopItems/DeleteItem/{itemId}', 'ManageInventory'],
      ['POST', '/Orders/PlaceOrder', 'Cart'],
      ['GET', '/Orders/GetByUser/{userId}', 'MyOrders, CustomerDashBoard'],
      ['GET', '/Orders/GetByShop/{shopId}', 'ShopOrders, MerchantDashBoard'],
      ['POST', '/Orders/UpdateStatus', 'ShopOrders'],
    ]
  );

  p.pageBreak();
  p.heading('4. Auth APIs (Merchant Register & Login)');

  apiDetail(p, {
    method: 'GET', endpoint: '/Auth/get-roles', purpose: 'Load Account Type dropdown.',
    auth: 'No', request: ['(none)'],
    response: ['[ { "id": 2, "roleName": "Merchant" }, ... ]'],
  });
  apiDetail(p, {
    method: 'GET', endpoint: '/Categories/GetAll', purpose: 'Shop category dropdown when roleId=2.',
    auth: 'No',
    response: ['{ "Data": [ { "categoryID": 1, "categoryName": "Grocery" } ] }'],
  });
  apiDetail(p, {
    method: 'POST', endpoint: '/Auth/register', purpose: 'Register user + shop (merchant).',
    auth: 'No',
    request: [
      '{',
      '  "name": "Owner Name",',
      '  "mobileNo": "9876543210",',
      '  "password": "***",',
      '  "villageId": 1,',
      '  "roleId": "2",',
      '  "shopName": "Sathi Store",      // required if roleId=2',
      '  "categoryId": "1",',
      '  "shopAddress": "Full address"',
      '}',
    ],
    notes: 'UI: isBusiness = Number(roleId)===2 shows Shop Information block (shopName, categoryId, shopAddress).',
    response: ['{ "success": true, "message": "..." }'],
  });
  apiDetail(p, {
    method: 'POST', endpoint: '/Auth/Login', purpose: 'Merchant login (unified auth).',
    auth: 'No',
    request: ['{ "mobileNo": "9876543210", "password": "***" }'],
    response: [
      '{ "Success": 1, "token": "...", "Data": {',
      '    "RoleId": 2, "ShopId": 15, "shopName": "...", "mobileNo": "..."',
      '} }',
    ],
    notes: 'Reject if RoleId !== 2. Store shopId for all merchant APIs.',
  });

  p.pageBreak();
  p.heading('5. Customer Module — APIs by Page');

  pageBlock(p, 'CustomerLogin', '/customer-login', 'Customer/CustomerLogin.jsx', [
    { method: 'POST', endpoint: '/Customer/Login', purpose: 'Customer sign-in' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/Customer/Login',
    purpose: 'Authenticate customer; flat response at root level.',
    request: ['{ "mobileNo": "10 digits", "password": "***" }'],
    response: [
      '{ "Success": 1, "UserId": 101, "Name": "...", "RoleId": 3,',
      '  "RoleName": "Customer", "City": "...", "VillageId": 1 }',
    ],
    notes: 'Save to customerUser: userId, name, mobileNo, roleId, roleName, city, villageId. RoleId must be 3.',
  });

  pageBlock(p, 'CustomerRegister', '/customer-register', 'Customer/CustomerRegister.jsx', [
    { method: 'POST', endpoint: '/Customer/Register', purpose: 'New customer account' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/Customer/Register',
    request: [
      '{ "name", "mobileNo", "password", "villageId": 0,',
      '  "fullAddress", "landmark", "city", "state", "pincode" }',
    ],
    response: ['{ "Success": 1, "Message": "Account created..." }'],
  });

  pageBlock(p, 'SathiMarket (Home)', '/sathi-market', 'Customer/SathiMarket.jsx', [
    { method: 'GET', endpoint: '/Shops/GetAll', purpose: 'List all shops on marketplace' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Shops/GetAll',
    purpose: 'Public shop listing with search/filter by categoryName.',
    response: [
      'Array or { Data: [ { shopID, shopName, categoryName,',
      '  shopAddress, shopImage, isOpen, ... } ] }',
    ],
    notes: 'Wishlist toggle is local state only — no API.',
  });

  pageBlock(p, 'ShopDetails', '/shop/:id', 'Customer/ShopDetails.jsx', [
    { method: 'GET', endpoint: '/Shops/GetById/{id}', purpose: 'Shop header info' },
    { method: 'GET', endpoint: '/ShopItems/GetByShop/{id}', purpose: 'Products in shop' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Shops/GetById/{shopId}',
    response: ['{ shopName, categoryName, shopAddress, isOpen, ownerName, ... }'],
  });
  apiDetail(p, {
    method: 'GET', endpoint: '/ShopItems/GetByShop/{shopId}',
    response: [
      '[ { itemID, itemName, price, itemDescription,',
      '    mediaList: [ { mediaURL, isPrimary, mediaType } ] } ]',
    ],
    notes: 'ProductDetailsModal opens from this data — no separate API.',
  });

  pageBlock(p, 'ProductDetailsModal', '(modal)', 'Customer/ProductDetailsModal.jsx', [], 
    'Displays item from ShopDetails. Add to cart uses CartContext (localStorage sathiCart). No HTTP calls.');

  pageBlock(p, 'Cart', '/cart', 'Customer/Cart.jsx', [
    { method: 'POST', endpoint: '/Customer/ManageAddress', purpose: 'actionType=3 fetch addresses' },
    { method: 'POST', endpoint: '/Orders/PlaceOrder', purpose: 'Checkout' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/Customer/ManageAddress',
    purpose: 'Cart loads saved addresses (same API as ManageAddresses).',
    request: [
      '{ "actionType": 3, "userId": 101, "addressId": 0,',
      '  "fullAddress": "", "landmark": "", "city": "", "state": "", "pincode": "" }',
    ],
    response: ['[ { "Id", "FullAddress", "City", "Pincode", "Landmark", "State" } ]'],
    notes: 'actionType: 1=Add, 2=Update, 3=Get, 4=Delete',
  });
  apiDetail(p, {
    method: 'POST', endpoint: '/Orders/PlaceOrder',
    purpose: 'Place order from cart. One shop per order.',
    request: [
      '{',
      '  "userId": 101,',
      '  "shopId": 15,',
      '  "addressId": 5,',
      '  "totalAmount": 500,',
      '  "orderStatus": 0,',
      '  "isActive": true,',
      '  "orderItems": [',
      '    { "itemId": 1, "quantity": 2, "unitPrice": 100, "totalPrice": 200 }',
      '  ]',
      '}',
    ],
    response: ['{ "orderID": 123 } or message containing success'],
    notes: 'Success if orderID/OrderID present. Cart must be single-shop.',
  });

  p.pageBreak();

  pageBlock(p, 'ManageAddresses', '/manage-addresses', 'Customer/ManageAddresses.jsx', [
    { method: 'POST', endpoint: '/Customer/ManageAddress', purpose: 'CRUD addresses' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/Customer/ManageAddress',
    purpose: 'Single endpoint for all address operations via actionType.',
    request: [
      'Add (1):    { actionType:1, userId, addressId:0, fullAddress, landmark, city, state, pincode }',
      'Update (2): { actionType:2, userId, addressId, fullAddress, ... }',
      'Get (3):    { actionType:3, userId, addressId:0, empty strings }',
      'Delete (4): { actionType:4, userId, addressId, empty strings }',
    ],
    response: ['Get → array of addresses. Add/Update/Delete → { Success, Message }'],
  });

  pageBlock(p, 'CustomerDashBoard', '/customer-dashboard', 'Customer/CustomerDashBoard.jsx', [
    { method: 'GET', endpoint: '/Orders/GetByUser/{userId}?page=1&pageSize=3', purpose: 'Recent orders' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Orders/GetByUser/{userId}',
    purpose: 'Dashboard fetches 3 recent orders.',
    request: ['Query: page=1, pageSize=3'],
    response: ['{ Data: [...orders], TotalCount?: number }'],
    notes: 'Requires customerUser in localStorage with userId.',
  });

  pageBlock(p, 'MyOrders', '/my-orders', 'Customer/MyOrders.jsx', [
    { method: 'GET', endpoint: '/Orders/GetByUser/{userId}?page&pageSize=5', purpose: 'Order history' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Orders/GetByUser/{userId}',
    request: ['Query: page (default 1), pageSize (5)'],
    response: [
      'Order object fields: orderID, orderStatus, orderDate, totalAmount,',
      'orderItems: [ { itemName, quantity, unitPrice, totalPrice } ]',
    ],
    notes: 'orderStatus: 0=Pending, 1=Completed, 2=Cancelled (merchant view). Invoice is client-side PDF.',
  });

  p.para('WishList.jsx — EXCLUDED: wishlist uses localStorage customerWishlist only; no backend API implemented.');

  p.pageBreak();
  p.heading('6. Merchant Module — APIs by Page');

  pageBlock(p, 'MerchantRegister', '/merchant-register', 'Merchant/MerchantRegister.jsx', [
    { method: 'GET', endpoint: '/Auth/get-roles', purpose: 'Roles dropdown' },
    { method: 'GET', endpoint: '/Categories/GetAll', purpose: 'Category dropdown' },
    { method: 'POST', endpoint: '/Auth/register', purpose: 'Submit registration' },
  ]);

  pageBlock(p, 'MerchantLogin', '/merchant-login', 'Merchant/MerchantLogin.jsx', [
    { method: 'POST', endpoint: '/Auth/Login', purpose: 'Merchant sign-in' },
  ]);

  pageBlock(p, 'MerchantDashBoard', '/merchant/dashboard', 'Merchant/MerchantDashBoard.jsx', [
    { method: 'GET', endpoint: '/Orders/GetByShop/{shopId}', purpose: 'Orders + stats' },
    { method: 'GET', endpoint: '/ShopItems/GetByShop/{shopId}', purpose: 'Active item count' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Orders/GetByShop/{shopId}',
    purpose: 'All orders for merchant shop. Stats: pending(0), completed(1), cancelled(2).',
    response: ['[ { orderID, userID, totalAmount, orderStatus, orderDate, ... } ]'],
    notes: 'shopId from login Data.ShopId. Requires Bearer token if API protected.',
  });

  pageBlock(p, 'ManageProfile', '/merchant/profile', 'Merchant/ManageProfile.jsx', [
    { method: 'GET', endpoint: '/Shops/GetById/{shopId}', purpose: 'Load shop profile' },
    { method: 'POST', endpoint: '/Shops/UpdateShop', purpose: 'Toggle isOpen / update shop' },
  ]);
  apiDetail(p, {
    method: 'GET', endpoint: '/Shops/GetById/{shopId}',
    response: [
      '{ shopName, categoryName, shopAddress, ownerName,',
      '  isOpen, openingTime, closingTime, shopImage, ... }',
    ],
  });
  apiDetail(p, {
    method: 'POST', endpoint: '/Shops/UpdateShop',
    purpose: 'Update shop — UI sends full shop object with isOpen toggled.',
    request: ['{ ...shopFields, shopId, isOpen: true|false }'],
    response: ['Success implied by no error; UI updates local state'],
  });

  pageBlock(p, 'ManageInventory', '/merchant/inventory', 'Merchant/ManageInventory.jsx', [
    { method: 'GET', endpoint: '/ShopItems/GetByShop/{shopId}', purpose: 'List products' },
    { method: 'POST', endpoint: '/ShopItems/AddItem', purpose: 'Add product (multipart)' },
    { method: 'DELETE', endpoint: '/ShopItems/DeleteItem/{itemId}', purpose: 'Remove product' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/ShopItems/AddItem',
    purpose: 'multipart/form-data — NOT JSON.',
    request: [
      'FormData fields:',
      '  ShopID (number)',
      '  ItemName, ItemDescription, Price (float)',
      '  IsAvailable: true, IsActive: true',
      '  mediaFiles: (file[]) — one or more images',
    ],
    notes: 'Header: Content-Type: multipart/form-data',
  });
  apiDetail(p, {
    method: 'DELETE', endpoint: '/ShopItems/DeleteItem/{itemId}',
    purpose: 'Delete product by itemID.',
  });

  pageBlock(p, 'ShopOrders', '/merchant/orders', 'Merchant/ShopOrders.jsx', [
    { method: 'GET', endpoint: '/Orders/GetByShop/{shopId}', purpose: 'List orders' },
    { method: 'POST', endpoint: '/Orders/UpdateStatus', purpose: 'Complete or cancel' },
  ]);
  apiDetail(p, {
    method: 'POST', endpoint: '/Orders/UpdateStatus',
    request: ['{ "orderID": 123, "status": 1 }', '// status: 1=Complete, 2=Cancel'],
    notes: 'Pending orders have orderStatus=0. Confirm dialog before update.',
  });

  p.pageBreak();
  p.heading('7. Mobile App — Implementation Checklist');

  p.table(
    ['Step', 'Customer App', 'Merchant App'],
    [
      ['1', 'POST /Customer/Register', 'GET roles + categories'],
      ['2', 'POST /Customer/Login', 'POST /Auth/register (roleId=2 + shop)'],
      ['3', 'GET /Shops/GetAll', 'POST /Auth/Login'],
      ['4', 'GET shop + items', 'GET /Shops/GetById, inventory'],
      ['5', 'ManageAddress + Cart checkout', 'GET/POST orders, UpdateStatus'],
    ]
  );

  p.heading('8. Order Status Reference');
  p.table(
    ['orderStatus', 'Meaning', 'Merchant action'],
    [
      ['0', 'Pending', 'Can Complete (1) or Cancel (2)'],
      ['1', 'Completed', '—'],
      ['2', 'Cancelled', '—'],
    ]
  );

  p.heading('9. Local Storage Keys (Web Reference)');
  p.table(
    ['Key', 'User', 'Content'],
    [
      ['customerUser', 'Customer', 'userId, name, mobileNo, roleId, city, villageId'],
      ['user + token', 'Merchant', 'shopId, RoleId, token from Auth/Login'],
      ['sathiCart', 'Customer', 'Cart items (local until PlaceOrder)'],
      ['customerWishlist', 'Customer', 'Local only — no API'],
    ]
  );

  p.save(OUT_FILE);
  console.log('PDF created:', OUT_FILE);
}

build();
