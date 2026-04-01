import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import AutoSync from "./AutoSync";
import RealtimeSync from "./RealtimeSync";
import { supabase } from "./supabase";

// ==================== CONFIG ====================
const PRIMARY = "#4DAF94";
const PRIMARY_DARK = "#3D9A82";
const SIDEBAR_BG = "#4EA88E";
const SIDEBAR_TEXT = "#fff";
const PHONE = "+964 770 153 6017";
const EMAIL = "hawbirranya6@gmail.com";

const PROJECT_IMAGES = [
  { src: "https://i.ibb.co/5h46CW2n/IMG-0443.jpg", desc_ku: "بیناسازی نیشتەجێبوون", desc_en: "Residential Construction", desc_ar: "بناء سكني" },
  { src: "https://i.ibb.co/VYgVY00f/IMG-0442.jpg", desc_ku: "ستراکچەری پۆڵایین", desc_en: "Steel Structure", desc_ar: "هياكل فولاذية" },
  { src: "https://i.ibb.co/k2D9vJ3c/IMG-0441.jpg", desc_ku: "کاری کۆنکریت", desc_en: "Concrete Work", desc_ar: "أعمال خرسانية" },
  { src: "https://i.ibb.co/LD5rz2p9/IMG-0440.jpg", desc_ku: "بیناسازی بازرگانی", desc_en: "Commercial Building", desc_ar: "بناء تجاري" },
  { src: "https://i.ibb.co/QjX64FxD/IMG-0439.jpg", desc_ku: "دیزاینی ناوخۆ", desc_en: "Interior Design", desc_ar: "تصميم داخلي" },
  { src: "https://i.ibb.co/0x44LW1/IMG-0438.jpg", desc_ku: "پڕۆژەی کۆمپلێکس", desc_en: "Complex Project", desc_ar: "مشروع مجمع" },
  { src: "https://i.ibb.co/qFMVBWck/IMG-0437.jpg", desc_ku: "قاڵبی Doka ئەڵمانی", desc_en: "German Doka Formwork", desc_ar: "قوالب Doka الألمانية" },
  { src: "https://i.ibb.co/SXxXSYGW/IMG-0439.jpg", desc_ku: "Project 9", desc_en: "Project 9", desc_ar: "Project 9" },
  { src: "https://i.ibb.co/dwrFnQLg/IMG-0437.jpg", desc_ku: "Project 10", desc_en: "Project 10", desc_ar: "Project 10" },
  { src: "https://i.ibb.co/Xdv729n/8ecc7425-001b-4874-867f-fbcc13f0ecb9.jpg", desc_ku: "Project 11", desc_en: "Project 11", desc_ar: "Project 11" },
  { src: "https://i.ibb.co/JWdjP2gw/IMG-0438.jpg", desc_ku: "Project 12", desc_en: "Project 12", desc_ar: "Project 12" },
  { src: "https://i.ibb.co/G38Hxksc/IMG-0435.jpg", desc_ku: "ستراکچەری بنەڕەت", desc_en: "Foundation Structure", desc_ar: "هيكل الأساسات" },
];

// ==================== USERS ====================
const USERS = [
  { username: "shasti", password: "shasti123", project: "shasti", label: "شاستی", isAdmin: false, isFrozen: false },
  { username: "surosh", password: "surosh123", project: "surosh", label: "بەرزایەکانی سروشت", isAdmin: false, isFrozen: false },
  { username: "admin", password: "karo2024", project: "admin", label: "Admin", isAdmin: true, isFrozen: false }
];

// ==================== FONTS ====================
const FONTS = [
  { name: "Segoe UI", value: "'Segoe UI', Tahoma, sans-serif" },
  { name: "NRT", value: "'NRT', sans-serif" },
  { name: "Rudaw", value: "'Rudaw', sans-serif" },
  { name: "Rabar", value: "'Rabar', sans-serif" },
  { name: "Vazirmatn", value: "'Vazirmatn', sans-serif" },
  { name: "Noto Kufi Arabic", value: "'Noto Kufi Arabic', sans-serif" },
  { name: "Tajawal", value: "'Tajawal', sans-serif" },
  { name: "Cairo", value: "'Cairo', sans-serif" },
  { name: "Danmark", value: "'Danmark', sans-serif" },
  { name: "KG Primary", value: "'KG Primary', sans-serif" },
  { name: "Noto Sans Arabic", value: "'Noto Sans Arabic', sans-serif" },
  { name: "Ava TV", value: "'Ava TV', sans-serif" },
];

// ==================== TRANSLATIONS ====================
const T = {
  ku: {
    nav: { home: "سەرەتا", services: "خزمەتگوزارییەکان", projects: "پڕۆژەکان", about: "دەربارە", contact: "پەیوەندی" },
    hero: { title: "بیناسازی پیشەسازانە", subtitle: "لە ٢٠١٧ ـەوە، کارۆ گروپ پێشەنگە لە بواری بیناسازی و کۆنکریت لە هەرێمی کوردستان", cta: "پڕۆژەکانمان ببینە" },
    services: { title: "خزمەتگوزارییەکانمان", s1: { name: "بیناسازی نیشتەجێبوون", desc: "دیزاین و دروستکردنی خانوو و کۆمپلێکسی نیشتەجێبوون بە ستانداردی نێودەوڵەتی" }, s2: { name: "بیناسازی بازرگانی", desc: "دروستکردنی بینای بازرگانی، مۆڵ، ئۆفیس و پڕۆژەی گەورە بە کوالیتی بەرز" }, s3: { name: "کۆنکریت و ستراکچەر", desc: "کاری کۆنکریتی ئامادە و ستراکچەری پۆڵایین بە مەوادی پێشکەوتوو" } },
    about: { title: "بۆچی کارۆ گروپ؟", items: ["مەوادی پێشکەوتوو - Doka ی ئەڵمانی، جەگ، پلاوودی ئەسڵی", "گرێنتی لەسەر هەموو کارەکان", "پابەندبوون بە سەیفتی و ستانداردی نێودەوڵەتی", "ستافی شارەزا و بە ئەزموون"] },
    contact: { title: "پەیوەندیمان پێوە بکە", phone: "تەلەفۆن", whatsapp: "واتسئاپ", viber: "ڤایبەر", email: "ئیمەیڵ" },
    footer: { rights: "هەموو مافەکان پارێزراون", poweredBy: "کارۆ گروپ" },
    login: "چوونەژوورەوە", username: "ناوی بەکارهێنەر", password: "وشەی نهێنی", enter: "بچۆرە ژوورەوە", wrongLogin: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە", logout: "چوونەدەرەوە",
    sidebar: { 
      cash: "قاسە", 
      loans: "قەرز", 
      concrete: "سلفە کۆنکرێت", 
      contractor: "حیسابی مقاول", 
      exchange: "ئالوگۆری دراو", 
      invoice: "ئینڤۆیس", 
      backup: "پاشەکەوتی داتاکان", 
      reports: "ڕاپۆرتەکان", 
      history: "هیستۆری داتا", 
      monthlyReport: "کەشف حیسابی مانگانە", 
      expenses: "خەرجی (مەسارف)", 
      formatData: "سڕینەوەی هەموو داتاکان",
      users: "بەکارهێنەران",
      allProjects: "هەموو پرۆژەکان",
      messages: "نامەکان"
    },
    cashBox: "قاسەی پارە", iqd: "دینار", usd: "دۆلار", dark: "تاریک", light: "ڕووناک",
    date: "بەروار", receiptNo: "ژمارەی وەسڵ", receiptImg: "وێنە", amountIQD: "بڕ بە دینار", amountUSD: "بڕ بە دۆلار", note: "تێبینی",
    search: "گەڕان", filterMonth: "فلتەر بە مانگ", filterProject: "فلتەر بە پرۆژە", total: "کۆی گشتی", print: "پرینت", save: "پاشەکەوت", delete: "سڕینەوە", edit: "دەستکاری", add: "زیادکردن", cancel: "هەڵوەشاندنەوە",
    mark: "مارک", marked: "✓", showAll: "پیشاندانی هەمووی", showMarked: "تەنها مارککراوەکان",
    loanType: "جۆر", loanTake: "قەرز وەرگرتن", loanGive: "قەرز دان", personName: "ناوی کەس",
    meters: "بڕی مەتر", pricePerMeter: "نرخی مەتر", totalConcrete: "کۆی گشتی", deposit: "تەئمین", depositPercent: "ڕێژەی تەئمین %", received: "بڕی وەرگرتن", claimDeposit: "وەرگرتنی تەئمین",
    contractorType: "جۆر", withdraw: "ڕاکێشان", addMoney: "زیادکردن",
    cashIQD: "دینار لە قاسە", cashUSD: "دۆلار لە قاسە", totalInIQD: "کۆی گشتی بە دینار",
    exchangeRate: "نرخی دۆلار بە دینار", saveRate: "پاشەکەوت", convertTo: "گۆڕین بۆ", fromUSD: "دۆلار بۆ دینار", fromIQD: "دینار بۆ دۆلار",
    amount: "بڕ", result: "ئەنجام", convert: "گۆڕین",
    invoiceNo: "ژمارەی ئینڤۆیس", itemName: "ناوی کاڵا", qty: "حەدەد", price: "نرخ", addItem: "زیادکردنی ئایتم", viewInvoice: "بینین", billTo: "بۆ", billPhone: "ژمارەی مۆبایل",
    cashLog: "هاتن/چوونی پارە", type: "جۆر",
    noBalance: "بڕی پارەی پێویستت نییە لە قاسەدا، تکایە باڵانس زیاد بکە بۆ قاسە",
    allMonths: "هەموو مانگەکان", clickToChange: "کلیک بکە بۆ گۆڕین",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "سایز هەڵبژێرە",
    totalExpIQD: "کۆی خەرجی (دینار)", totalExpUSD: "کۆی خەرجی (دۆلار)", totalConcreteReceived: "کۆی سلفە وەرگیراو", totalDeposit: "کۆی تەئمین",
    reportsTitle: "ڕاپۆرتی گشتی", noData: "هیچ داتایەک نییە",
    downloadBackup: "داونلۆدی پاشەکەوت", uploadBackup: "بارکردنی پاشەکەوت", backupSuccess: "سەرکەوتوو بوو",
    ok: "باشە", addPerson: "زیادکردنی کەس", persons: "کەسەکان", allPersons: "هەموو کەسەکان",
    font: "فۆنت", importExcel: "هاوردە لە Excel",
    from: "لە", to: "تا", profitLoss: "قازانج/زەرەر", income: "داهات", expense: "خەرجی", profit: "قازانج", loss: "زەرەر",
    formatConfirm: "بۆ سڕینەوەی هەموو داتاکان، تکایە ناوی بەکارهێنەر و وشەی نهێنی ئەدمین بنووسە",
    formatSuccess: "هەموو داتاکان سڕانەوە",
    currency: "دراو", onlyIQD: "تەنها دینار", onlyUSD: "تەنها دۆلار",
    removeImg: "سڕینەوەی وێنە",
    depositNotClaimed: "تەئمین وەرنەگیراوە",
    confirmDelete: "دڵنیایت لە سڕینەوەی ئەم داتایە؟",
    yes: "بەڵێ، بسڕەوە",
    no: "نەخێر",
    receivedStatus: "وەرگیراو",
    notReceived: "وەرنەگیراو",
    concCurrency: "دراوی سلفە",
    returnMoney: "گەڕاندنەوەی پارە",
    returnConfirm: "دڵنیایت لە گەڕاندنەوەی ئەم پارەیە؟",
    returned: "گەڕێندراوەتەوە",
    notReturned: "نەگەڕێندراوەتەوە",
    addUser: "زیادکردنی بەکارهێنەر",
    editUser: "دەستکاری بەکارهێنەر",
    projectName: "ناوی پرۆژە",
    userLabel: "ناوی پیشاندراو",
    isAdmin: "ئەدمینە",
    adminRequired: "تەنها ئەدمین دەتوانێت ئەم کارە بکات",
    enterAdminCredentials: "ناوی بەکارهێنەر و وشەی نهێنی ئەدمین بنووسە",
    totalDepositIQD: "کۆی تەئمین (دینار)",
    totalDepositUSD: "کۆی تەئمین (دۆلار)",
    searchInvoice: "گەڕان بەپێی ژمارە یان ناو",
    selectCurrency: "دراو هەڵبژێرە",
    exchangeRateForReport: "نرخی ئالوگۆڕ بۆ ڕاپۆرت",
    totalMeters: "کۆی گشتی مەتر",
    avgPricePerMeter: "تێکڕای نرخی مەتر",
    freeze: "وەستاندن",
    unfreeze: "کردنەوە",
    frozen: "وەستێنراوە",
    active: "چالاکە",
    sendMessage: "ناردنی نامە",
    newMessage: "نامەی نوێ",
    message: "نامە",
    to: "بۆ",
    selectProjects: "پرۆژەکان هەڵبژێرە",
    send: "ناردن",
    inbox: "سندوقی وەرگیراو",
    markAsRead: "نیشانکردن وەک خوێندراوە",
    unread: "نەخوێندراوە",
    read: "خوێندراوە",
    fromAdmin: "لە ئەدمینەوە",
    importExcel: "هاوردە لە Excel",
  },
  en: {
    nav: { home: "Home", services: "Services", projects: "Projects", about: "About", contact: "Contact" },
    hero: { title: "Professional Construction", subtitle: "Since 2017, Karo Group has been a leader in construction and concrete in Kurdistan Region", cta: "View Our Projects" },
    services: { title: "Our Services", s1: { name: "Residential Construction", desc: "Design and construction of houses and residential complexes to international standards" }, s2: { name: "Commercial Construction", desc: "Building commercial properties, malls, offices and large projects" }, s3: { name: "Concrete & Structure", desc: "Ready-mix concrete and steel structures with advanced materials" } },
    about: { title: "Why Karo Group?", items: ["Advanced materials - German Doka, scaffolding, original plywood", "Warranty on all work", "Committed to safety and international standards", "Experienced and expert staff"] },
    contact: { title: "Contact Us", phone: "Phone", whatsapp: "WhatsApp", viber: "Viber", email: "Email" },
    footer: { rights: "All rights reserved", poweredBy: "Karo Group" },
    login: "Login", username: "Username", password: "Password", enter: "Sign In", wrongLogin: "Wrong username or password", logout: "Logout",
    sidebar: { 
      cash: "Cash Box", 
      loans: "Loans", 
      concrete: "Concrete Advance", 
      contractor: "Contractor", 
      exchange: "Exchange", 
      invoice: "Invoice", 
      backup: "Backup", 
      reports: "Reports", 
      history: "History", 
      monthlyReport: "Monthly Statement", 
      expenses: "Expenses", 
      formatData: "Format All Data",
      users: "Users",
      allProjects: "All Projects",
      messages: "Messages"
    },
    cashBox: "Cash Box", iqd: "IQD", usd: "USD", dark: "Dark", light: "Light",
    date: "Date", receiptNo: "Receipt #", receiptImg: "Image", amountIQD: "Amount IQD", amountUSD: "Amount USD", note: "Note",
    search: "Search", filterMonth: "Filter Month", filterProject: "Filter Project", total: "Total", print: "Print", save: "Save", delete: "Delete", edit: "Edit", add: "Add", cancel: "Cancel",
    mark: "Mark", marked: "✓", showAll: "Show All", showMarked: "Marked Only",
    loanType: "Type", loanTake: "Received", loanGive: "Given", personName: "Person",
    meters: "Meters", pricePerMeter: "Price/m", totalConcrete: "Total", deposit: "Deposit", depositPercent: "Deposit %", received: "Received", claimDeposit: "Claim Deposit",
    contractorType: "Type", withdraw: "Withdraw", addMoney: "Add",
    cashIQD: "Cash IQD", cashUSD: "Cash USD", totalInIQD: "Total (IQD)",
    exchangeRate: "USD Rate", saveRate: "Save", convertTo: "Convert to", fromUSD: "USD to IQD", fromIQD: "IQD to USD",
    amount: "Amount", result: "Result", convert: "Convert",
    invoiceNo: "Invoice #", itemName: "Item", qty: "Qty", price: "Price", addItem: "Add Item", viewInvoice: "View", billTo: "Bill To", billPhone: "Phone",
    cashLog: "Cash Log", type: "Type",
    noBalance: "Insufficient balance. Please add balance to cash box first.",
    allMonths: "All Months", clickToChange: "Click to change",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "Select Size",
    totalExpIQD: "Expenses (IQD)", totalExpUSD: "Expenses (USD)", totalConcreteReceived: "Concrete Received", totalDeposit: "Total Deposit",
    reportsTitle: "Reports", noData: "No data",
    downloadBackup: "Download Backup", uploadBackup: "Upload Backup", backupSuccess: "Success",
    ok: "OK", addPerson: "Add Person", persons: "Persons", allPersons: "All Persons",
    font: "Font", importExcel: "Import Excel",
    from: "From", to: "To", profitLoss: "Profit/Loss", income: "Income", expense: "Expense", profit: "Profit", loss: "Loss",
    formatConfirm: "To format all data, enter admin username and password",
    formatSuccess: "All data has been cleared",
    currency: "Currency", onlyIQD: "IQD Only", onlyUSD: "USD Only",
    removeImg: "Remove Image",
    depositNotClaimed: "Deposit not claimed",
    confirmDelete: "Are you sure you want to delete this item?",
    yes: "Yes, delete",
    no: "No",
    receivedStatus: "Received",
    notReceived: "Not Received",
    concCurrency: "Concrete Currency",
    returnMoney: "Return Money",
    returnConfirm: "Are you sure you want to return this money?",
    returned: "Returned",
    notReturned: "Not Returned",
    addUser: "Add User",
    editUser: "Edit User",
    projectName: "Project Name",
    userLabel: "Display Name",
    isAdmin: "Is Admin",
    adminRequired: "Only admin can do this",
    enterAdminCredentials: "Enter admin username and password",
    totalDepositIQD: "Total Deposit (IQD)",
    totalDepositUSD: "Total Deposit (USD)",
    searchInvoice: "Search by number or name",
    selectCurrency: "Select Currency",
    exchangeRateForReport: "Exchange rate for report",
    totalMeters: "Total Meters",
    avgPricePerMeter: "Avg Price/Meter",
    freeze: "Freeze",
    unfreeze: "Unfreeze",
    frozen: "Frozen",
    active: "Active",
    sendMessage: "Send Message",
    newMessage: "New Message",
    message: "Message",
    to: "To",
    selectProjects: "Select Projects",
    send: "Send",
    inbox: "Inbox",
    markAsRead: "Mark as Read",
    unread: "Unread",
    read: "Read",
    fromAdmin: "From Admin",
    importExcel: "Import Excel",
  },
  ar: {
    nav: { home: "الرئيسية", services: "الخدمات", projects: "المشاريع", about: "حولنا", contact: "اتصل بنا" },
    hero: { title: "بناء احترافي", subtitle: "منذ ٢٠١٧، مجموعة كارو رائدة في مجال البناء والخرسانة في إقليم كوردستان", cta: "شاهد مشاريعنا" },
    services: { title: "خدماتنا", s1: { name: "البناء السكني", desc: "تصميم وبناء المنازل والمجمعات السكنية وفق المعايير الدولية" }, s2: { name: "البناء التجاري", desc: "بناء العقارات التجارية والمولات والمكاتب" }, s3: { name: "الخرسانة والهياكل", desc: "خرسانة جاهزة وهياكل فولاذية بمواد متطورة" } },
    about: { title: "لماذا مجموعة كارو؟", items: ["مواد متطورة - Doka الألمانية، سقالات، خشب رقائقي أصلي", "ضمان على جميع الأعمال", "الالتزام بالسلامة والمعايير الدولية", "طاقم ذو خبرة وكفاءة"] },
    contact: { title: "تواصل معنا", phone: "هاتف", whatsapp: "واتساب", viber: "فايبر", email: "بريد إلكتروني" },
    footer: { rights: "جميع الحقوق محفوظة", poweredBy: "مجموعة كارو" },
    login: "تسجيل الدخول", username: "اسم المستخدم", password: "كلمة المرور", enter: "دخول", wrongLogin: "خطأ في الاسم أو كلمة المرور", logout: "خروج",
    sidebar: { 
      cash: "الصندوق", 
      loans: "القروض", 
      concrete: "سلفة خرسانة", 
      contractor: "المقاول", 
      exchange: "صرف العملات", 
      invoice: "فاتورة", 
      backup: "نسخ احتياطي", 
      reports: "التقارير", 
      history: "السجل", 
      monthlyReport: "كشف حساب", 
      expenses: "المصاريف", 
      formatData: "مسح جميع البيانات",
      users: "المستخدمين",
      allProjects: "جميع المشاريع",
      messages: "الرسائل"
    },
    cashBox: "صندوق النقد", iqd: "دينار", usd: "دولار", dark: "داكن", light: "فاتح",
    date: "التاريخ", receiptNo: "رقم الوصل", receiptImg: "صورة", amountIQD: "المبلغ (دينار)", amountUSD: "المبلغ (دولار)", note: "ملاحظة",
    search: "بحث", filterMonth: "تصفية", filterProject: "تصفية بالمشروع", total: "المجموع", print: "طباعة", save: "حفظ", delete: "حذف", edit: "تعديل", add: "إضافة", cancel: "إلغاء",
    mark: "تعليم", marked: "✓", showAll: "عرض الكل", showMarked: "المعلّم فقط",
    loanType: "النوع", loanTake: "مستلم", loanGive: "ممنوح", personName: "الشخص",
    meters: "الأمتار", pricePerMeter: "سعر/م", totalConcrete: "الإجمالي", deposit: "التأمين", depositPercent: "نسبة التأمين %", received: "المستلم", claimDeposit: "استلام التأمين",
    contractorType: "النوع", withdraw: "سحب", addMoney: "إيداع",
    cashIQD: "نقد دينار", cashUSD: "نقد دولار", totalInIQD: "الإجمالي (دينار)",
    exchangeRate: "سعر الدولار", saveRate: "حفظ", convertTo: "تحويل إلى", fromUSD: "دولار إلى دينار", fromIQD: "دينار إلى دولار",
    amount: "المبلغ", result: "النتيجة", convert: "تحويل",
    invoiceNo: "رقم الفاتورة", itemName: "السلعة", qty: "العدد", price: "السعر", addItem: "إضافة عنصر", viewInvoice: "عرض", billTo: "إلى", billPhone: "الهاتف",
    cashLog: "سجل النقد", type: "النوع",
    noBalance: "الرصيد غير كافٍ. أضف رصيداً للصندوق أولاً.",
    allMonths: "الكل", clickToChange: "اضغط للتغيير",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "اختر الحجم",
    totalExpIQD: "مصاريف (دينار)", totalExpUSD: "مصاريف (دولار)", totalConcreteReceived: "خرسانة مستلمة", totalDeposit: "إجمالي التأمين",
    reportsTitle: "التقارير", noData: "لا توجد بيانات",
    downloadBackup: "تحميل النسخة", uploadBackup: "استيراد النسخة", backupSuccess: "تم بنجاح",
    ok: "حسناً", addPerson: "إضافة شخص", persons: "الأشخاص", allPersons: "جميع الأشخاص",
    font: "الخط", importExcel: "استيراد Excel",
    from: "من", to: "إلى", profitLoss: "ربح/خسارة", income: "الدخل", expense: "المصروف", profit: "ربح", loss: "خسارة",
    formatConfirm: "لمسح جميع البيانات، أدخل اسم المستخدم وكلمة المرور للمدير",
    formatSuccess: "تم مسح جميع البيانات",
    currency: "العملة", onlyIQD: "دينار فقط", onlyUSD: "دولار فقط",
    removeImg: "حذف الصورة",
    depositNotClaimed: "التأمين لم يُستلم",
    confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟",
    yes: "نعم، احذف",
    no: "لا",
    receivedStatus: "مستلم",
    notReceived: "لم يُستلم",
    concCurrency: "عملة السلفة",
    returnMoney: "إعادة المبلغ",
    returnConfirm: "هل أنت متأكد من إعادة هذا المبلغ؟",
    returned: "تم الإعادة",
    notReturned: "لم يتم الإعادة",
    addUser: "إضافة مستخدم",
    editUser: "تعديل مستخدم",
    projectName: "اسم المشروع",
    userLabel: "الاسم المعروض",
    isAdmin: "مدير",
    adminRequired: "فقط المدير يمكنه القيام بذلك",
    enterAdminCredentials: "أدخل اسم المستخدم وكلمة المرور للمدير",
    totalDepositIQD: "إجمالي التأمين (دينار)",
    totalDepositUSD: "إجمالي التأمين (دولار)",
    searchInvoice: "البحث بالرقم أو الاسم",
    selectCurrency: "اختر العملة",
    exchangeRateForReport: "سعر الصرف للتقرير",
    totalMeters: "إجمالي الأمتار",
    avgPricePerMeter: "متوسط السعر للمتر",
    freeze: "تجميد",
    unfreeze: "إلغاء التجميد",
    frozen: "مجمد",
    active: "نشط",
    sendMessage: "إرسال رسالة",
    newMessage: "رسالة جديدة",
    message: "رسالة",
    to: "إلى",
    selectProjects: "اختر المشاريع",
    send: "إرسال",
    inbox: "صندوق الوارد",
    markAsRead: "تحديث كمقروء",
    unread: "غير مقروء",
    read: "مقروء",
    fromAdmin: "من المدير",
    importExcel: "استيراد Excel",
  }
};

// ==================== HELPERS ====================
const fmt = (n) => { 
  const v = Number(n || 0); 
  return Math.round(v).toString();
};
const today = () => new Date().toISOString().split("T")[0];
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const setLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const trunc = (s, m = 25) => (!s ? "" : s.length > m ? s.slice(0, m) + "..." : s);

// ==================== ICONS ====================
const I = {
  Sun: (p) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: (p) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  File: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Printer: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Warn: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Wallet: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/></svg>,
  Loan: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h4"/><path d="M8 12h2"/></svg>,
  Concrete: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/></svg>,
  Contractor: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Exchange: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4"/><path d="M3 12h4l3-3 3 3 3-3 3 3 4-4"/><path d="M7 22l-4-4 4-4"/><path d="M21 12h-4l-3 3-3-3-3 3-3-3-4 4"/></svg>,
  Invoice: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Backup: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Return: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h14M9 18l6-6-6-6"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Send: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Freeze: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
};

// ==================== LOGO ====================
function Logo({ size = 40 }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <div style={{ position: "absolute", width: size + 14, height: size + 14, borderRadius: "50%", background: `${PRIMARY}20`, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
      <div style={{ width: size, height: size, borderRadius: "50%", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, boxShadow: `0 4px 16px ${PRIMARY}40` }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: size * 0.38, letterSpacing: -1 }}>KG</span>
      </div>
    </div>
  );
}

// ==================== MODALS ====================
function AlertModal({ message, onOk, s }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><I.Warn /></div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, color: s.text }}>{message}</p>
        <button onClick={onOk} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onYes, onNo, s, t }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><I.Warn /></div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, color: s.text }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onYes} style={{ background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{t.yes}</button>
          <button onClick={onNo} style={{ background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 8, padding: "10px 28px", fontSize: 14, cursor: "pointer" }}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}

function AdminModal({ message, onConfirm, onCancel, s, t }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (username === "admin" && password === "karo2024") {
      onConfirm();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><I.Warn /></div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16, color: s.text }}>{message}</p>
        
        <input 
          type="text" 
          placeholder={t.username} 
          value={username} 
          onChange={e => { setUsername(e.target.value); setError(false); }} 
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${error ? "#EF4444" : s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, marginBottom: 10, direction: "ltr", textAlign: "center" }} 
        />
        
        <input 
          type="password" 
          placeholder={t.password} 
          value={password} 
          onChange={e => { setPassword(e.target.value); setError(false); }} 
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${error ? "#EF4444" : s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, marginBottom: 10, direction: "ltr", textAlign: "center" }} 
        />
        
        {error && <p style={{ color: "#EF4444", fontSize: 11, marginBottom: 10, textAlign: "center" }}>{t.wrongLogin}</p>}
        
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 10 }}>
          <button onClick={handleConfirm} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{t.ok}</button>
          <button onClick={onCancel} style={{ background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 8, padding: "10px 28px", fontSize: 14, cursor: "pointer" }}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ title, children, onSave, onCancel, s, t }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 32, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: PRIMARY, textAlign: "center" }}>{title}</h3>
        <div style={{ marginBottom: 20 }}>{children}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onSave} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{t.save}</button>
          <button onClick={onCancel} style={{ background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 8, padding: "10px 28px", fontSize: 14, cursor: "pointer" }}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

function SizeModal({ onSelect, onClose, s, t }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: s.bgCard, borderRadius: 16, padding: 28, textAlign: "center" }}>
        <h3 style={{ marginBottom: 18, fontSize: 15, fontWeight: 700, color: s.text }}>{t.selectSize}</h3>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {["A3", "A4", "A5"].map(sz => (
            <button key={sz} onClick={() => onSelect(sz)} style={{ padding: "12px 28px", borderRadius: 8, border: `2px solid ${PRIMARY}`, background: "transparent", color: PRIMARY, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = "#fff"; }} onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = PRIMARY; }}>{sz}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PRINT/EXPORT ====================
function doPrint({ title, headers, rows, totalRow, size, isRtl }) {
  const sz = { A3: "420mm 297mm", A4: "210mm 297mm", A5: "148mm 210mm" };
  const w = window.open("", "_blank");
  w.document.write(`<html dir="${isRtl?"rtl":"ltr"}"><head><title>${title}</title><style>@page{size:${sz[size]||sz.A4};margin:12mm}body{font-family:sans-serif;padding:16px;height:100vh;display:flex;flex-direction:column}table{width:100%;border-collapse:collapse;margin-top:12px;flex:1}th{background:${PRIMARY};color:#fff;padding:7px 5px;font-size:11px;position:sticky;top:0;z-index:10}td{border:1px solid #ddd;padding:5px;text-align:center;font-size:11px}h2{color:${PRIMARY};text-align:center;font-size:16px}.t{font-weight:bold;background:#f0fdf4}</style></head><body><h2>KARO GROUP - ${title}</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}${totalRow?`<tr class="t">${totalRow.map(c=>`<td>${c}</td>`).join("")}</tr>`:""}</tbody></table></body></html>`);
  w.document.close(); w.print();
}

function doExcel({ title, headers, rows, totalRow }) {
  let csv = "\uFEFF" + headers.join(",") + "\n";
  rows.forEach(r => { csv += r.map(c => `"${c}"`).join(",") + "\n"; });
  if (totalRow) csv += totalRow.map(c => `"${c}"`).join(",") + "\n";
  const b = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${title}.csv`; a.click();
}

// ==================== STYLES ====================
const getS = (dark) => ({
  bg: dark ? "#0f0f0f" : "#ffffff",
  bgCard: dark ? "#1a1a1a" : "#ffffff",
  bgCard2: dark ? "#222" : "#f8f8f8",
  text: dark ? "#e5e5e5" : "#1c1917",
  textMuted: dark ? "#999" : "#78716c",
  border: dark ? "#333" : "#e5e5e5",
  danger: "#EF4444", success: "#22C55E", warning: "#F59E0B"
});

// ==================== TABLE STYLES ====================
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 12 };
const cellStyle = { padding: "10px 12px", borderBottom: "1px solid", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", textAlign: "center" };

// ==================== TH COMPONENT WITH STICKY ====================
const TH = ({ children, isRtl, style }) => (
  <th style={{ 
    padding: "12px 12px", 
    textAlign: "center", 
    fontWeight: 700, 
    fontSize: 13, 
    whiteSpace: "nowrap", 
    background: "#4EA88E",
    color: "#fff", 
    position: "sticky", 
    top: 0, 
    zIndex: 10,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    ...style 
  }}>
    {children}
  </th>
);

const TD = ({ children, s, style }) => (
  <td style={{ 
    padding: "10px 12px", 
    borderBottom: `2px solid ${s.border}`, 
    whiteSpace: "nowrap", 
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    verticalAlign: "middle", 
    textAlign: "center", 
    fontSize: 12,
    fontWeight: 600,
    ...style 
  }}>
    {children}
  </td>
);

// ==================== STICKY HEADER COMPONENT ====================
const StickyHeader = ({ children, s }) => (
  <div style={{
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: s.bgCard,
    borderBottom: `2px solid ${PRIMARY}`,
    padding: "5px 0 5px 0",
    marginBottom: 5
  }}>
    {children}
  </div>
);

// ==================== APP ====================
export default function App() {
  const [lang, setLang] = useState(getLS("karo_lang", "ku"));
  const [dark, setDark] = useState(getLS("karo_dark", false));
  const [page, setPage] = useState(getLS("karo_page", "landing"));
  const [loggedUser, setLoggedUser] = useState(getLS("karo_user", null));
  const [dashPage, setDashPage] = useState(getLS("karo_dashPage", "reports"));
  const [logoClicks, setLogoClicks] = useState(0);
  const [fontIdx, setFontIdx] = useState(getLS("karo_font", 0));
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await supabase.from("users").select("*");
        if (data && data.length > 0) {
          const mapped = data.map(u => ({
            username: u.username,
            password: u.password,
            project: u.project,
            label: u.label,
            isAdmin: u.isadmin || false,
            isFrozen: u.isfrozen || false
          }));
          setUsers(mapped);
        } else {
          setUsers(USERS);
        }
      } catch(e) {
        setUsers(USERS);
      }
    }
    loadUsers();
  }, []);
  const [messages, setMessages] = useState(getLS("karo_messages", []));
  const [unreadCount, setUnreadCount] = useState(0);
  const logoTimer = useRef(null);
  const isLoadingRef = useRef(false);

  const t = T[lang]; 
  const isRtl = lang !== "en"; 
  const s = getS(dark);
  const fontFamily = FONTS[fontIdx]?.value || FONTS[0].value;

  const pKey = loggedUser?.project || "default";
  const currentUser = users.find(u => u.username === loggedUser?.username);
  const isFrozen = currentUser?.isFrozen || false;

  // دیتای هەر پرۆژەیەک بە کلیدی تایبەت
  const [cashIQD, setCashIQD] = useState(getLS(`karo_cashIQD_${pKey}`, 0));
  const [cashUSD, setCashUSD] = useState(getLS(`karo_cashUSD_${pKey}`, 0));
  const [exchangeRate, setExchangeRate] = useState(getLS(`karo_rate_${pKey}`, 1500));
  const [cashLog, setCashLog] = useState(getLS(`karo_cashLog_${pKey}`, []));

  useEffect(() => {
    if (loggedUser && !loggedUser.isAdmin) {
      const userMessages = messages.filter(m => 
        m.to.includes(loggedUser.project) && !m.read
      );
      setUnreadCount(userMessages.length);
    }
  }, [messages, loggedUser]);

  useEffect(() => { setLS("karo_lang", lang); }, [lang]);
  useEffect(() => { setLS("karo_dark", dark); }, [dark]);
  useEffect(() => { setLS("karo_page", page); }, [page]);
  useEffect(() => { setLS("karo_dashPage", dashPage); }, [dashPage]);
  useEffect(() => { setLS("karo_font", fontIdx); }, [fontIdx]);
  useEffect(() => { setLS("karo_user", loggedUser); }, [loggedUser]);
  useEffect(() => { setLS("karo_users", users); }, [users]);
  useEffect(() => { setLS("karo_messages", messages); }, [messages]);
  
  useEffect(() => { setLS(`karo_rate_${pKey}`, exchangeRate); }, [exchangeRate, pKey]);

  useEffect(() => {
    if (loggedUser) {
      const pk = loggedUser.project;
      setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
      setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
      setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
      setCashLog(getLS(`karo_cashLog_${pk}`, []));
    }
  }, [loggedUser?.project]);

  const saveTimerRef = useRef(null);
  useEffect(() => {
    if(pKey==="default") return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setLS(`karo_cashIQD_${pKey}`, cashIQD);
      setLS(`karo_cashUSD_${pKey}`, cashUSD);
      setLS(`karo_rate_${pKey}`, exchangeRate);
      setLS(`karo_cashLog_${pKey}`, cashLog);
    }, 200);
  }, [cashIQD, cashUSD, exchangeRate, cashLog]);

  useEffect(() => { if(loggedUser) setLS("karo_rate_" + loggedUser.project, exchangeRate); }, [exchangeRate]);

  const addCashLog = useCallback((desc, iqd, usd) => {
    setCashLog(prev => { const newBalIQD = cashIQD + (Number(iqd) ? Number(iqd) : 0); const newBalUSD = cashUSD + (Number(usd) ? Number(usd) : 0); const n=[...prev, { id: genId(), date: today(), desc, iqd: Number(iqd) ? Number(iqd) : 0, usd: Number(usd) ? Number(usd) : 0, balIQD: newBalIQD, balUSD: newBalUSD, time: new Date().toLocaleTimeString() }]; if(loggedUser) setLS("karo_cashLog_" + loggedUser.project, n); return n; });
  }, [loggedUser, cashIQD, cashUSD]);

  useEffect(() => {
    const iv = setInterval(() => {
      const c = new Date(); c.setDate(c.getDate() - 30);
      const cs = c.toISOString().split("T")[0];
      setCashLog(prev => prev.filter(i => i.date >= cs));
    }, 86400000);
    return () => clearInterval(iv);
  }, []);

  const handleLogoClick = () => {
    const n = logoClicks + 1; setLogoClicks(n); clearTimeout(logoTimer.current);
    if (n >= 3) { setLogoClicks(0); setPage(loggedUser ? "dashboard" : "login"); }
    else logoTimer.current = setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleLogin = (u, p) => {
    const user = users.find(x => x.username === u && x.password === p);
    if (user) { 
      setLoggedUser(user); 
      setPage("dashboard"); 
      setDashPage("reports"); 
      return true; 
    }
    return false;
  };
  
  const handleLogout = () => { 
    setLoggedUser(null); 
    setPage("landing"); 
    localStorage.removeItem("karo_user"); 
    setLS("karo_page", "landing"); 
  };

  const markMessageAsRead = (messageId) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const shared = { 
    t, s, isRtl, dark, lang, fontFamily, pKey, 
    cashIQD, setCashIQD, cashUSD, setCashUSD, 
    exchangeRate, setExchangeRate, cashLog, setCashLog, 
    addCashLog, users, setUsers, isFrozen,
    messages, setMessages, unreadCount, markMessageAsRead
  };

  if (page === "login") return <LoginPage {...shared} onLogin={handleLogin} onBack={() => setPage("landing")} />;
  if (page === "dashboard" && loggedUser) return <><AutoSync project={loggedUser.project} cashIQD={cashIQD} cashUSD={cashUSD} exchangeRate={exchangeRate} users={users} /><RealtimeSync project={loggedUser.project} onUpdate={()=>window.location.reload()} /><Dashboard {...shared} setLang={setLang} user={loggedUser} dashPage={dashPage} setDashPage={setDashPage} onLogout={handleLogout} setDark={setDark} fontIdx={fontIdx} setFontIdx={setFontIdx} />  </>
  return <LandingPage {...shared} setLang={setLang} setDark={setDark} onLogoClick={handleLogoClick} />;
}

// ==================== LANDING ====================
function LandingPage({ t, s, isRtl, dark, lang, fontFamily, setLang, setDark, onLogoClick }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => { 
    const h = () => setScrolled(window.scrollY > 40); 
    window.addEventListener("scroll", h); 
    return () => window.removeEventListener("scroll", h); 
  }, []);
  
  const scrollTo = id => { 
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); 
    setMobileMenu(false); 
  };

  const sections = [
    { id: "home", title: t.nav.home, bg: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" },
    { id: "services", title: t.services.title, bg: "#ffffff" },
    { id: "about", title: t.about.title, bg: "#f8f9fa" },
    { id: "contact", title: t.contact.title, bg: "#ffffff" }
  ];

  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ fontFamily, minHeight: "100vh" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(78,168,142,0.95)" : "rgba(78,168,142,0.85)", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid #e5e5e5" : "none", transition: "all 0.3s", padding: scrolled ? "8px 0" : "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={onLogoClick}>
            <Logo size={34} />
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>KARO GROUP</span>
          </div>
          <div className="dnav" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily, padding: "3px 0", borderBottom: "2px solid transparent", transition: "all 0.3s" }} onMouseEnter={e=>e.target.style.borderBottomColor=PRIMARY} onMouseLeave={e=>e.target.style.borderBottomColor="transparent"}>{s.title}</button>
            ))}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontFamily }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
          <button className="mbtn" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", color: "#1c1917", cursor: "pointer" }}>{mobileMenu ? <I.X /> : <I.Menu />}</button>
        </div>
        {mobileMenu && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(255,255,255,0.98)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {sections.map(s => <button key={s.id} onClick={() => scrollTo(s.id)} style={{ background: "none", border: "none", color: "#1c1917", cursor: "pointer", fontSize: 14, textAlign: isRtl?"right":"left", padding: "5px 0", fontFamily }}>{s.title}</button>)}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
        )}
      </nav>

      {sections.map((section, index) => (


<section 
          key={section.id} 
          id={section.id} 
          style={{ 
            background: section.bg,
            position: "relative",
            overflow: "hidden",
            padding: index === 0 ? "120px 20px 80px" : "80px 20px"
          }}
        >
          {section.id === "home" && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.05, fontSize: 120, fontWeight: 900, color: PRIMARY, pointerEvents: "none" }}>
              KG
            </div>
          )}
          {section.id === "services" && (
            <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: `radial-gradient(circle, ${PRIMARY}10 0%, transparent 70%)` }} />
          )}
          {section.id === "about" && (
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", background: `repeating-linear-gradient(45deg, ${PRIMARY}05 0px, ${PRIMARY}05 10px, transparent 10px, transparent 20px)` }} />
          )}
          {section.id === "contact" && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", background: `radial-gradient(circle, ${PRIMARY}08 0%, transparent 70%)` }} />
          )}
          
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
            {section.id === "home" && (
              <>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                  <Logo size={80} />
                  <h1 style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: PRIMARY, marginBottom: 16 }}>{t.hero.title}</h1>
                  <p style={{ fontSize: "clamp(14px,2vw,18px)", color: "#666", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 30px" }}>{t.hero.subtitle}</p>
                  <button onClick={() => scrollTo("services")} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "14px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${PRIMARY}40` }}>{t.hero.cta}</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 15 }} className="project-grid">
                  {PROJECT_IMAGES.slice(0, 8).map((img, i) => (
                    <div key={i} onClick={() => setLightbox(img.src)} style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      <img src={img.src} alt="" style={{ width: "100%", height: "200px", objectFit: "cover", transition: "transform 0.4s" }} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
                      <p style={{ textAlign: "center", padding: "10px", background: "#fff", margin: 0, fontSize: 13, fontWeight: 600 }}>{img[`desc_${lang}`]}</p>
                    </div>
                  ))}
                </div>
              

                </>
            )}

            {section.id === "services" && (
              <>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: PRIMARY, textAlign: "center" }}>{t.services.title}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 25 }}>
                  {[t.services.s1, t.services.s2, t.services.s3].map((sv, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 30, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", borderTop: `4px solid ${PRIMARY}`, transition: "transform 0.3s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-5px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: PRIMARY, textAlign: "center" }}>{sv.name}</h3>
                      <p style={{ color: "#666", lineHeight: 1.8, fontSize: 14, textAlign: "center" }}>{sv.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{position:"relative",width:"100vw",marginLeft:"calc(-50vw + 50%)",marginRight:"calc(-50vw + 50%)",marginTop:60,height:450,overflow:"hidden"}}><img src="https://i.ibb.co/bMPHPf0r/363b24b2-f2b5-4dac-970d-d0d2017dcec7.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /><div style={{position:"absolute",bottom:15,left:15,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(2px)",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 14px",border:"none"}}><div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}><span style={{color:"#4EA88E",fontWeight:900,fontSize:11}}>KG</span></div><div style={{color:"#fff",fontSize:9,fontWeight:600,opacity:0.8}}>KARO GROUP</div><div style={{color:"rgba(255,255,255,0.9)",fontSize:10,direction:"ltr",marginTop:2,opacity:0.8}}>{PHONE}</div><div style={{color:"rgba(255,255,255,0.9)",fontSize:10,direction:"ltr",opacity:0.8}}>{EMAIL}</div></div></div>
                </>
            )}

            {section.id === "about" && (
              <>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: PRIMARY, textAlign: "center" }}>{t.about.title}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 800, margin: "0 auto" }}>
                  {t.about.items.map((item, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "20px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                      <span style={{ fontSize: 24, color: PRIMARY }}>✓</span>
                      <span style={{ fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {section.id === "contact" && (
              <>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: PRIMARY, textAlign: "center" }}>{t.contact.title}</h2>
                <div style={{ maxWidth: 500, margin: "0 auto" }}>
                  {[
                    { icon: <I.Phone />, label: t.contact.phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g,"")}` },
                    { icon: "💬", label: t.contact.whatsapp, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^0-9]/g,"")}` },
                    { icon: "📱", label: t.contact.viber, value: PHONE, href: `viber://chat?number=${PHONE.replace(/[^0-9]/g,"")}` },
                    { icon: <I.Mail />, label: t.contact.email, value: EMAIL, href: `mailto:${EMAIL}` },
                  ].map((c, i) => (
                    <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "15px 20px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, textDecoration: "none", color: "#1c1917", marginBottom: 10, transition: "border-color 0.3s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=PRIMARY} onMouseLeave={e=>e.currentTarget.style.borderColor="#e5e5e5"}>
                      <span style={{ color: PRIMARY }}>{c.icon}</span>
                      <span style={{ fontWeight: 600, minWidth: 80 }}>{c.label}:</span>
                      <span style={{ color: "#666" }}>{c.value}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      ))}

      <footer style={{ padding: "30px 20px", textAlign: "center", borderTop: "1px solid #e5e5e5" }}>
        <div onClick={onLogoClick} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <Logo size={26} />
          <span style={{ fontWeight: 700, color: PRIMARY, fontSize: 14 }}>KARO GROUP</span>
        </div>
        <p style={{ color: "#78716c", fontSize: 12 }}>© 2024 {t.footer.poweredBy}. {t.footer.rights}.</p>
      </footer>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={lightbox} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 8 }} />
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><I.X /></button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dnav { display: none !important; }
          .mbtn { display: flex !important; }
          .project-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 769px) {
          .mbtn { display: none !important; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; overflow-x: hidden; }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ==================== LOGIN ====================
function LoginPage({ t, s, isRtl, fontFamily, onLogin, onBack }) {
  const [u, setU] = useState(""); 
  const [p, setP] = useState(""); 
  const [err, setErr] = useState(false);
  
  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontFamily, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Logo size={70} />
          <h2 style={{ color: PRIMARY, marginTop: 15, fontSize: 22, fontWeight: 800 }}>{t.login}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", textAlign: "center", marginBottom: 5 }}>{t.username}</label>
            <input value={u} onChange={e=>{setU(e.target.value);setErr(false)}} style={{ width: "100%", padding: "7px 12px", borderRadius: 10, border: `1px solid ${err?"#EF4444":"#e5e5e5"}`, background: "#f8f8f8", fontSize: 14, outline: "none", direction: "ltr", textAlign: "center" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600, display: "block", textAlign: "center", marginBottom: 5 }}>{t.password}</label>
            <input type="password" value={p} onChange={e=>{setP(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&(onLogin(u,p)||setErr(true))} style={{ width: "100%", padding: "7px 12px", borderRadius: 10, border: `1px solid ${err?"#EF4444":"#e5e5e5"}`, background: "#f8f8f8", fontSize: 14, outline: "none", direction: "ltr", textAlign: "center" }} />
          </div>
          {err && <p style={{ color: "#EF4444", fontSize: 12, textAlign: "center" }}>{t.wrongLogin}</p>}
          <button onClick={()=>{if(!onLogin(u,p))setErr(true)}} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 5 }}>{t.enter}</button>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13, marginTop: 5 }}>← {t.nav.home}</button>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ t, s, isRtl, dark, lang, fontFamily, pKey, user, dashPage, setDashPage, onLogout, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, setExchangeRate, cashLog, setCashLog, addCashLog, setDark, setLang, fontIdx, setFontIdx, users, setUsers, isFrozen, messages, setMessages, unreadCount, markMessageAsRead }) {
  const [formatModal, setFormatModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fmtUser, setFmtUser] = useState(""); 
  const [fmtPass, setFmtPass] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: "", password: "", project: "", label: "", isAdmin: false, isFrozen: false });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ to: [], text: "" });
  const [showInbox, setShowInbox] = useState(false);

  const items = [
    { id: "reports", label: t.sidebar.reports, icon: <I.Chart /> },
    { id: "cash", label: t.sidebar.cash, icon: "🏦" },
    { id: "expenses", label: t.sidebar.expenses, icon: "💰" },
    { id: "loans", label: t.sidebar.loans, icon: "🤝" },
    { id: "concrete", label: t.sidebar.concrete, icon: "🏗️" },
    { id: "contractor", label: t.sidebar.contractor, icon: "👷" },
    { id: "exchange", label: t.sidebar.exchange, icon: "💱" },
    { id: "invoice", label: t.sidebar.invoice, icon: "📄" },
    { id: "backup", label: t.sidebar.backup, icon: "💾" },
    { id: "history", label: t.sidebar.history, icon: <I.Clock /> },
    { id: "monthly", label: t.sidebar.monthlyReport, icon: "📊" },
  ];

  if (user?.isAdmin) {
    items.push(
      { id: "users", label: t.sidebar.users, icon: "👥" },
      { id: "allProjects", label: t.sidebar.allProjects, icon: "📊" },
      { id: "messages", label: t.sidebar.messages, icon: <I.Bell /> }
    );
  }

  const doFormat = () => {
    if (fmtUser === "admin" && fmtPass === "karo2024") {
      // تەنها داتای پرۆژەی ئێستا بسڕەوە
      const keys = []; 
      for (let i = 0; i < localStorage.length; i++) { 
        const k = localStorage.key(i); 
        if (k?.startsWith("karo_") && k.includes(pKey)) keys.push(k); 
      }
      keys.forEach(k => localStorage.removeItem(k));
      setCashIQD(0); 
      setCashUSD(0); 
      setCashLog([]); 
      setExchangeRate(1500);
      setFormatModal(false); 
      setFmtUser(""); 
      setFmtPass("");
      alert(t.formatSuccess);
    }
  };

  const handleSaveUser = () => {
    if (!userForm.username || !userForm.password || !userForm.project || !userForm.label) return;
    
    if (editUser) {
      setUsers(prev => prev.map(u => u.username === editUser.username ? { ...userForm } : u));
    } else {
      setUsers(prev => [...prev, { ...userForm }]);
    }
    setShowUserForm(false);
    setEditUser(null);
    setUserForm({ username: "", password: "", project: "", label: "", isAdmin: false, isFrozen: false });
  };

  const handleDeleteUser = (username) => {
    if (username === "admin") {
      alert(t.adminRequired);
      return;
    }
    setUsers(prev => prev.filter(u => u.username !== username));
  };

  const handleToggleFreeze = (username) => {
    setUsers(prev => prev.map(u => 
      u.username === username ? { ...u, isFrozen: !u.isFrozen } : u
    ));
  };

  const handleSendMessage = () => {
    if (!messageForm.text || messageForm.to.length === 0) return;
    
    const newMessage = {
      id: genId(),
      from: "admin",
      to: messageForm.to,
      text: messageForm.text,
      date: today(),
      time: new Date().toLocaleTimeString(),
      read: false
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setMessageForm({ to: [], text: "" });
    setShowMessageModal(false);
  };

  const shared = { 
    t, s, isRtl, dark, lang, fontFamily, pKey, 
    cashIQD, setCashIQD, cashUSD, setCashUSD, 
    exchangeRate, setExchangeRate, cashLog, setCashLog, 
    addCashLog, isFrozen, users, messages, markMessageAsRead
  };

  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ display: "flex", minHeight: "100vh", background: s.bg, fontFamily, color: s.text }}>
<aside className={sidebarOpen ? "open" : ""} style={{ width: 280, minWidth: 280, background: "#f5f9f7", border: "1px solid rgba(78,168,142,0.3)", borderRadius: "0 24px 24px 0", borderLeft: "4px solid #4EA88E", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, [isRtl?"right":"left"]: 0, zIndex: 100, overflowY: "auto", boxShadow: "8px 0 30px rgba(0,0,0,0.08)" }}>
    {/* Logo Section - Curved */}
    <div style={{ textAlign: "center", padding: "15px 16px 12px", background: "#4EA88E", borderRadius: "0 0 50% 0", marginBottom: 10 }}>
      <div style={{ width: 45, height: 45, borderRadius: "50%", background: "rgba(255,255,255,0.95)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <span style={{ color: "#4EA88E", fontWeight: 900, fontSize: 18 }}>KG</span>
      </div>
      <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>KARO GROUP</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>{user.label || user.project}</div>
      {user.isAdmin && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 3 }}>Admin</div>}
    </div>


{/* Balance Card */}
{!user.isAdmin && (
  <div style={{ margin: "4px 12px", background: "#fff", border: "1px solid rgba(78,168,142,0.3)", borderRadius: 10, padding: 10, borderBottom: "2px solid #4EA88E", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: "#4EA88E", marginBottom: 6, textAlign: "center" }}>{t.cashBox}</div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 5, padding: "0 5px" }}>
      <span style={{ color: "#8aaa9e" }}>{t.iqd}:</span>
      <span style={{ fontWeight: 700, color: "#1a5c4a" }}>{fmt(cashIQD)}</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "0 5px" }}>
      <span style={{ color: "#8aaa9e" }}>{t.usd}:</span>
      <span style={{ fontWeight: 700, color: "#1a5c4a" }}>${fmt(cashUSD)}</span>
    </div>
  </div>
)}

{/* Unread Messages */}
{!user.isAdmin && unreadCount > 0 && (
  <div style={{ margin: "0 16px 10px", padding: 10, background: s.warning, color: "#fff", textAlign: "center", borderRadius: 8, cursor: "pointer" }} onClick={() => setShowInbox(true)}>
    <I.Bell /> {unreadCount} {t.unread}
  </div>
)}

{/* Navigation */}
<nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
  {items.map((p, index) => (
    <button
      key={p.id}
      onClick={() => setDashPage(p.id)}
      disabled={isFrozen && !user.isAdmin && p.id !== "reports" && p.id !== "cash" && p.id !== "history"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "7px 12px",
        borderRadius: dashPage===p.id ? "0 12px 12px 0" : "0",
        border: "none",
        background: dashPage===p.id ? "#4EA88E" : "transparent",
        color: dashPage===p.id ? "#fff" : "#4a7d6e",
        cursor: (isFrozen && !user.isAdmin && p.id !== "reports" && p.id !== "cash" && p.id !== "history") ? "not-allowed" : "pointer",
        fontSize: 13,
        fontWeight: 600,
        textAlign: isRtl?"right":"left",
        marginBottom: 1,
        opacity: (isFrozen && !user.isAdmin && p.id !== "reports" && p.id !== "cash" && p.id !== "history") ? 0.5 : 1,
        borderBottom: dashPage===p.id ? "none" : "1px solid rgba(78,168,142,0.1)",
        boxShadow: dashPage===p.id ? "0 3px 10px rgba(78,168,142,0.25)" : "none"
      }}
    >
      <span style={{ fontSize: 17, color: dashPage===p.id ? "#fff" : "#4EA88E" }}>{p.icon}</span>
      <span>{p.label}</span>
    </button>
  ))}
  {!user.isAdmin && (
    <button onClick={() => setShowInbox(true)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "7px 12px", borderRadius: 0, border: "none", background: "transparent", color: "#4a7d6e", cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 5, borderBottom: "1px solid rgba(78,168,142,0.1)" }}>
      <I.Bell /> {t.inbox} {unreadCount > 0 && `(${unreadCount})`}
    </button>
  )}
    <button onClick={() => setFormatModal(true)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "7px 12px", borderRadius: 0, border: "none", background: "transparent", color: "#e74c3c", cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 15, borderBottom: "1px solid rgba(78,168,142,0.1)" }}>
      🗑️ {t.sidebar.formatData}
    </button>
</nav>

{/* Bottom Section */}
<div style={{ padding: "4px 10px", borderTop: "1px solid rgba(78,168,142,0.2)" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
    <span style={{ color: "#1e293b", fontSize: 11, fontWeight: 500 }}>{t.font}:</span>
    <select value={fontIdx} onChange={e => setFontIdx(Number(e.target.value))} style={{ flex: 1, background: "#f8fafc", color: "#1e293b", border: "1px solid rgba(78,168,142,0.3)", borderRadius: 4, padding: "4px 6px", fontSize: 11 }}>
      {FONTS.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
    </select>
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
    <I.Globe />
    <select value={lang} onChange={e => setLang(e.target.value)} style={{ flex: 1, background: "#f8fafc", color: "#1e293b", border: "1px solid rgba(78,168,142,0.3)", borderRadius: 4, padding: "4px 6px", fontSize: 11 }}>
      <option value="ku">Kurdish</option>
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
  </div>
  <button onClick={() => setDark(!dark)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, width: "100%", padding: 6, borderRadius: 4, border: "1px solid rgba(78,168,142,0.3)", background: "#e8f5f0", color: "#4EA88E", cursor: "pointer", fontSize: 11, marginBottom: 5 }}>
    {dark?<I.Sun />:<I.Moon />} {dark?t.light:t.dark}
  </button>
  <button onClick={onLogout} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, width: "100%", padding: 6, borderRadius: 4, border: "none", background: "#fef2f2", color: "#e74c3c", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
    <I.Logout /> {t.logout}
  </button>
</div>


  </aside>

      <main style={{ 
        flex: 1, 
        [isRtl?"marginRight":"marginLeft"]: 280,
        padding: "0px 20px 20px 20px",
        minHeight: "100vh", 
        width: "calc(100vw - 280px)", 
        overflowX: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {isFrozen && !user.isAdmin && dashPage !== "reports" && dashPage !== "cash" && dashPage !== "history" && (
          <div style={{ background: s.warning, color: "#fff", padding: "10px 20px", borderRadius: 8, marginBottom: 15, textAlign: "center" }}>
            ⚠️ {t.frozen} - {t.adminRequired}
          </div>
        )}
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {dashPage === "reports" && <ReportsPage {...shared} />}
          {dashPage === "expenses" && <ExpensesPage {...shared} />}
          {dashPage === "loans" && <LoansPage {...shared} />}
          {dashPage === "concrete" && <ConcretePage {...shared} />}
          {dashPage === "contractor" && <ContractorPage {...shared} />}
          {dashPage === "exchange" && <ExchangePage {...shared} />}
          {dashPage === "invoice" && <InvoicePage {...shared} />}
          {dashPage === "backup" && <BackupPage {...shared} />}
          {dashPage === "history" && <HistoryPage {...shared} />}
          {dashPage === "monthly" && <MonthlyPage {...shared} />}
          {dashPage === "cash" && <CashPage {...shared} user={user} />}
          
          {dashPage === "users" && user?.isAdmin && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: PRIMARY }}>{t.sidebar.users}</h1>
                <button onClick={() => { setEditUser(null); setUserForm({ username: "", password: "", project: "", label: "", isAdmin: false, isFrozen: false }); setShowUserForm(true); }} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}><I.Plus /> {t.addUser}</button>
              </div>

              {showUserForm && (
                <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{editUser ? t.editUser : t.addUser}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.username}</label>
                      <input value={userForm.username} onChange={e=>setUserForm({...userForm,username:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.password}</label>
                      <input type="password" value={userForm.password} onChange={e=>setUserForm({...userForm,password:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.projectName}</label>
                      <input value={userForm.project} onChange={e=>setUserForm({...userForm,project:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.userLabel}</label>
                      <input value={userForm.label} onChange={e=>setUserForm({...userForm,label:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 15 }}>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600 }}>{t.isAdmin}</label>
                      <input type="checkbox" checked={userForm.isAdmin} onChange={e=>setUserForm({...userForm,isAdmin:e.target.checked})} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 15 }}>
                      <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600 }}>{t.freeze}</label>
                      <input type="checkbox" checked={userForm.isFrozen} onChange={e=>setUserForm({...userForm,isFrozen:e.target.checked})} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
                    <button onClick={handleSaveUser} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{editUser ? t.edit : t.save}</button>
                    <button onClick={() => { setShowUserForm(false); setEditUser(null); }} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
                  </div>
                </div>
              )}

              <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
                <div style={{ overflowX: "auto", height: "100%" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <TH isRtl={isRtl}>{t.username}</TH>
                        <TH isRtl={isRtl}>{t.projectName}</TH>
                        <TH isRtl={isRtl}>{t.userLabel}</TH>
                        <TH isRtl={isRtl}>{t.isAdmin}</TH>
                        <TH isRtl={isRtl}>{t.freeze}</TH>
                        <TH isRtl={isRtl}></TH>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.username}>
                          <TD s={s}>{u.username}</TD>
                          <TD s={s}>{u.project}</TD>
                          <TD s={s}>{u.label}</TD>
                          <TD s={s}>{u.isAdmin ? "✓" : ""}</TD>
                          <TD s={s}>
                            <span style={{ color: u.isFrozen ? s.danger : s.success, fontSize: 12, fontWeight: 600 }}>
                              {u.isFrozen ? t.frozen : t.active}
                            </span>
                          </TD>
                          <TD s={s}>
                            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                              <button onClick={() => { setEditUser(u); setUserForm(u); setShowUserForm(true); }} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer" }}><I.Edit /></button>
                              <button onClick={() => handleToggleFreeze(u.username)} style={{ background: "none", border: "none", color: u.isFrozen ? s.success : s.warning, cursor: "pointer" }}>
                                {u.isFrozen ? <I.Check /> : <I.Freeze />}
                              </button>
                              {u.username !== "admin" && (
                                <button onClick={() => handleDeleteUser(u.username)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer" }}><I.Trash /></button>
                              )}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {dashPage === "allProjects" && user?.isAdmin && (
            <AllProjectsPage {...shared} users={users} />
          )}

          {dashPage === "messages" && user?.isAdmin && (
            <AdminMessagesPage 
              t={t} s={s} isRtl={isRtl} 
              users={users} 
              messages={messages} 
              setMessages={setMessages}
              showMessageModal={showMessageModal}
              setShowMessageModal={setShowMessageModal}
              messageForm={messageForm}
              setMessageForm={setMessageForm}
              onSend={handleSendMessage}
            />
          )}
        </div>
      </main>

      {showInbox && !user.isAdmin && (
        <InboxModal
          t={t} s={s} isRtl={isRtl}
          messages={messages.filter(m => m.to.includes(user.project))}
          onClose={() => setShowInbox(false)}
          onMarkAsRead={markMessageAsRead}
        />
      )}

      {formatModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: s.bgCard, borderRadius: 14, padding: 28, maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}><I.Warn /></div>
            <p style={{ fontSize: 13, marginBottom: 16, color: s.text, lineHeight: 1.6 }}>{t.formatConfirm}</p>
            <input placeholder={t.username} value={fmtUser} onChange={e=>setFmtUser(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 8, direction: "ltr", textAlign: "center" }} />
            <input type="password" placeholder={t.password} value={fmtPass} onChange={e=>setFmtPass(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 14, direction: "ltr", textAlign: "center" }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={doFormat} style={{ background: s.danger, color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t.delete}</button>
              <button onClick={() => setFormatModal(false)} style={{ background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 6, padding: "8px 20px", fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; }
        tbody tr:hover { background: rgba(78,168,142,0.28) !important; cursor: pointer; transition: background 0.2s; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${PRIMARY}60; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: ${s.bgCard2}; }
        @media print {
          aside, .noprint { display: none !important; }
          main { margin: 0 !important; padding: 8px !important; width: 100% !important; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @media (max-width: 768px) {
          aside { width: 260px !important; min-width: 260px !important; transform: translateX(100%); transition: transform 0.3s; }
          aside.open { transform: translateX(0) !important; }
          main { margin-left: 0 !important; width: 100vw !important; }
          .menu-toggle { display: flex !important; }
        }
          aside { width: 280px !important; min-width: 280px !important; }
          main { margin-left: 280px !important; width: calc(100vw - 280px) !important; }
        }
      `}</style>
    </div>
  );
}

// ==================== REPORTS (NEW DARK DESIGN) ====================
function ReportsPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate, isFrozen }) {
const exp = getLS(`karo_exp_${pKey}`, []);
const loans = getLS(`karo_loans_${pKey}`, []);
const conc = getLS(`karo_conc_${pKey}`, []);

const tExpIQD = exp.reduce((a,b) => a + Number(b.amountIQD||0), 0);
const tExpUSD = exp.reduce((a,b) => a + Number(b.amountUSD||0), 0);
const tConcRec = conc.reduce((a,b) => a + Number(b.received||0), 0);
const tConcDep = conc.reduce((a,b) => a + Number(b.deposit||0), 0);
const tLoanTake = loans.filter(l=>l.type==="take").reduce((a,b)=>a+Number(b.amountIQD||0),0);
const tLoanGive = loans.filter(l=>l.type==="give").reduce((a,b)=>a+Number(b.amountIQD||0),0);
const totalInIQD = Math.round(cashIQD + cashUSD * exchangeRate);

const monthlyData = useMemo(() => {
const months = {};
const now = new Date();
for (let i = 5; i >= 0; i--) {
const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
const mNames = ["1","2","3","4","5","6","7","8","9","10","11","12"];
months[key] = { label: mNames[d.getMonth()], exp: 0, conc: 0 };
}
exp.forEach(e => { const m = e.date?.slice(0,7); if (months[m]) months[m].exp += Number(e.amountIQD||0); });
conc.forEach(c => { const m = c.date?.slice(0,7); if (months[m]) months[m].conc += Number(c.received||0); });
return Object.values(months);
}, [exp, conc]);

const chartMax = Math.max(1, ...monthlyData.map(m => Math.max(m.exp, m.conc)));

const cards = [
{ label: t.cashIQD, val: fmt(cashIQD), unit: t.iqd, raw: Math.abs(cashIQD), c: cashIQD>=0 ? "#22C55E" : "#EF4444", gradient: "linear-gradient(135deg, #2a3d2a 0%, #1f3020 50%, #2a4a35 100%)", icon: "M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z" },
{ label: t.cashUSD, val: "$"+fmt(cashUSD), unit: "USD", raw: Math.abs(cashUSD), c: cashUSD>=0 ? "#22C55E" : "#EF4444", gradient: "linear-gradient(135deg, #1a1a2a 0%, #0d0d2a 50%, #1a2a3a 100%)", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
{ label: t.totalInIQD, val: fmt(totalInIQD), unit: t.iqd, raw: Math.abs(totalInIQD), c: "#4DAF94", gradient: "linear-gradient(135deg, #1f3d35 0%, #2a5045 50%, #1f4038 100%)", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
{ label: t.totalExpIQD, val: fmt(tExpIQD), unit: t.iqd, raw: tExpIQD, c: "#F59E0B", gradient: "linear-gradient(135deg, #3d3218 0%, #4d3d1a 50%, #3e3218 100%)", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
{ label: t.totalExpUSD, val: "$"+fmt(tExpUSD), unit: "USD", raw: tExpUSD, c: "#F97316", gradient: "linear-gradient(135deg, #3d2818 0%, #4d321a 50%, #3e2a18 100%)", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
{ label: t.totalConcreteReceived, val: fmt(tConcRec), unit: "", raw: tConcRec, c: "#06B6D4", gradient: "linear-gradient(135deg, #1a3242 0%, #1f3d50 50%, #1a3240 100%)", icon: "M4 4h16v16H4z M4 10h16 M4 14h16" },
{ label: t.totalDeposit, val: fmt(tConcDep), unit: "", raw: tConcDep, c: "#A855F7", gradient: "linear-gradient(135deg, #321a42 0%, #3d1f50 50%, #321a40 100%)", icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" },
{ label: t.loanTake, val: fmt(tLoanTake), unit: "", raw: tLoanTake, c: "#10B981", gradient: "linear-gradient(135deg, #1a3d2a 0%, #1f5032 50%, #1a402a 100%)", icon: "M12 5v14M5 12l7 7 7-7" },
{ label: t.loanGive, val: fmt(tLoanGive), unit: "", raw: tLoanGive, c: "#EF4444", gradient: "linear-gradient(135deg, #3d1a1a 0%, #501f1f 50%, #401a1a 100%)", icon: "M12 19V5M5 12l7-7 7 7" },
];

const maxRaw = Math.max(1, ...cards.map(c => c.raw));

return (
<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
<h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 22, color: "#fff", textAlign: "center", textShadow: "0 2px 10px rgba(0,0,0,0.3)", background: "linear-gradient(135deg, #2a2a40 0%, #263350 100%)", padding: "18px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
<span style={{ background: "linear-gradient(90deg, #4DAF94, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.reportsTitle}</span>
</h1>
{isFrozen && (
<div style={{ background: "linear-gradient(135deg, #78350f, #92400e)", color: "#FDE68A", padding: "10px 18px", borderRadius: 10, marginBottom: 15, textAlign: "center", fontSize: 13, fontWeight: 600, border: "1px solid rgba(245,158,11,0.3)" }}>
{t.frozen} - {t.adminRequired}
</div>
)}


  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 22 }}>
    {cards.map((c, i) => {
      const pct = maxRaw > 0 ? Math.min((c.raw / maxRaw) * 100, 100) : 0;
      return (
        <div key={i} style={{
          background: c.gradient,
          borderRadius: 16,
          padding: "20px 18px 16px",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${c.c}25`,
          boxShadow: `0 4px 24px ${c.c}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
          transition: "transform 0.25s, box-shadow 0.25s",
          cursor: "default",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${c.c}30, inset 0 1px 0 rgba(255,255,255,0.08)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${c.c}15, inset 0 1px 0 rgba(255,255,255,0.05)`; }}
        >
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: `linear-gradient(180deg, transparent 0%, ${c.c}08 100%)`, borderRadius: "0 0 16px 16px", pointerEvents: "none" }} />
          <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.06, pointerEvents: "none" }} viewBox="0 0 240 60" preserveAspectRatio="none" width="100%" height="60">
            <path d={`M0 40 Q60 ${20+i*3} 120 35 T240 30 V60 H0 Z`} fill={c.c} />
            <path d={`M0 50 Q80 ${30+i*2} 160 45 T240 40 V60 H0 Z`} fill={c.c} opacity="0.5" />
          </svg>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative", zIndex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.c}20`, border: `1px solid ${c.c}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={c.icon} />
              </svg>
            </div>
            <div style={{ fontSize: 11, color: `${c.c}90`, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: `${c.c}10`, border: `1px solid ${c.c}15` }}>
              {c.unit || "IQD"}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.3px" }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.c, direction: "ltr", textShadow: `0 0 20px ${c.c}40`, marginBottom: 12, lineHeight: 1 }}>{c.val}</div>

            <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`,
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(90deg, ${c.c}90, ${c.c})`,
                boxShadow: `0 0 8px ${c.c}50`,
                transition: "width 1s ease-out",
              }} />
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <div style={{
    background: "linear-gradient(135deg, #2a2a40 0%, #263350 50%, #1f2738 100%)",
    borderRadius: 16,
    padding: "22px 20px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
    flex: 1,
    minHeight: 220,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4DAF94" strokeWidth="2" style={{ verticalAlign: "middle", marginInlineEnd: 8 }}>
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        {t.sidebar.expenses} / {t.sidebar.concrete}
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#F59E0B" }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{t.sidebar.expenses}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#06B6D4" }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{t.sidebar.concrete}</span>
        </div>
      </div>
    </div>

    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, padding: "0 5px" }}>
      {monthlyData.map((m, i) => {
        const expH = chartMax > 0 ? (m.exp / chartMax) * 130 : 0;
        const concH = chartMax > 0 ? (m.conc / chartMax) * 130 : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 130 }}>
              <div style={{
                width: "clamp(12px, 3vw, 22px)",
                height: Math.max(4, expH),
                borderRadius: "4px 4px 1px 1px",
                background: "linear-gradient(180deg, #F59E0B, #D97706)",
                boxShadow: "0 0 8px rgba(245,158,11,0.3)",
                transition: "height 0.8s ease-out",
                position: "relative",
              }}>
                {m.exp > 0 && <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#F59E0B", fontWeight: 700, whiteSpace: "nowrap", direction: "ltr" }}>{fmt(m.exp/1000)}k</div>}
              </div>
              <div style={{
                width: "clamp(12px, 3vw, 22px)",
                height: Math.max(4, concH),
                borderRadius: "4px 4px 1px 1px",
                background: "linear-gradient(180deg, #06B6D4, #0891B2)",
                boxShadow: "0 0 8px rgba(6,182,212,0.3)",
                transition: "height 0.8s ease-out",
                position: "relative",
              }}>
                {m.conc > 0 && <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#06B6D4", fontWeight: 700, whiteSpace: "nowrap", direction: "ltr" }}>{fmt(m.conc/1000)}k</div>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 4 }}>{m.label}</div>
          </div>
        );
      })}
    </div>
  </div>
</div>


);
}

// ==================== ALL PROJECTS PAGE ====================
function AllProjectsPage({ t, s, isRtl, users }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const allData = [];
    users.filter(u => !u.isAdmin).forEach(user => {
      const pKey = user.project;
      const exp = getLS(`karo_exp_${pKey}`, []);
      const conc = getLS(`karo_conc_${pKey}`, []);
      
      exp.forEach(e => {
        allData.push({
          ...e,
          project: user.label,
          projectKey: pKey,
          type: "expense"
        });
      });
      
      conc.forEach(c => {
        allData.push({
          ...c,
          project: user.label,
          projectKey: pKey,
          type: "concrete"
        });
      });
    });
    setData(allData);
  }, [users]);

  const months = [...new Set(data.map(i => i.date?.slice(0,7)))].sort().reverse();
  
  const filtered = data.filter(i => {
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (selectedMonth && !i.date?.startsWith(selectedMonth)) return false;
    return true;
  });

  const totalIQD = filtered.reduce((a,b) => a + Number(b.amountIQD||0), 0);
  const totalUSD = filtered.reduce((a,b) => a + Number(b.amountUSD||0), 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.sidebar.allProjects}</h1>
        
        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "10px 20px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 12 }}>{t.totalExpIQD}: </span>
            <strong style={{ color: s.danger, fontSize: 16 }}>{fmt(totalIQD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "10px 20px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 12 }}>{t.totalExpUSD}: </span>
            <strong style={{ color: s.danger, fontSize: 16 }}>${fmt(totalUSD)}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <input 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
              placeholder={t.search}
              style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, outline: "none", textAlign: "center" }} 
            />
          </div>
          <div>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} style={{ padding: "10px 20px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center", minWidth: 140 }}>
              <option value="">{t.allMonths}</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </StickyHeader>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.projectName}</TH>
                <TH isRtl={isRtl}>{t.type}</TH>
                <TH isRtl={isRtl}>{t.amountIQD}</TH>
                <TH isRtl={isRtl}>{t.amountUSD}</TH>
                <TH isRtl={isRtl}>{t.note}</TH>
                <TH isRtl={isRtl}>{t.date}</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <TD s={s} style={{ fontWeight: 600, color: PRIMARY }}>{item.project}</TD>
                  <TD s={s}>
                    <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: item.type === "expense" ? "#FEE2E2" : "#D1FAE5", color: item.type === "expense" ? "#EF4444" : "#059669" }}>
                      {item.type === "expense" ? t.expense : t.concrete}
                    </span>
                  </TD>
                  <TD s={s} style={{ direction: "ltr" }}>{Number(item.amountIQD)?fmt(item.amountIQD):"-"}</TD>
                  <TD s={s} style={{ direction: "ltr" }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"-"}</TD>
                  <TD s={s}>{item.note || "-"}</TD>
                  <TD s={s} style={{ direction: "ltr" }}>{item.date}</TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 50, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </div>
    </div>
  );
}

// ==================== ADMIN MESSAGES PAGE ====================
function AdminMessagesPage({ t, s, isRtl, users, messages, setMessages, showMessageModal, setShowMessageModal, messageForm, setMessageForm, onSend }) {
  const nonAdminUsers = users.filter(u => !u.isAdmin);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: PRIMARY }}>{t.sidebar.messages}</h1>
        <button onClick={() => setShowMessageModal(true)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <I.Send /> {t.sendMessage}
        </button>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.date}</TH>
                <TH isRtl={isRtl}>{t.to}</TH>
                <TH isRtl={isRtl}>{t.message}</TH>
                <TH isRtl={isRtl}>{t.status}</TH>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id}>
                  <TD s={s} style={{ direction: "ltr" }}>{msg.date} {msg.time}</TD>
                  <TD s={s}>
                    {msg.to.map(p => {
                      const user = users.find(u => u.project === p);
                      return user ? user.label : p;
                    }).join(", ")}
                  </TD>
                  <TD s={s} style={{ maxWidth: 300 }}>{msg.text}</TD>
                  <TD s={s}>
                    {msg.read ? (
                      <span style={{ color: s.success }}>{t.read}</span>
                    ) : (
                      <span style={{ color: s.warning }}>{t.unread}</span>
                    )}
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && <div style={{ padding: 50, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </div>

      {showMessageModal && (
        <EditModal title={t.newMessage} onSave={onSend} onCancel={() => { setShowMessageModal(false); setMessageForm({ to: [], text: "" }); }} s={s} t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.selectProjects}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxHeight: 150, overflowY: "auto", padding: 10, border: `1px solid ${s.border}`, borderRadius: 6 }}>
                {nonAdminUsers.map(u => (
                  <label key={u.project} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: messageForm.to.includes(u.project) ? `${PRIMARY}20` : s.bgCard2, borderRadius: 20, cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      value={u.project} 
                      checked={messageForm.to.includes(u.project)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMessageForm({ ...messageForm, to: [...messageForm.to, u.project] });
                        } else {
                          setMessageForm({ ...messageForm, to: messageForm.to.filter(p => p !== u.project) });
                        }
                      }}
                      style={{ marginRight: 3 }}
                    />
                    {u.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.message}</label>
              <textarea 
                value={messageForm.text} 
                onChange={e => setMessageForm({ ...messageForm, text: e.target.value })}
                rows={4}
                style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, resize: "vertical" }}
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}

// ==================== INBOX MODAL ====================
function InboxModal({ t, s, isRtl, messages, onClose, onMarkAsRead }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 24, maxWidth: 600, width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: PRIMARY }}>{t.inbox}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}><I.X /></button>
        </div>
        
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: s.textMuted, padding: 30 }}>{t.noData}</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ 
              padding: 15, 
              marginBottom: 10, 
              background: msg.read ? s.bgCard2 : `${PRIMARY}10`, 
              borderRadius: 8,
              borderLeft: msg.read ? "none" : `3px solid ${PRIMARY}`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: s.textMuted }}>{msg.date} {msg.time}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: PRIMARY }}>{t.fromAdmin}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{msg.text}</p>
              {!msg.read && (
                <button 
                  onClick={() => onMarkAsRead(msg.id)}
                  style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: PRIMARY, color: "#fff", fontSize: 11, cursor: "pointer" }}
                >
                  {t.markAsRead}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== EXPENSES ====================
function ExpensesPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog, isFrozen }) {
  const KEY = `karo_exp_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ amountIQD: "", amountUSD: "", receiptNo: "", note: "", date: today(), receiptImg: "" });
  const [search, setSearch] = useState(""); 
  const [filterMonth, setFilterMonth] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [alert, setAlert] = useState(null); 
  const [sizeModal, setSizeModal] = useState(null); 
  const [imgPreview, setImgPreview] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const months = [...new Set(items.map(i => i.date?.slice(0,7)))].sort().reverse();
  
  const filtered = items.filter(i => {
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });
  
  const totalIQD = filtered.reduce((a,b) => a+Number(b.amountIQD||0), 0);
  const totalUSD = filtered.reduce((a,b) => a+Number(b.amountUSD||0), 0);

  const resetForm = () => { 
    setForm({ amountIQD: "", amountUSD: "", receiptNo: "", note: "", date: today(), receiptImg: "" }); 
    setEditItem(null); 
  };

  const handleSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd === 0 && usd === 0) return;
    
    if (editItem) {
      const old = items.find(i => i.id === editItem.id);
      if (old) {
        const diffIQD = Number(old.amountIQD||0) - iqd;
        const diffUSD = Number(old.amountUSD||0) - usd;
        if (diffIQD < 0 && Math.abs(diffIQD) > cashIQD) { setAlert(t.noBalance); return; }
        if (diffUSD < 0 && Math.abs(diffUSD) > cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(prev => prev + diffIQD); 
        setCashUSD(prev => prev + diffUSD);
        addCashLog(`${t.edit} ${t.sidebar.expenses}`, diffIQD, diffUSD);
      }
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form } : i));
      setEditModalOpen(false);
    } else {
      if (iqd > 0 && cashIQD < iqd) { setAlert(t.noBalance); return; }
      if (usd > 0 && cashUSD < usd) { setAlert(t.noBalance); return; }
      setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);
      if (iqd > 0) setCashIQD(prev => prev - iqd);
      if (usd > 0) setCashUSD(prev => prev - usd);
      addCashLog(`${t.sidebar.expenses}: ${form.note||form.receiptNo}`, -iqd, -usd);
      setShowForm(false);
    }
    resetForm(); 
  };

  const doDelete = (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);
    if (item) { 
      setCashIQD(prev => prev + Number(item.amountIQD||0)); 
      setCashUSD(prev => prev + Number(item.amountUSD||0)); 
      addCashLog(`${t.delete} ${t.sidebar.expenses}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); 
    }
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirmDel(null);
  };

  const handleEdit = (item) => { 
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    setForm(item); 
    setEditItem(item); 
    setEditModalOpen(true); 
  };
  
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id ? {...i, marked: !i.marked} : i));

  const handleImgUpload = e => { 
    const f = e.target.files[0]; 
    if (!f) return; 
    const r = new FileReader(); 
    r.onload = ev => setForm(prev => ({...prev, receiptImg: ev.target.result})); 
    r.readAsDataURL(f); 
  };

  const handleImportExcel = e => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      
      const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase());
      
      const findIndex = (keywords) => {
        for (let i = 0; i < headers.length; i++) {
          for (const kw of keywords) {
            if (headers[i].includes(kw)) return i;
          }
        }
        return -1;
      };
      
      const iqdIdx = findIndex(["دینار", "iqd", "amount iqd", "بڕ بە دینار"]);
      const usdIdx = findIndex(["دۆلار", "usd", "amount usd", "بڕ بە دۆلار"]);
      const receiptIdx = findIndex(["وەسڵ", "receipt", "ژمارە"]);
      const noteIdx = findIndex(["تێبینی", "note", "ملاحظة"]);
      const dateIdx = findIndex(["بەروار", "date", "تاریخ"]);
      
      const newItems = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
        if (cols.length < 2) continue;
        
        const amountIQD = iqdIdx >= 0 ? Number(cols[iqdIdx]?.replace(/[^0-9.-]/g, "") || 0) : 0;
        const amountUSD = usdIdx >= 0 ? Number(cols[usdIdx]?.replace(/[^0-9.-]/g, "") || 0) : 0;
        const receiptNo = receiptIdx >= 0 ? cols[receiptIdx] || "" : "";
        let note = noteIdx >= 0 ? cols[noteIdx] || "" : "";
        let date = dateIdx >= 0 ? cols[dateIdx] || "" : today();
        
        if (date.includes("/")) {
          const parts = date.split("/");
          if (parts.length === 3) {
            date = `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
          }
        }
        
        if (amountIQD > 0 || amountUSD > 0) {
          newItems.push({
            id: genId(),
            amountIQD: amountIQD || "",
            amountUSD: amountUSD || "",
            receiptNo,
            note,
            date,
            receiptImg: "",
            marked: false
          });
          
          if (amountIQD > 0 && cashIQD < amountIQD) {
            setAlert(t.noBalance);
            return;
          }
          if (amountUSD > 0 && cashUSD < amountUSD) {
            setAlert(t.noBalance);
            return;
          }
          
          if (amountIQD > 0) setCashIQD(prev => prev - amountIQD);
          if (amountUSD > 0) setCashUSD(prev => prev - amountUSD);
          addCashLog(`${t.importExcel}: ${note || receiptNo}`, -amountIQD, -amountUSD);
        }
      }
      
      setItems(prev => [...newItems, ...prev]);
      e.target.value = "";
    };
    
    reader.readAsText(file);
  };

  const doExport = (type, size) => {
    const hdrs = [t.amountIQD, t.amountUSD, t.receiptNo, t.note, t.date];
    const rows = filtered.map(i => [fmt(i.amountIQD||0), fmt(i.amountUSD||0), i.receiptNo||"", i.note||"", i.date||""]);
    const tr = [fmt(totalIQD), fmt(totalUSD), "", t.total, ""];
    if (type==="pdf") doPrint({ title: t.sidebar.expenses, headers: hdrs, rows, totalRow: tr, size, isRtl });
    else doExcel({ title: "expenses", headers: hdrs, rows, totalRow: tr });
    setSizeModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.expenses}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".csv,.txt" 
              onChange={handleImportExcel} 
              style={{ display: "none" }} 
            />
            <button onClick={() => fileInputRef.current?.click()} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <I.Upload /> {t.importExcel}
            </button>
            <button onClick={() => setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
            <button onClick={() => setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
            {!isFrozen && (
              <button onClick={() => { setShowForm(!showForm); resetForm(); }} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.total} {t.iqd}: </span>
            <strong style={{ color: PRIMARY, fontSize: 15 }}>{fmt(totalIQD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.total} {t.usd}: </span>
            <strong style={{ color: PRIMARY, fontSize: 15 }}>${fmt(totalUSD)}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, outline: "none", textAlign: "center" }} />
          </div>
          <div>
            <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center", minWidth: 120 }}>
              <option value="">{t.allMonths}</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {showMarkedOnly
            ? <button onClick={() => { setShowMarkedOnly(false); setItems(prev => prev.map(i => ({...i, marked: false}))); }} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
            : <button onClick={() => setShowMarkedOnly(true)} style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.showMarked}</button>
          }
        </div>

      </StickyHeader>

      {!isFrozen && showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.add}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form, amountIQD: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form, amountUSD: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.receiptNo}</label>
              <input value={form.receiptNo} onChange={e=>setForm({...form, receiptNo: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form, note: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.receiptImg}</label>
              <label style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 6, border: `1px dashed ${s.border}`, background: s.bgCard2, cursor: "pointer", fontSize: 12, color: s.textMuted, justifyContent: "center" }}>
                <I.Upload /> {t.receiptImg}
                <input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
              </label>
              {form.receiptImg && <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, justifyContent: "center" }}>
                <img src={form.receiptImg} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                <button onClick={()=>setForm(p=>({...p,receiptImg:""}))} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", fontSize: 11 }}>{t.removeImg}</button>
              </div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
            <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.amountIQD}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.amountUSD}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.receiptNo}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.note}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.receiptImg}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}>{t.mark}</TH>
                <TH isRtl={isRtl} style={{ textAlign: "center" }}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ background: item.marked?`${PRIMARY}06`:"transparent", textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 90 }}>{Number(item.amountIQD)?fmt(item.amountIQD):"-"}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 80 }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"-"}</TD>
                  <TD s={s} style={{ minWidth: 80 }}>{item.receiptNo || "-"}</TD>
                  <TD s={s} style={{ minWidth: 120, maxWidth: 200 }} title={item.note}>{trunc(item.note, 30) || "-"}</TD>
                  <TD s={s} style={{ direction: "ltr", minWidth: 95 }}>{item.date}</TD>
                  <TD s={s} style={{ minWidth: 40 }}>{item.receiptImg ? <img src={item.receiptImg} alt="" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4, cursor: "pointer", margin: "0 auto" }} onClick={()=>setImgPreview(item.receiptImg)} /> : "-"}</TD>
                  <TD s={s} style={{ minWidth: 35 }}>
                    <button onClick={()=>toggleMark(item.id)} style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto" }}>
                      {item.marked&&<I.Check />}
                    </button>
                  </TD>
                  <TD s={s} style={{ minWidth: 60 }}>
                    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                      <button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                      <button onClick={()=>setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted, fontSize: 13 }}>{t.noData}</div>}
        </div>
      </div>

      {editModalOpen && (
        <EditModal title={t.edit} onSave={handleSave} onCancel={() => { setEditModalOpen(false); resetForm(); }} s={s} t={t}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form, amountIQD: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form, amountUSD: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.receiptNo}</label>
              <input value={form.receiptNo} onChange={e=>setForm({...form, receiptNo: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form, note: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
          </div>
        </EditModal>
      )}

      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={()=>doDelete(confirmDel)} onNo={()=>setConfirmDel(null)} s={s} t={t} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
      {imgPreview && <div onClick={()=>setImgPreview(null)} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 16 }}><img src={imgPreview} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 6 }} /></div>}
    </div>
  );
}

// ==================== CASH ====================
function CashPage({ t, s, isRtl, pKey, exchangeRate, user, addCashLog, cashIQD, setCashIQD, cashUSD, setCashUSD }) {
  // cashIQD and cashUSD come from props
  // cashUSD comes from props
  const cashLog = getLS("karo_cashLog_" + pKey, []);
  const [editIQD, setEditIQD] = useState(false); 
  const [editUSD, setEditUSD] = useState(false);
  const [tmpIQD, setTmpIQD] = useState(cashIQD); 
  const [tmpUSD, setTmpUSD] = useState(cashUSD);
  const [adminModal, setAdminModal] = useState(false);
  const [editType, setEditType] = useState(null);

  const handleEditClick = (type) => {
    if (editIQD || editUSD) return;
    if (user?.isAdmin) {
      if (type === 'iqd') {
        setEditIQD(true);
        setTmpIQD(cashIQD);
      } else {
        setEditUSD(true);
        setTmpUSD(cashUSD);
      }
    } else {
      setEditType(type);
      setAdminModal(true);
    }
  };

  const handleAdminConfirm = () => {
    setAdminModal(false);
    if (editType === 'iqd') {
      setEditIQD(true);
      setTmpIQD(cashIQD);
    } else {
      setEditUSD(true);
      setTmpUSD(cashUSD);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: PRIMARY, textAlign: "center" }}>{t.sidebar.cash}</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 15, marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #2a3d2a, #1f3020, #2a4a35)", borderRadius: 16, padding: "20px 18px", overflow: "hidden", border: "1px solid rgba(34,197,94,0.15)", boxShadow: "0 4px 24px rgba(34,197,94,0.08)", cursor: "pointer", textAlign: "center" }} onClick={() => handleEditClick("iqd")}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 6 }}>{t.cashIQD}</div>
          {editIQD ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <input type="number" value={tmpIQD} onChange={e=>setTmpIQD(Number(e.target.value))} style={{ width: 140, padding: "8px 12px", borderRadius: 6, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 16, textAlign: "center", direction: "ltr" }} autoFocus />
              <button onClick={e=>{e.stopPropagation();addCashLog("edit cashIQD: "+tmpIQD,tmpIQD-cashIQD,0);setCashIQD(tmpIQD);setLS("karo_cashIQD_" + pKey, tmpIQD);setEditIQD(false)}} style={{ padding: "8px 16px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 13, cursor: "pointer" }}>{t.save}</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#22C55E", direction: "ltr", textShadow: "0 0 20px rgba(34,197,94,0.4)" }}>{fmt(cashIQD)}</div>
              <div style={{ fontSize: 11, color: s.textMuted, marginTop: 5 }}>{t.clickToChange}</div>
            </>
          )}
        </div>
        
        <div style={{ background: "linear-gradient(135deg, #1a1a2a, #0d0d2a, #1a2a3a)", borderRadius: 16, padding: "20px 18px", overflow: "hidden", border: "1px solid rgba(34,197,94,0.15)", boxShadow: "0 4px 24px rgba(34,197,94,0.08)", cursor: "pointer", textAlign: "center" }} onClick={() => handleEditClick("usd")}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 6 }}>{t.cashUSD}</div>
          {editUSD ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <input type="number" value={tmpUSD} onChange={e=>setTmpUSD(Number(e.target.value))} style={{ width: 140, padding: "8px 12px", borderRadius: 6, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 16, textAlign: "center", direction: "ltr" }} autoFocus />
              <button onClick={e=>{e.stopPropagation();addCashLog("edit cashUSD: "+tmpUSD,0,tmpUSD-cashUSD);setCashUSD(tmpUSD);setLS("karo_cashUSD_" + pKey, tmpUSD);setEditUSD(false)}} style={{ padding: "8px 16px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 13, cursor: "pointer" }}>{t.save}</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#22C55E", direction: "ltr", textShadow: "0 0 20px rgba(34,197,94,0.4)" }}>${fmt(cashUSD)}</div>
              <div style={{ fontSize: 11, color: s.textMuted, marginTop: 5 }}>{t.clickToChange}</div>
            </>
          )}
        </div>
        
        <div style={{ background: "linear-gradient(135deg, #1f3d35, #2a5045, #1f4038)", borderRadius: 16, padding: "20px 18px", overflow: "hidden", border: "1px solid rgba(77,175,148,0.15)", boxShadow: "0 4px 24px rgba(77,175,148,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 6 }}>{t.totalInIQD}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{fmt(Math.round(cashIQD+cashUSD*exchangeRate))}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>1$ = {fmt(exchangeRate)} {t.iqd}</div>
        </div>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <h3 style={{ padding: "15px 15px 5px", fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 5 }}>{t.cashLog}</h3>
        <div style={{ overflowX: "auto", height: "calc(100% - 50px)" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.date}</TH>
                <TH isRtl={isRtl}>{t.type}</TH>
                <TH isRtl={isRtl}>{t.iqd}</TH>
                <TH isRtl={isRtl}>{t.usd}</TH>
              </tr>
            </thead>
            <tbody>
              {[...cashLog].reverse().map(log => (
                <tr key={log.id} style={{ textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", fontSize: 12, minWidth: 85 }}>{log.date} {log.time}</TD>
                  <TD s={s} style={{ minWidth: 200 }}>{log.desc}</TD>
                  <TD s={s} style={{ direction: "ltr", color: log.iqd>=0?s.success:s.danger, fontWeight: 600, minWidth: 80 }}>
                    {log.iqd>=0?"+":""}{fmt(log.iqd)}
                  </TD>
                  <TD s={s} style={{ direction: "ltr", color: log.usd>=0?s.success:s.danger, fontWeight: 600, minWidth: 70 }}>
                    {log.usd>=0?"+":""}${fmt(log.usd)}
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {cashLog.length === 0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </div>

      {adminModal && (
        <AdminModal 
          message={t.enterAdminCredentials} 
          onConfirm={handleAdminConfirm} 
          onCancel={() => setAdminModal(false)} 
          s={s} 
          t={t} 
        />
      )}
    </div>
  );
}

// ==================== LOANS ====================
function LoansPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog, isFrozen }) {
  const KEY = `karo_loans_${pKey}`;
  const PERSONS_KEY = `karo_loanPersons_${pKey}`;
  
  const [items, setItems] = useState(getLS(KEY, []));
  const [personsList, setPersonsList] = useState(getLS(PERSONS_KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today(), returned: false });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [sizeModal, setSizeModal] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [confirmReturn, setConfirmReturn] = useState(null);
  const [viewTab, setViewTab] = useState("loans");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PERSONS_KEY, personsList); }, [personsList, PERSONS_KEY]);

  useEffect(() => {
    const namesFromItems = [...new Set(items.map(i => i.personName).filter(name => name && name.trim() !== ""))];
    const merged = [...new Set([...personsList, ...namesFromItems])];
    if (merged.length !== personsList.length) setPersonsList(merged);
  }, [items]);

  const months = [...new Set(items.map(i => i.date?.slice(0,7)))].sort().reverse();

  const filtered = items.filter(i => {
    if (selectedPerson === "") return true;
    return i.personName === selectedPerson;
  }).filter(i => {
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });
  const totalTakeIQD = filtered.filter(l=>l.type==="take"&&!l.returned).reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const totalTakeUSD = filtered.filter(l=>l.type==="take"&&!l.returned).reduce((a,b)=>a+Number(b.amountUSD||0),0);
  const totalGiveIQD = filtered.filter(l=>l.type==="give"&&!l.returned).reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const totalGiveUSD = filtered.filter(l=>l.type==="give"&&!l.returned).reduce((a,b)=>a+Number(b.amountUSD||0),0);


  const resetForm = () => { 
    setForm({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today(), returned: false }); 
    setEditItem(null); 
    setNewPerson(""); 
  };

  const handleAddPerson = () => {
    if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
      setPersonsList(prev => [...prev, newPerson.trim()]);
      setForm({ ...form, personName: newPerson.trim() });
      setNewPerson("");
    }
  };

  const handleSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd===0 && usd===0) {
      setAlert("تکایە بڕی پارە دیاری بکە");
      return;
    }
    
    const pName = form.personName || "";

    if (pName && !personsList.includes(pName)) {
      setPersonsList(prev => [...prev, pName]);
    }

    if (editItem) {
      const old = items.find(i => i.id === editItem.id);
      if (old && !old.returned) {
        if (old.type==="take") { 
          setCashIQD(p=>p-Number(old.amountIQD||0)); 
          setCashUSD(p=>p-Number(old.amountUSD||0)); 
        } else { 
          setCashIQD(p=>p+Number(old.amountIQD||0)); 
          setCashUSD(p=>p+Number(old.amountUSD||0)); 
        }
      }
      
      if (form.type==="take" && !form.returned) { 
        setCashIQD(p=>p+iqd); 
        setCashUSD(p=>p+usd); 
        addCashLog(`${t.edit} ${t.loanTake}: ${pName}`, iqd, usd); 
      } else if (form.type==="give" && !form.returned) {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); 
        setCashUSD(p=>p-usd); 
        addCashLog(`${t.edit} ${t.loanGive}: ${pName}`, -iqd, -usd);
      }
      
      setItems(prev => prev.map(i => i.id===editItem.id ? {...i, ...form, personName: pName} : i));
      setEditModalOpen(false);
    } else {
      if (form.type==="give") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); 
        setCashUSD(p=>p-usd); 
        addCashLog(`${t.loanGive}: ${pName}`, -iqd, -usd);
      } else {
        setCashIQD(p=>p+iqd); 
        setCashUSD(p=>p+usd); 
        addCashLog(`${t.loanTake}: ${pName}`, iqd, usd);
      }
      setItems(prev => [{...form, personName: pName, id: genId(), marked: false, returned: false}, ...prev]);
      setShowForm(false);
    }
    resetForm(); 
  };

  const handleReturn = (id) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i => i.id === id);
    if (!item || item.returned) return;

    if (item.type === "take") {
      if (Number(item.amountIQD||0) > cashIQD || Number(item.amountUSD||0) > cashUSD) {
        setAlert(t.noBalance);
        return;
      }
      setCashIQD(prev => prev - Number(item.amountIQD||0));
      setCashUSD(prev => prev - Number(item.amountUSD||0));
      addCashLog(`${t.returnMoney} ${t.loanTake}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0));
    } else {
      setCashIQD(prev => prev + Number(item.amountIQD||0));
      setCashUSD(prev => prev + Number(item.amountUSD||0));
      addCashLog(`${t.returnMoney} ${t.loanGive}`, Number(item.amountIQD||0), Number(item.amountUSD||0));
    }

    setItems(prev => prev.map(i => i.id === id ? { ...i, returned: true, amountIQD: 0, amountUSD: 0 } : i));
    setConfirmReturn(null);
  };

  const doDelete = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i=>i.id===id);
    if (item && !item.returned) {
      if (item.type==="take") { 
        setCashIQD(p=>p-Number(item.amountIQD||0)); 
        setCashUSD(p=>p-Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanTake}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); 
      } else { 
        setCashIQD(p=>p+Number(item.amountIQD||0)); 
        setCashUSD(p=>p+Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.loanGive}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); 
      }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
    setConfirmDel(null);
  };

  const handleEdit = item => { 
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    setForm({...item, personName: item.personName || ""}); 
    setEditItem(item); 
    setEditModalOpen(true); 
  };
  
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));

  const doExport = (type, size) => {
    const hdrs = [t.loanType, t.personName, t.amountIQD, t.amountUSD, t.returned, t.note, t.date];
    const rows = filtered.map(i => [
      i.type==="take"?t.loanTake:t.loanGive, 
      i.personName || "", 
      fmt(i.amountIQD||0), 
      fmt(i.amountUSD||0), 
      i.returned ? t.returned : t.notReturned,
      i.note||"", 
      i.date||""
    ]);
    if (type==="pdf") doPrint({ title: t.sidebar.loans, headers: hdrs, rows, size, isRtl });
    else doExcel({ title: "loans", headers: hdrs, rows });
    setSizeModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.loans}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={()=>setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
            <button onClick={()=>setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
            {!isFrozen && (
              <button onClick={()=>{setShowForm(!showForm);resetForm()}} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 15, justifyContent: "center" }}>
          <button onClick={() => setViewTab("loans")} style={{ padding: "8px 20px", borderRadius: 6, border: viewTab==="loans" ? "none" : `1px solid ${s.border}`, background: viewTab==="loans" ? PRIMARY : s.bgCard2, color: viewTab==="loans" ? "#fff" : s.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {t.sidebar.loans}
          </button>
          <button onClick={() => setViewTab("persons")} style={{ padding: "8px 20px", borderRadius: 6, border: viewTab==="persons" ? "none" : `1px solid ${s.border}`, background: viewTab==="persons" ? PRIMARY : s.bgCard2, color: viewTab==="persons" ? "#fff" : s.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {t.persons}
          </button>
        </div>

        {viewTab === "loans" && (
          <>
        {viewTab === "loans" && (
          <>
            <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#059669", fontSize: 11 }}>{t.loanTake} ({t.iqd}): </span>
                <strong style={{ color: "#059669", fontSize: 15 }}>{fmt(totalTakeIQD)}</strong>
              </div>
              <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#059669", fontSize: 11 }}>{t.loanTake} ({t.usd}): </span>
                <strong style={{ color: "#059669", fontSize: 15 }}>${fmt(totalTakeUSD)}</strong>
              </div>
              <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#EF4444", fontSize: 11 }}>{t.loanGive} ({t.iqd}): </span>
                <strong style={{ color: "#EF4444", fontSize: 15 }}>{fmt(totalGiveIQD)}</strong>
              </div>
              <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <span style={{ color: "#EF4444", fontSize: 11 }}>{t.loanGive} ({t.usd}): </span>
                <strong style={{ color: "#EF4444", fontSize: 15 }}>${fmt(totalGiveUSD)}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <select value={selectedPerson} onChange={e=>setSelectedPerson(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                  <option value="">{t.allPersons}</option>
                  {personsList.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
              </div>
              <div>
                <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center", minWidth: 120 }}>
                  <option value="">{t.allMonths}</option>
                  {months.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {showMarkedOnly
                ? <button onClick={() => { setShowMarkedOnly(false); setItems(prev => prev.map(i => ({...i, marked: false}))); }} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
                : <button onClick={() => setShowMarkedOnly(true)} style={{ padding: "8px 20px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.showMarked}</button>
              }
            </div>
          </>
        )}
          </>
        )}
      </StickyHeader>

      {viewTab === "persons" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 15, justifyContent: "center" }}>
            <input placeholder={t.addPerson} value={newPerson} onChange={e=>setNewPerson(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddPerson()} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, width: 220, textAlign: "center" }} />
            <button onClick={handleAddPerson} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              <I.Plus /> {t.addPerson}
            </button>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <select value={selectedPerson} onChange={e=>setSelectedPerson(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
              <option value="">{t.allPersons}</option>
              {personsList.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ maxHeight: 350, overflowY: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <TH isRtl={isRtl}>#</TH>
                  <TH isRtl={isRtl}>{t.personName}</TH>
                  <TH isRtl={isRtl}>ژمارەی قەرز</TH>
                </tr>
              </thead>
              <tbody>
                {personsList.map((person, index) => {
                  const personLoans = items.filter(i => i.personName === person);
                  return (
                    <tr key={person}>
                      <TD s={s}>{index + 1}</TD>
                      <TD s={s} style={{ fontWeight: 600 }}>{person}</TD>
                      <TD s={s}>{personLoans.length}</TD>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {personsList.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {viewTab === "loans" && !isFrozen && showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.add}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.loanType}</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="take">{t.loanTake}</option>
                <option value="give">{t.loanGive}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.personName}</label>
              <input value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} list="loanPersons" placeholder="ناوی کەس" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
              <datalist id="loanPersons">{personsList.map(p=><option key={p} value={p}/>)}</datalist>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
            <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {viewTab === "loans" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
          <div style={{ overflowX: "auto", height: "100%" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <TH isRtl={isRtl}>{t.loanType}</TH>
                  <TH isRtl={isRtl}>{t.personName}</TH>
                  <TH isRtl={isRtl}>{t.amountIQD}</TH>
                  <TH isRtl={isRtl}>{t.amountUSD}</TH>
                  <TH isRtl={isRtl}>{t.returned}</TH>
                  <TH isRtl={isRtl}>{t.note}</TH>
                  <TH isRtl={isRtl}>{t.date}</TH>
                  <TH isRtl={isRtl}>{t.mark}</TH>
                  <TH isRtl={isRtl}></TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} style={{ background: item.marked?`${PRIMARY}06`:"transparent", textAlign: "center" }}>
                    <TD s={s} style={{ minWidth: 80 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: item.type==="take"?"#D1FAE5":"#FEE2E2", color: item.type==="take"?"#059669":"#EF4444", display: "inline-block" }}>
                        {item.type==="take"?t.loanTake:t.loanGive}
                      </span>
                    </TD>
                    <TD s={s} style={{ fontWeight: 600, minWidth: 90 }}>{item.personName || ""}</TD>
                    <TD s={s} style={{ direction: "ltr", minWidth: 90, color: item.returned ? s.textMuted : (item.type==="take"?s.success:s.danger), textDecoration: item.returned ? "line-through" : "none" }}>
                      {Number(item.amountIQD)?fmt(item.amountIQD):"-"}
                    </TD>
                    <TD s={s} style={{ direction: "ltr", minWidth: 80, color: item.returned ? s.textMuted : (item.type==="take"?s.success:s.danger), textDecoration: item.returned ? "line-through" : "none" }}>
                      {Number(item.amountUSD)?"$"+fmt(item.amountUSD):"-"}
                    </TD>
                    <TD s={s} style={{ minWidth: 80 }}>
                      {item.returned ? 
                        <span style={{ color: s.success, fontSize: 12, fontWeight: 600 }}>✓ {t.returned}</span> : 
                        <span style={{ color: s.warning, fontSize: 12 }}>{t.notReturned}</span>
                      }
                    </TD>
                    <TD s={s} style={{ minWidth: 120, maxWidth: 200 }} title={item.note}>{trunc(item.note, 25) || "-"}</TD>
                    <TD s={s} style={{ direction: "ltr", minWidth: 95 }}>{item.date}</TD>
                    <TD s={s} style={{ minWidth: 35 }}>
                      <button onClick={()=>toggleMark(item.id)} style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto" }}>
                        {item.marked&&<I.Check />}
                      </button>
                    </TD>
                    <TD s={s} style={{ minWidth: 90 }}>
                      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                        {!item.returned && !isFrozen && (
                          <button onClick={() => setConfirmReturn(item.id)} style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: s.warning, color: "#fff", cursor: "pointer", fontSize: 10, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
                            <I.Return /> {t.returnMoney}
                          </button>
                        )}
                        {!isFrozen && (
                          <button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                        )}
                        {!isFrozen && (
                          <button onClick={()=>setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                        )}
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted, fontSize: 13 }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {editModalOpen && (
        <EditModal title={t.edit} onSave={handleSave} onCancel={() => { setEditModalOpen(false); resetForm(); }} s={s} t={t}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.loanType}</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="take">{t.loanTake}</option>
                <option value="give">{t.loanGive}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.personName}</label>
              <input value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
          </div>
        </EditModal>
      )}

      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={()=>doDelete(confirmDel)} onNo={()=>setConfirmDel(null)} s={s} t={t} />}
      {confirmReturn && <ConfirmModal message={t.returnConfirm} onYes={()=>handleReturn(confirmReturn)} onNo={()=>setConfirmReturn(null)} s={s} t={t} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
    </div>
  );
}

// ==================== CONCRETE ====================
function ConcretePage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog, isFrozen }) {
  const KEY = `karo_conc_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "usd" });
  const [alert, setAlert] = useState(null);
  const [sizeModal, setSizeModal] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(today());
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [unmarkModal, setUnmarkModal] = useState(null);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const totalPrice = Number(form.meters||0) * Number(form.pricePerMeter||0);
  const depositAmt = Math.round(totalPrice * Number(form.depositPercent||0) / 100);
  const receivedAmt = totalPrice - depositAmt;

  const months = [...new Set(items.map(i => i.date?.slice(0,7)))].sort().reverse();

  const filtered = items.filter(i => {
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const totalReceivedIQD = filtered.filter(i => i.currency === "iqd").reduce((a,b) => a + Number(b.received||0), 0);
  const totalReceivedUSD = filtered.filter(i => i.currency === "usd").reduce((a,b) => a + Number(b.received||0), 0);
  const totalDepositIQD = filtered.filter(i => i.currency === "iqd").reduce((a,b) => a + Number(b.deposit||0), 0);
  const totalDepositUSD = filtered.filter(i => i.currency === "usd").reduce((a,b) => a + Number(b.deposit||0), 0);
  const totalMeters = filtered.reduce((a,b) => a + Number(b.meters||0), 0);
  const avgPricePerMeter = filtered.length > 0 
    ? Math.round(filtered.reduce((a,b) => a + (Number(b.totalPrice||0) / (Number(b.meters||0) || 1)), 0) / filtered.length) 
    : 0;

  const handleSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    if (totalPrice <= 0) return;
    const cur = form.currency || "iqd";
    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    setItems(prev => [item, ...prev]);
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (item) => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    setForm({
      date: item.date,
      meters: item.meters,
      pricePerMeter: item.pricePerMeter,
      depositPercent: item.depositPercent,
      note: item.note,
      currency: item.currency
    });
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    if (!editItem) return;
    
    const cur = form.currency || "iqd";
    const newTotalPrice = Number(form.meters||0) * Number(form.pricePerMeter||0);
    const newDeposit = Math.round(newTotalPrice * Number(form.depositPercent||0) / 100);
    const newReceived = newTotalPrice - newDeposit;

    if (editItem.isReceived) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.received||0));
      else setCashIQD(prev => prev - Number(editItem.received||0));
    }
    if (editItem.depositClaimed) {
      if (editItem.currency === "usd") setCashUSD(prev => prev - Number(editItem.deposit||0));
      else setCashIQD(prev => prev - Number(editItem.deposit||0));
    }

    setItems(prev => prev.map(i => i.id === editItem.id ? {
      ...i,
      ...form,
      totalPrice: newTotalPrice,
      deposit: newDeposit,
      received: newReceived,
      currency: cur,
      isReceived: false,
      depositClaimed: false
    } : i));

    setEditModalOpen(false);
    resetForm();
  };

  const markReceived = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item && !item.isReceived) {
      const cur = item.currency || "iqd";
      if (cur === "usd") { setCashUSD(prev => prev + item.received); }
      else { setCashIQD(prev => prev + item.received); }
      addCashLog(`${t.received} ${t.sidebar.concrete}`, cur === "iqd" ? item.received : 0, cur === "usd" ? item.received : 0);
      setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));
    }
  };

  const unmarkReceived = id => {
    if (isFrozen) { setAlert(t.frozen); return; }
    const item = items.find(i => i.id === id);
    if (!item || !item.isReceived) return;
    const cur = item.currency || "iqd";
    const item2 = items.find(i => i.id === id);
    const cur2 = item2?.currency || "iqd";
    const allPaid = (item2?.payments||[]).reduce((a,b) => a + Number(b.amount||0), 0);
    if (cur2 === "usd") { setCashUSD(prev => prev - allPaid); }
    else { setCashIQD(prev => prev - allPaid); }
    setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: false, paidAmount: 0, payments: [] } : i));
  };


  const addPayment = (id, amount, date, note) => {
    if (isFrozen) { setAlert(t.frozen); return; }
    const item = items.find(i => i.id === id);
    if (!item) return;
    const amt = Number(amount||0);
    if (amt <= 0) return;
    const cur = item.currency || "iqd";
    const oldPaid = Number(item.paidAmount||0);
    const newPaid = oldPaid + amt;
    const remaining = Math.max(0, Number(item.received||0) - newPaid);
    if (cur === "usd") { setCashUSD(prev => prev + amt); }
    else { setCashIQD(prev => prev + amt); }
    addCashLog("payment: " + amt, cur === "iqd" ? amt : 0, cur === "usd" ? amt : 0);
    const newPaymentObj = { id: genId(), amount: amt, date: date || today(), note: note || "" };
    const newPaymentsList = [...(items.find(i => i.id === id)?.payments || []), newPaymentObj];
    setItems(prev => prev.map(i => i.id === id ? { ...i, paidAmount: newPaid, isReceived: remaining <= 0, payments: newPaymentsList } : i));
    setPaymentModal(null);
    setPaymentAmount("");
  };


  const claimDeposit = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item && !item.depositClaimed && item.deposit > 0) {
      const cur = item.currency || "iqd";
      if (cur === "usd") { setCashUSD(prev => prev + item.deposit); }
      else { setCashIQD(prev => prev + item.deposit); }
      addCashLog(`${t.claimDeposit}: ${item.deposit}`, cur === "iqd" ? item.deposit : 0, cur === "usd" ? item.deposit : 0);
      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
    }
  };


  const editPayment = (itemId, paymentId, amount, date, note) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const amt = Number(amount||0);
    const otherPaid = (item.payments||[]).filter(p => p.id !== paymentId).reduce((a,b) => a + Number(b.amount||0), 0);
    const maxAllowed = Math.max(0, Number(item.received||0) - otherPaid);
    if (amt > maxAllowed) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! زیاترین بڕ: " + (item.currency==="usd"?"$":"") + Math.round(maxAllowed)); return; }
    const oldPayment = (item.payments||[]).find(p => p.id === paymentId);
    if (!oldPayment) return;
    const cur = item.currency || "iqd";
    const diff = amt - Number(oldPayment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev + diff); }
    else { setCashIQD(prev => prev + diff); }
    const newPayments = (item.payments||[]).map(p => p.id === paymentId ? { ...p, amount: amt, date: date||today(), note: note||"" } : p);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: newPaid >= Number(i.received||0) } : i));
    setEditPaymentId(null);
    setPaymentAmount("");
    setPaymentDate(today());
    setPaymentNote("");
  };

  const deletePayment = (itemId, paymentId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const payment = (item.payments||[]).find(p => p.id === paymentId);
    if (!payment) return;
    const cur = item.currency || "iqd";
    const amt = Number(payment.amount||0);
    if (cur === "usd") { setCashUSD(prev => prev - amt); }
    else { setCashIQD(prev => prev - amt); }
    const newPayments = (item.payments||[]).filter(p => p.id !== paymentId);
    const newPaid = newPayments.reduce((a,b) => a + Number(b.amount||0), 0);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, payments: newPayments, paidAmount: newPaid, isReceived: false } : i));
  };

  const unclaimDeposit = id => {
    if (isFrozen) { setAlert(t.frozen); return; }
    const item = items.find(i => i.id === id);
    if (!item || !item.depositClaimed) return;
    const cur = item.currency || "iqd";
    if (cur === "usd") { setCashUSD(prev => prev - Number(item.deposit||0)); }
    else { setCashIQD(prev => prev - Number(item.deposit||0)); }
    setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: false } : i));
  };


  const doDelete = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item) {
      const cur = item.currency || "iqd";
      if (item.isReceived) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.received||0));
        else setCashIQD(prev => prev - Number(item.received||0));
      }
      if (item.depositClaimed) {
        if (cur === "usd") setCashUSD(prev => prev - Number(item.deposit||0));
        else setCashIQD(prev => prev - Number(item.deposit||0));
      }
      addCashLog(`${t.delete} ${t.sidebar.concrete}`, cur === "iqd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0, cur === "usd" ? -(Number(item.isReceived?item.received:0) + Number(item.depositClaimed?item.deposit:0)) : 0);
    }
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirmDel(null);
  };

  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));
  const resetForm = () => setForm({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "iqd" });

  const doExport = (type, size) => {
    const hdrs = [t.date, t.currency, t.meters, t.pricePerMeter, t.totalConcrete, t.deposit, t.received, t.receivedStatus, t.note];
    const rows = filtered.map(i => [
      i.date,
      i.currency === "usd" ? t.usd : t.iqd,
      fmt(i.meters),
      fmt(i.pricePerMeter),
      fmt(i.totalPrice),
      fmt(i.deposit),
      fmt(i.received),
      i.isReceived ? t.receivedStatus : t.notReceived,
      i.note || ""
    ]);
    if (type==="pdf") doPrint({ title: t.sidebar.concrete, headers: hdrs, rows, size, isRtl });
    else doExcel({ title: "concrete", headers: hdrs, rows });
    setSizeModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.concrete}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={()=>setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
            <button onClick={()=>setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
            {!isFrozen && (
              <button onClick={()=>setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.totalConcreteReceived} ({t.iqd}): </span>
            <strong style={{ color: s.success, fontSize: 15 }}>{fmt(totalReceivedIQD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.totalConcreteReceived} ({t.usd}): </span>
            <strong style={{ color: s.success, fontSize: 15 }}>${fmt(totalReceivedUSD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.totalDeposit} ({t.iqd}): </span>
            <strong style={{ color: s.warning, fontSize: 15 }}>{fmt(totalDepositIQD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.totalDeposit} ({t.usd}): </span>
            <strong style={{ color: s.warning, fontSize: 15 }}>${fmt(totalDepositUSD)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.totalMeters}: </span>
            <strong style={{ color: PRIMARY, fontSize: 15 }}>{fmt(totalMeters)}</strong>
          </div>
          <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: s.textMuted, fontSize: 11 }}>{t.avgPricePerMeter}: </span>
            <strong style={{ color: PRIMARY, fontSize: 15 }}>{fmt(avgPricePerMeter)}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, outline: "none", textAlign: "center" }} />
          </div>
          <div>
            <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center", minWidth: 120 }}>
              <option value="">{t.allMonths}</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {showMarkedOnly
            ? <button onClick={()=>{setShowMarkedOnly(false);setItems(prev=>prev.map(i=>({...i,marked:false})))}} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
            : <button onClick={()=>setShowMarkedOnly(true)} style={{ padding: "8px 20px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.showMarked}</button>
          }
        </div>

      </StickyHeader>

      {!isFrozen && showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.add}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.concCurrency}</label>
              <select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="iqd">{t.iqd}</option>
                <option value="usd">{t.usd}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.meters}</label>
              <input type="number" value={form.meters} onChange={e=>setForm({...form,meters:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.pricePerMeter}</label>
              <input type="number" value={form.pricePerMeter} onChange={e=>setForm({...form,pricePerMeter:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.depositPercent}</label>
              <input type="number" value={form.depositPercent} onChange={e=>setForm({...form,depositPercent:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} placeholder="%" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, color: s.textMuted }}>{t.totalConcrete}</span>
                <div style={{ padding: "8px 16px", background: `${PRIMARY}10`, borderRadius: 6, fontWeight: 700, color: PRIMARY, fontSize: 15 }}>
                  {form.currency==="usd"?"$":""}{fmt(totalPrice)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, color: s.textMuted }}>{t.deposit}</span>
                <div style={{ padding: "8px 16px", background: "#FEF3C7", borderRadius: 6, fontWeight: 700, color: "#D97706", fontSize: 15 }}>
                  {form.currency==="usd"?"$":""}{fmt(depositAmt)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, color: s.textMuted }}>{t.received}</span>
                <div style={{ padding: "8px 16px", background: "#D1FAE5", borderRadius: 6, fontWeight: 700, color: "#059669", fontSize: 15 }}>
                  {form.currency==="usd"?"$":""}{fmt(receivedAmt)}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
            <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.date}</TH>
                <TH isRtl={isRtl}>{t.currency}</TH>
                <TH isRtl={isRtl}>{t.meters}</TH>
                <TH isRtl={isRtl}>{t.pricePerMeter}</TH>
                <TH isRtl={isRtl}>{t.totalConcrete}</TH>
                <TH isRtl={isRtl}>{t.deposit}</TH>
                <TH isRtl={isRtl}>{t.received}</TH>
                <TH isRtl={isRtl}>وەرگرتنی پارە</TH>
                <TH isRtl={isRtl}>وەرگیراو</TH>
                <TH isRtl={isRtl}>ماوە</TH>
                <TH isRtl={isRtl}>{t.deposit}</TH>
                <TH isRtl={isRtl}>{t.note}</TH>
                <TH isRtl={isRtl}>{t.mark}</TH>
                <TH isRtl={isRtl}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const cur = item.currency || "iqd";
                const sym = cur === "usd" ? "$" : "";
                const effectivePaid = item.isReceived && !item.paidAmount ? Number(item.received||0) : Number(item.paidAmount||0);
                return (
                  <tr key={item.id} style={{ background: item.marked?`${PRIMARY}06`:"transparent", textAlign: "center" }}>
                    <TD s={s} style={{ direction: "ltr", minWidth: 95 }}>{item.date}</TD>
                    <TD s={s} style={{ minWidth: 50 }}>{cur === "usd" ? t.usd : t.iqd}</TD>
                    <TD s={s} style={{ direction: "ltr", minWidth: 60 }}>{fmt(item.meters)}</TD>
                    <TD s={s} style={{ direction: "ltr", minWidth: 70 }}>{sym}{fmt(item.pricePerMeter)}</TD>
                    <TD s={s} style={{ direction: "ltr", fontWeight: 700, color: PRIMARY, minWidth: 90 }}>{sym}{fmt(item.totalPrice)}</TD>
                    <TD s={s} style={{ direction: "ltr", color: "#D97706", minWidth: 70 }}>{sym}{fmt(item.deposit)}</TD>
                    <TD s={s} style={{ direction: "ltr", color: s.success, fontWeight: 700, minWidth: 80 }}>{sym}{fmt(item.received)}</TD>
                    <TD s={s} style={{ minWidth: 110 }}>
                      {!isFrozen && !item.isReceived && <button onClick={()=>{setPaymentModal(item.id);setPaymentAmount("");}} style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #059669", background: "#D1FAE5", color: "#059669", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>وەرگرتنی پارە</button>}
                    </TD>
                    <TD s={s} style={{ minWidth: 90 }}>
                      {item.isReceived ? <span style={{ color: s.success, fontSize: 15, fontWeight: 700, cursor: "pointer" }} onClick={()=>setUnmarkModal(item.id)} title="پاشگەزبوونەوە">✓ هەموی وەرگیرا ↩</span> : <span style={{ color: s.textMuted, fontSize: 14, fontWeight: 700 }}>{sym}{fmt(effectivePaid)}</span>}
                    </TD>
                    <TD s={s} style={{ minWidth: 90, color: item.isReceived ? s.success : s.danger, fontWeight: 700 }}>
                      {item.isReceived ? "✓" : sym+fmt(Math.max(0, Number(item.received||0) - effectivePaid))}
                    </TD>
                    <TD s={s} style={{ minWidth: 70 }}>
                      {item.depositClaimed ? <span style={{ color: s.success, fontSize: 12, fontWeight: 600, cursor: "pointer" }} onClick={()=>unclaimDeposit(item.id)} title="پاشگەزبوونەوە">✓ {t.claimDeposit} ↩</span>
                        : !isFrozen && item.deposit > 0 && <button onClick={()=>claimDeposit(item.id)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid #D97706`, background: "#FEF3C7", color: "#D97706", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.claimDeposit}</button>}
                    </TD>
                    <TD s={s} style={{ minWidth: 100 }}>{item.note}</TD>
                    <TD s={s} style={{ minWidth: 35 }}>
                      <button onClick={()=>toggleMark(item.id)} style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto" }}>
                        {item.marked&&<I.Check />}
                      </button>
                    </TD>
                    <TD s={s} style={{ minWidth: 60 }}>
                      {!isFrozen && (
                        <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                          <button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                          <button onClick={()=>setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                        </div>
                      )}
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted, fontSize: 13 }}>{t.noData}</div>}
        </div>
      </div>

      {editModalOpen && (
        <EditModal title={t.edit} onSave={handleEditSave} onCancel={() => { setEditModalOpen(false); resetForm(); }} s={s} t={t}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.concCurrency}</label>
              <select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="iqd">{t.iqd}</option>
                <option value="usd">{t.usd}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.meters}</label>
              <input type="number" value={form.meters} onChange={e=>setForm({...form,meters:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.pricePerMeter}</label>
              <input type="number" value={form.pricePerMeter} onChange={e=>setForm({...form,pricePerMeter:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.depositPercent}</label>
              <input type="number" value={form.depositPercent} onChange={e=>setForm({...form,depositPercent:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
          </div>
        </EditModal>
      )}

      {paymentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 500, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 15, color: "#4DAF94", textAlign: "center" }}>وەرگرتنی پارە</h3>
            {(() => {
              const item = items.find(i => i.id === paymentModal);
              if (!item) return null;
              const sym = item.currency === "usd" ? "$" : "";
              const effPaid = item.isReceived && !item.paidAmount ? Number(item.received||0) : Number(item.paidAmount||0);
              const remaining = Math.max(0, Number(item.received||0) - effPaid);
              const payments = item.payments || [];
              return (
                <div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 15, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 13, color: "#666", margin: 0 }}>کۆی گشتی: <strong>{sym}{fmt(item.received)}</strong></p>
                    <p style={{ fontSize: 13, color: "#059669", margin: 0 }}>وەرگیراو: <strong>{sym}{fmt(effPaid)}</strong></p>
                    <p style={{ fontSize: 13, color: "#EF4444", margin: 0 }}>ماوە: <strong>{sym}{fmt(remaining)}</strong></p>
                  </div>
                  {payments.length > 0 && (

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15, fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#4DAF94", color: "#fff" }}>
                          <th style={{ padding: "6px", textAlign: "center" }}>بەروار</th>
                          <th style={{ padding: "6px", textAlign: "center" }}>بڕ</th>
                          <th style={{ padding: "6px", textAlign: "center" }}>تێبینی</th>
                          <th style={{ padding: "6px", textAlign: "center" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p, idx) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                            <td style={{ padding: "5px" }}>{p.date}</td>
                            <td style={{ padding: "5px", color: "#059669", fontWeight: 600 }}>{sym}{fmt(p.amount)}</td>
                            <td style={{ padding: "5px" }}>{p.note||"-"}</td>
                            <td style={{ padding: "5px" }}>
                              <button onClick={() => { setEditPaymentId(p.id); setPaymentAmount(p.amount); setPaymentDate(p.date); setPaymentNote(p.note||""); }} style={{ background: "none", border: "none", color: "#4DAF94", cursor: "pointer", fontSize: 14, marginRight: 5 }}>✏️</button>
                              <button onClick={() => deletePayment(item.id, p.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {editPaymentId ? (
                  <div style={{ background: "#fff9e6", border: "1px solid #F59E0B", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                    <p style={{ fontSize: 12, color: "#D97706", marginBottom: 8, textAlign: "center", fontWeight: 600 }}>گۆڕینی بڕی پارە</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr" }} />
                      <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr", textAlign: "center" }} />
                    </div>
                    <input placeholder="تێبینی" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, textAlign: "center", marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { editPayment(paymentModal, editPaymentId, paymentAmount, paymentDate, paymentNote); setEditPaymentId(null); }} style={{ flex: 1, background: "#F59E0B", color: "#fff", border: "none", borderRadius: 6, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>گۆڕین</button>
                      <button onClick={() => { setEditPaymentId(null); setPaymentAmount(""); setPaymentDate(today()); setPaymentNote(""); }} style={{ flex: 1, background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 6, padding: "8px", fontSize: 13, cursor: "pointer" }}>پاشگەزبوونەوە</button>
                    </div>
                  </div>
                  ) : null}
                  {!item.isReceived && !editPaymentId && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 15 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr" }} />
                        <input type="number" placeholder="بڕ" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, direction: "ltr", textAlign: "center" }} />
                      </div>
                      <input placeholder="تێبینی" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 13, textAlign: "center" }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { const item = items.find(x => x.id === paymentModal); const maxAmt = Math.max(0, Number(item?.received||0) - Number(item?.paidAmount||0)); const amt = Number(paymentAmount||0); if(amt > maxAmt) { setAlert("ئەم بڕە زیاترە لە ماوەی پارەکە! ماوە: " + (item?.currency==="usd"?"$":"") + Math.round(maxAmt)); return; } addPayment(paymentModal, paymentAmount, paymentDate, paymentNote); }} style={{ flex: 1, background: "#4DAF94", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>وەرگرتن</button>
                      </div>
                    </div>
                  )}
                  <button onClick={() => { setPaymentModal(null); setPaymentAmount(""); setPaymentNote(""); }} style={{ width: "100%", background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "8px", fontSize: 13, cursor: "pointer" }}>داخستن</button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {unmarkModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: "#4DAF94" }}>گەڕانەوەی پارە</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => { unmarkReceived(unmarkModal); setUnmarkModal(null); }} style={{ background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>هەموو پارەکە بگەڕێتەوە</button>
              <button onClick={() => { setPaymentModal(unmarkModal); setUnmarkModal(null); }} style={{ background: "#F59E0B", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>گۆڕانکاری لە بڕی پارە</button>
              <button onClick={() => setUnmarkModal(null)} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer" }}>هەڵوەشاندنەوە</button>
            </div>
          </div>
        </div>
      )}
      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={()=>doDelete(confirmDel)} onNo={()=>setConfirmDel(null)} s={s} t={t} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
    </div>
  );
}

// ==================== CONTRACTOR ====================
function ContractorPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog, isFrozen }) {
  const KEY = `karo_contr_${pKey}`;
  const PKEY = `karo_contrPersons_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [personsList, setPersonsList] = useState(getLS(PKEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);
  useEffect(() => { setLS(PKEY, personsList); }, [personsList, PKEY]);

  useEffect(() => {
    const fromItems = [...new Set(items.map(i => i.personName).filter(Boolean))];
    const merged = [...new Set([...personsList, ...fromItems])];
    if (merged.length !== personsList.length) setPersonsList(merged);
  }, [items]);

  const months = [...new Set(items.map(i => i.date?.slice(0,7)))].sort().reverse();

  const filtered = items.filter(i => {
    if (selectedPerson && i.personName !== selectedPerson) return false;
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const totalWithdrawIQD = filtered.filter(i=>i.type==="withdraw").reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const totalWithdrawUSD = filtered.filter(i=>i.type==="withdraw").reduce((a,b)=>a+Number(b.amountUSD||0),0);
  const totalAddIQD = filtered.filter(i=>i.type==="add").reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const totalAddUSD = filtered.filter(i=>i.type==="add").reduce((a,b)=>a+Number(b.amountUSD||0),0);

  const resetForm = () => { 
    setForm({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" }); 
    setEditItem(null); 
    setNewPerson(""); 
  };

  const handleAddPerson = () => {
    if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
      setPersonsList(prev => [...prev, newPerson.trim()]);
      setForm({ ...form, personName: newPerson.trim() });
      setNewPerson("");
    }
  };

  const handleSave = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd===0 && usd===0) return;
    const pName = form.personName || newPerson.trim();
    if (!pName) return;
    if (!personsList.includes(pName)) setPersonsList(prev => [...prev, pName]);

    if (editItem) {
      const old = items.find(i => i.id === editItem.id);
      if (old) {
        if (old.type==="withdraw") { 
          setCashIQD(p=>p+Number(old.amountIQD||0)); 
          setCashUSD(p=>p+Number(old.amountUSD||0)); 
        } else { 
          setCashIQD(p=>p-Number(old.amountIQD||0)); 
          setCashUSD(p=>p-Number(old.amountUSD||0)); 
        }
      }
      if (form.type==="withdraw") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); 
        setCashUSD(p=>p-usd); 
        addCashLog(`${t.edit} ${t.withdraw}: ${pName}`, -iqd, -usd);
      } else { 
        setCashIQD(p=>p+iqd); 
        setCashUSD(p=>p+usd); 
        addCashLog(`${t.edit} ${t.addMoney}: ${pName}`, iqd, usd); 
      }
      setItems(prev => prev.map(i => i.id===editItem.id ? {...i, ...form, personName: pName} : i));
      setEditModalOpen(false);
    } else {
      if (form.type==="withdraw") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); 
        setCashUSD(p=>p-usd); 
        addCashLog(`${t.withdraw}: ${pName}`, -iqd, -usd);
      } else { 
        setCashIQD(p=>p+iqd); 
        setCashUSD(p=>p+usd); 
        addCashLog(`${t.addMoney}: ${pName}`, iqd, usd); 
      }
      setItems(prev => [{...form, personName: pName, id: genId(), marked: false}, ...prev]);
      setShowForm(false);
    }
    resetForm(); 
  };

  const doDelete = id => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const item = items.find(i=>i.id===id);
    if (item) {
      if (item.type==="withdraw") { 
        setCashIQD(p=>p+Number(item.amountIQD||0)); 
        setCashUSD(p=>p+Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.withdraw}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); 
      } else { 
        setCashIQD(p=>p-Number(item.amountIQD||0)); 
        setCashUSD(p=>p-Number(item.amountUSD||0)); 
        addCashLog(`${t.delete} ${t.addMoney}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); 
      }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
    setConfirmDel(null);
  };

  const handleEdit = item => { 
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    setForm(item); 
    setEditItem(item); 
    setEditModalOpen(true); 
  };
  
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.contractor}</h1>
          {!isFrozen && (
            <button onClick={()=>{setShowForm(!showForm);resetForm()}} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
          )}
        </div>

        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input placeholder={t.addPerson} value={newPerson} onChange={e=>setNewPerson(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddPerson()} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
          </div>
          {!isFrozen && (
            <button onClick={handleAddPerson} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}><I.Plus /> {t.addPerson}</button>
          )}
        </div>

        <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", marginBottom: 15 }}>
          <div style={{ minWidth: 200 }}>
            <select value={selectedPerson} onChange={e=>setSelectedPerson(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
              <option value="">{t.allPersons}</option>
              {personsList.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 200 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
          </div>
          <div>
            <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center", minWidth: 120 }}>
              <option value="">{t.allMonths}</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {showMarkedOnly
            ? <button onClick={()=>{setShowMarkedOnly(false);setItems(prev=>prev.map(i=>({...i,marked:false})))}} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
            : <button onClick={()=>setShowMarkedOnly(true)} style={{ padding: "8px 20px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.showMarked}</button>
          }
        </div>
        <div style={{ display: "flex", gap: 15, marginBottom: 15, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: "#EF4444", fontSize: 11 }}>{t.withdraw} ({t.iqd}): </span>
            <strong style={{ color: "#EF4444", fontSize: 15 }}>{fmt(totalWithdrawIQD)}</strong>
          </div>
          <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: "#EF4444", fontSize: 11 }}>{t.withdraw} ({t.usd}): </span>
            <strong style={{ color: "#EF4444", fontSize: 15 }}>${fmt(totalWithdrawUSD)}</strong>
          </div>
          <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: "#059669", fontSize: 11 }}>{t.addMoney} ({t.iqd}): </span>
            <strong style={{ color: "#059669", fontSize: 15 }}>{fmt(totalAddIQD)}</strong>
          </div>
          <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <span style={{ color: "#059669", fontSize: 11 }}>{t.addMoney} ({t.usd}): </span>
            <strong style={{ color: "#059669", fontSize: 15 }}>${fmt(totalAddUSD)}</strong>
          </div>
        </div>
      </StickyHeader>

      {!isFrozen && showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.add}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.contractorType}</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="withdraw">{t.withdraw}</option>
                <option value="add">{t.addMoney}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.personName}</label>
              <select value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="">- {t.personName} -</option>
                {personsList.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
            <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{editItem?t.edit:t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.date}</TH>
                <TH isRtl={isRtl}>{t.contractorType}</TH>
                <TH isRtl={isRtl}>{t.personName}</TH>
                <TH isRtl={isRtl}>{t.amountIQD}</TH>
                <TH isRtl={isRtl}>{t.amountUSD}</TH>
                <TH isRtl={isRtl}>{t.note}</TH>
                <TH isRtl={isRtl}>{t.mark}</TH>
                <TH isRtl={isRtl}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ background: item.marked?`${PRIMARY}06`:"transparent", textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", minWidth: 95 }}>{item.date}</TD>
                  <TD s={s} style={{ minWidth: 80 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: item.type==="add"?"#D1FAE5":"#FEE2E2", color: item.type==="add"?"#059669":"#EF4444", display: "inline-block" }}>
                      {item.type==="add"?t.addMoney:t.withdraw}
                    </span>
                  </TD>
                  <TD s={s} style={{ fontWeight: 600, minWidth: 100 }}>{item.personName}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 90 }}>{Number(item.amountIQD)?fmt(item.amountIQD):"-"}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 80 }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"-"}</TD>
                  <TD s={s} style={{ minWidth: 120, maxWidth: 200 }} title={item.note}>{trunc(item.note, 25) || "-"}</TD>
                  <TD s={s} style={{ minWidth: 35 }}>
                    <button onClick={()=>toggleMark(item.id)} style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto" }}>
                      {item.marked&&<I.Check />}
                    </button>
                  </TD>
                  <TD s={s} style={{ minWidth: 60 }}>
                    {!isFrozen && (
                      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                        <button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                        <button onClick={()=>setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                      </div>
                    )}
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted, fontSize: 13 }}>{t.noData}</div>}
        </div>
      </div>

      {editModalOpen && (
        <EditModal title={t.edit} onSave={handleSave} onCancel={() => { setEditModalOpen(false); resetForm(); }} s={s} t={t}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.contractorType}</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="withdraw">{t.withdraw}</option>
                <option value="add">{t.addMoney}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.personName}</label>
              <select value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="">- {t.personName} -</option>
                {personsList.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.note}</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
          </div>
        </EditModal>
      )}

      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={()=>doDelete(confirmDel)} onNo={()=>setConfirmDel(null)} s={s} t={t} />}
    </div>
  );
}

// ==================== EXCHANGE ====================
function ExchangePage({ t, s, isRtl, exchangeRate, setExchangeRate, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog, isFrozen }) {
  const [tmpRate, setTmpRate] = useState(exchangeRate);
  const [dir, setDir] = useState("usd_to_iqd");
  const [amt, setAmt] = useState("");
  const [alert, setAlert] = useState(null);
  
  const result = dir === "usd_to_iqd" ? Number(amt||0) * exchangeRate : Number(amt||0) / exchangeRate;

  const handleConvert = () => {
    if (isFrozen) {
      setAlert(t.frozen);
      return;
    }
    
    const a = Number(amt||0); 
    if (a <= 0) return;
    
    if (dir === "usd_to_iqd") {
      if (a > cashUSD) { 
        setAlert(t.noBalance); 
        return; 
      }
      const convertedIQD = Math.round(a * exchangeRate);
      setCashUSD(prev => prev - a); 
      setCashIQD(prev => prev + convertedIQD); 
      addCashLog(`${t.convert}: $${a} → ${fmt(convertedIQD)} ${t.iqd}`, convertedIQD, -a);
    } else {
      if (a > cashIQD) { 
        setAlert(t.noBalance); 
        return; 
      }
      const convertedUSD = Math.round(a / exchangeRate);
      setCashIQD(prev => prev - a); 
      setCashUSD(prev => prev + convertedUSD); 
      addCashLog(`${t.convert}: ${fmt(a)} ${t.iqd} → $${convertedUSD}`, -a, convertedUSD);
    }
    setAmt("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: PRIMARY, textAlign: "center" }}>{t.sidebar.exchange}</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 15, textAlign: "center" }}>{t.exchangeRate}</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>1 USD =</label>
              <input type="number" value={tmpRate} onChange={e=>setTmpRate(Number(e.target.value))} style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 15, direction: "ltr", textAlign: "center" }} />
            </div>
            <button onClick={()=>setExchangeRate(tmpRate)} style={{ padding: "10px 20px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t.saveRate}</button>
          </div>
          <div style={{ marginTop: 15, padding: "12px 20px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "center" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>1$ = {fmt(exchangeRate)} {t.iqd}</span>
          </div>
        </div>
        
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 15, textAlign: "center" }}>{t.convert}</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 12, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.convertTo}</label>
            <select value={dir} onChange={e=>setDir(e.target.value)} style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14, direction: "ltr", textAlign: "center" }}>
              <option value="usd_to_iqd">{t.fromUSD}</option>
              <option value="iqd_to_usd">{t.fromIQD}</option>
            </select>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 12, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.amount}</label>
            <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14, direction: "ltr", textAlign: "center" }} />
          </div>
          
          <div style={{ padding: "15px", background: "#D1FAE5", borderRadius: 6, textAlign: "center", marginBottom: 15 }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 5 }}>{t.result}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#059669", direction: "ltr" }}>
              {dir === "usd_to_iqd" 
                ? `${fmt(Math.round(result))} ${t.iqd}`
                : `$${fmt(Math.round(result))}`}
            </div>
          </div>
          
          <button onClick={handleConvert} style={{ width: "100%", padding: "12px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{t.convert}</button>
        </div>
      </div>
      
      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}
    </div>
  );
}

// ==================== INVOICE ====================
function InvoicePage({ t, s, isRtl, pKey, isFrozen }) {
  const KEY = `karo_inv_${pKey}`;
  const [invoices, setInvoices] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
  const [preview, setPreview] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  useEffect(() => { setLS(KEY, invoices); }, [invoices, KEY]);

  const filtered = invoices.filter(inv => 
    inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    inv.billTo?.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = () => setForm({...form, items: [...form.items, { name: "", qty: "", price: "", note: "" }]});
  const removeItem = i => setForm({...form, items: form.items.filter((_,idx)=>idx!==i)});
  const updateItem = (i, f, v) => { const n=[...form.items]; n[i]={...n[i],[f]:v}; setForm({...form, items: n}); };
  const total = form.items.reduce((a,b)=>a+(Number(b.qty||0)*Number(b.price||0)),0);

  const handleSave = () => {
    if (isFrozen) return;
    setInvoices(prev => [{...form, id: genId(), total, marked: false}, ...prev]);
    setForm({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
    setShowForm(false);
  };

  const handleEdit = (inv) => {
    if (isFrozen) return;
    setForm(inv);
    setEditItem(inv);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    setInvoices(prev => prev.map(i => i.id === editItem.id ? { ...form, id: editItem.id, total: total } : i));
    setEditModalOpen(false);
    setForm({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
  };

  const doDelete = id => { 
    if (isFrozen) return;
    setInvoices(prev => prev.filter(i=>i.id!==id)); 
    setConfirmDel(null); 
  };

  const printInv = inv => {
    const cur = inv.currency==="usd"?"$":"";
    const curLabel = inv.currency==="usd"?t.usd:t.iqd;
    const w = window.open("","_blank");
    w.document.write(`<html dir="${isRtl?"rtl":"ltr"}">
      <head>
        <title>Invoice</title>
        <style>
          @page { size: A4; margin: 1.5cm; }
          body { 
            font-family: 'Segoe UI', Tahoma, sans-serif; 
            padding: 0; 
            max-width: 800px; 
            margin: 0 auto; 
            position: relative;
            min-height: 100vh;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 80px;
            font-weight: 900;
            color: ${PRIMARY};
            opacity: 0.1;
            z-index: -1;
            text-align: center;
            letter-spacing: 5px;
            white-space: nowrap;
          }
          .watermark span {
            display: block;
            font-size: 40px;
          }
          .hdr { 
            text-align: center; 
            border-bottom: 2px solid ${PRIMARY}; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
          }
          .hdr h1 { color: ${PRIMARY}; font-size: 28px; margin: 0; }
          .hdr p { color: #666; font-size: 12px; margin: 5px 0; direction: ltr; }
          .info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px; 
            font-size: 13px; 
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
          }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: ${PRIMARY}; color: white; padding: 10px; font-size: 13px; text-align: center; }
          td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px; }
          .total { 
            text-align: center; 
            font-size: 20px; 
            font-weight: bold; 
            margin-top: 20px; 
            color: ${PRIMARY}; 
            background: #f0fdf4;
            padding: 15px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="watermark">
          KG<br />
          <span>KARO GROUP</span>
        </div>
        <div class="hdr">
          <h1>KARO GROUP</h1>
          <p>${PHONE} | ${EMAIL}</p>
        </div>
        <div class="info">
          <div><strong>DATE:</strong> ${inv.date}</div>
          <div><strong>INVOICE #:</strong> ${inv.invoiceNo}</div>
        </div>
        ${inv.billTo ? `
        <div class="info">
          <div><strong>BILL TO:</strong> ${inv.billTo}</div>
          ${inv.billPhone ? `<div><strong>Phone:</strong> ${inv.billPhone}</div>` : ""}
        </div>
        ` : ""}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${t.itemName}</th>
              <th>${t.qty}</th>
              <th>${t.price}</th>
              <th>${t.total}</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map((it,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${it.name}</td>
              <td>${it.qty}</td>
              <td>${cur}${fmt(it.price)}</td>
              <td>${cur}${fmt(Number(it.qty||0)*Number(it.price||0))}</td>
            </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="total">
          ${t.total}: ${cur}${fmt(inv.total)} ${curLabel}
        </div>
      </body>
    </html>`);
    w.document.close(); 
    w.print();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StickyHeader s={s}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.invoice}</h1>
          {!isFrozen && (
            <button onClick={()=>setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
          )}
        </div>

        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 15, marginBottom: 15 }}>
          <input 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            placeholder={t.searchInvoice}
            style={{ width: "100%", padding: "10px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} 
          />
        </div>
      </StickyHeader>

      {!isFrozen && showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 20, marginBottom: 15 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 15, color: PRIMARY, textAlign: "center" }}>{t.add}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 15 }}>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>DATE</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>INVOICE #</label>
              <input value={form.invoiceNo} onChange={e=>setForm({...form,invoiceNo:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>{t.currency}</label>
              <select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                <option value="iqd">{t.iqd}</option>
                <option value="usd">{t.usd}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>BILL TO</label>
              <input value={form.billTo} onChange={e=>setForm({...form,billTo:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, textAlign: "center", display: "block", marginBottom: 3 }}>Phone</label>
              <input value={form.billPhone} onChange={e=>setForm({...form,billPhone:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
            </div>
          </div>

          {form.items.map((item,i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <div>
                {i===0 && <label style={{ fontSize: 11, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.itemName}</label>}
                <input value={item.name} onChange={e=>updateItem(i,"name",e.target.value)} placeholder={t.itemName} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, textAlign: "center" }} />
              </div>
              <div>
                {i===0 && <label style={{ fontSize: 11, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.qty}</label>}
                <input type="number" value={item.qty} onChange={e=>updateItem(i,"qty",e.target.value)} placeholder={t.qty} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr", textAlign: "center" }} />
              </div>
              <div>
                {i===0 && <label style={{ fontSize: 11, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.price}</label>}
                <input type="number" value={item.price} onChange={e=>updateItem(i,"price",e.target.value)} placeholder={t.price} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr", textAlign: "center" }} />
              </div>
              <div>
                {i===0 && <label style={{ fontSize: 11, color: s.textMuted, textAlign: "center", display: "block", marginBottom: 3 }}>{t.note}</label>}
                <input value={item.note} onChange={e=>updateItem(i,"note",e.target.value)} placeholder={t.note} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, textAlign: "center" }} />
              </div>
              {form.items.length > 1 && (
                <button onClick={()=>removeItem(i)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", marginTop: i===0?20:0 }}>
                  <I.Trash />
                </button>
              )}
            </div>
          ))}

          <button onClick={addItem} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer", marginBottom: 15, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <I.Plus /> {t.addItem}
          </button>

          <div style={{ padding: "12px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "center", marginBottom: 15 }}>
            <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 16 }}>{t.total}: {form.currency==="usd"?"$":""}{fmt(total)} {form.currency==="usd"?t.usd:t.iqd}</span>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding: "8px 24px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>DATE</TH>
                <TH isRtl={isRtl}>INVOICE #</TH>
                <TH isRtl={isRtl}>{t.billTo}</TH>
                <TH isRtl={isRtl}>{t.total}</TH>
                <TH isRtl={isRtl}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", minWidth: 95 }}>{inv.date}</TD>
                  <TD s={s} style={{ fontWeight: 600, minWidth: 80 }}>{inv.invoiceNo}</TD>
                  <TD s={s} style={{ minWidth: 100 }}>{inv.billTo || "-"}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 700, color: PRIMARY, minWidth: 100 }}>
                    {inv.currency==="usd"?"$":""}{fmt(inv.total)} {inv.currency==="usd"?t.usd:t.iqd}
                  </TD>
                  <TD s={s} style={{ minWidth: 120 }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button onClick={()=>printInv(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer" }} title={t.print}>
                        <I.Printer />
                      </button>
                      <button onClick={()=>setPreview(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer" }} title={t.viewInvoice}>
                        <I.Eye />
                      </button>
                      {!isFrozen && (
                        <>
                          <button onClick={()=>handleEdit(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer" }} title={t.edit}>
                            <I.Edit />
                          </button>
                          <button onClick={()=>setConfirmDel(inv.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer" }} title={t.delete}>
                            <I.Trash />
                          </button>
                        </>
                      )}
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted, fontSize: 13 }}>{t.noData}</div>}
        </div>
      </div>

      {preview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, padding: 30, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ textAlign: "center", borderBottom: `3px solid ${PRIMARY}`, paddingBottom: 10, marginBottom: 12 }}>
              <h2 style={{ color: PRIMARY, margin: 0, fontSize: 24 }}>KARO GROUP</h2>
              <p style={{ color: "#666", fontSize: 12, margin: "5px 0", direction: "ltr" }}>{PHONE} | {EMAIL}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
              <div><strong>DATE:</strong> {preview.date}</div>
              <div><strong>INVOICE #:</strong> {preview.invoiceNo}</div>
            </div>
            {preview.billTo && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 15 }}>
                <div><strong>BILL TO:</strong> {preview.billTo}</div>
                {preview.billPhone && <div><strong>Phone:</strong> {preview.billPhone}</div>}
              </div>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 15 }}>
              <thead>
                <tr style={{ background: PRIMARY, color: "#fff" }}>
                  <th style={{ padding: "8px", textAlign: "center" }}>#</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>{t.itemName}</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>{t.qty}</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>{t.price}</th>
                  <th style={{ padding: "8px", textAlign: "center" }}>{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map((it,i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px", textAlign: "center" }}>{i+1}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{it.name}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{it.qty}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{preview.currency==="usd"?"$":""}{fmt(it.price)}</td>
                    <td style={{ padding: "8px", fontWeight: 600, textAlign: "center" }}>
                      {preview.currency==="usd"?"$":""}{fmt(Number(it.qty||0)*Number(it.price||0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", fontSize: 18, fontWeight: 800, color: PRIMARY }}>
              {t.total}: {preview.currency==="usd"?"$":""}{fmt(preview.total)} {preview.currency==="usd"?t.usd:t.iqd}
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={()=>setPreview(null)} style={{ padding: "8px 24px", borderRadius: 6, border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontSize: 13 }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <EditModal title={t.edit} onSave={handleEditSave} onCancel={() => { setEditModalOpen(false); setForm({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] }); }} s={s} t={t}>
          <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "0 5px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 15 }}>
              <div>
                <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>DATE</label>
                <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>INVOICE #</label>
                <input value={form.invoiceNo} onChange={e=>setForm({...form,invoiceNo:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>{t.currency}</label>
                <select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }}>
                  <option value="iqd">{t.iqd}</option>
                  <option value="usd">{t.usd}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>BILL TO</label>
                <input value={form.billTo} onChange={e=>setForm({...form,billTo:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, textAlign: "center" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 5, textAlign: "center" }}>Phone</label>
                <input value={form.billPhone} onChange={e=>setForm({...form,billPhone:e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
              </div>
            </div>

            {form.items.map((item,i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input value={item.name} onChange={e=>updateItem(i,"name",e.target.value)} placeholder={t.itemName} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, textAlign: "center" }} />
                <input type="number" value={item.qty} onChange={e=>updateItem(i,"qty",e.target.value)} placeholder={t.qty} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr", textAlign: "center" }} />
                <input type="number" value={item.price} onChange={e=>updateItem(i,"price",e.target.value)} placeholder={t.price} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr", textAlign: "center" }} />
                <input value={item.note} onChange={e=>updateItem(i,"note",e.target.value)} placeholder={t.note} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, textAlign: "center" }} />
                {form.items.length > 1 && (
                  <button onClick={()=>removeItem(i)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer" }}>
                    <I.Trash />
                  </button>
                )}
              </div>
            ))}

            <button onClick={addItem} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer", margin: "10px 0", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <I.Plus /> {t.addItem}
            </button>

            <div style={{ padding: "12px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "center", marginTop: 10 }}>
              <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 16 }}>{t.total}: {form.currency==="usd"?"$":""}{fmt(total)} {form.currency==="usd"?t.usd:t.iqd}</span>
            </div>
          </div>
        </EditModal>
      )}

      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={()=>doDelete(confirmDel)} onNo={()=>setConfirmDel(null)} s={s} t={t} />}
    </div>
  );
}

// ==================== BACKUP ====================
function BackupPage({ t, s, pKey, isFrozen }) {
  const handleDownload = () => {
    const data = {};
    for (let i=0;i<localStorage.length;i++) { 
      const k=localStorage.key(i); 
      if(k?.startsWith("karo_") && (k.includes(pKey) || k === "karo_users" || k === "karo_messages")) 
        data[k]=localStorage.getItem(k); 
    }
    const b = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`karo_backup_${pKey}_${today()}.json`; a.click();
  };
  
  const handleUpload = e => {
    if (isFrozen) {
      alert(t.frozen);
      return;
    }
    
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{ 
      try { 
        const d=JSON.parse(ev.target.result); 
        Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,v)); 
        alert(t.backupSuccess); 
        window.location.reload(); 
      } catch {
        alert("Error");
      }
    };
    r.readAsText(f); 
    e.target.value="";
  };
  
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: PRIMARY, textAlign: "center" }}>{t.sidebar.backup}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 20 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 30, textAlign: "center" }}>
          <I.Download size={50} />
          <h3 style={{ margin: "15px 0 8px", fontWeight: 700, fontSize: 16, textAlign: "center" }}>{t.downloadBackup}</h3>
          <button onClick={handleDownload} style={{ padding: "10px 30px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>
            <I.Download /> {t.downloadBackup}
          </button>
        </div>
        {!isFrozen && (
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 30, textAlign: "center" }}>
            <I.Upload size={50} />
            <h3 style={{ margin: "15px 0 8px", fontWeight: 700, fontSize: 16, textAlign: "center" }}>{t.uploadBackup}</h3>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "10px 30px", borderRadius: 6, background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: 10 }}>
              <I.Upload /> {t.uploadBackup}
              <input type="file" accept=".json" onChange={handleUpload} style={{ display: "none" }} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== HISTORY ====================
function HistoryPage({ t, s, isRtl, pKey }) {
  const myLog = getLS("karo_cashLog_" + pKey, []);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-30);
  const cs = cutoff.toISOString().split("T")[0];
  const recent = myLog.filter(l=>l.date>=cs);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 5, color: PRIMARY, textAlign: "center" }}>{t.sidebar.history}</h1>
      <p style={{ color: s.textMuted, fontSize: 13, marginBottom: 15, textAlign: "center" }}>30 {t.date}</p>
      
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
        <div style={{ overflowX: "auto", height: "100%" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <TH isRtl={isRtl}>{t.date}</TH>
                <TH isRtl={isRtl}>{t.type}</TH>
                <TH isRtl={isRtl}>{t.iqd}</TH>
                <TH isRtl={isRtl}>{t.usd}</TH>
                <TH isRtl={isRtl}>{t.cashIQD}</TH>
                <TH isRtl={isRtl}>{t.cashUSD}</TH>
              </tr>
            </thead>
            <tbody>
              {[...recent].reverse().map(log => (
                <tr key={log.id} style={{ textAlign: "center" }}>
                  <TD s={s} style={{ direction: "ltr", fontSize: 12, minWidth: 85 }}>{log.date} {log.time}</TD>
                  <TD s={s} style={{ minWidth: 200 }}>{log.desc}</TD>
                  <TD s={s} style={{ direction: "ltr", color: log.iqd>=0?s.success:s.danger, fontWeight: 600, minWidth: 80 }}>
                    {log.iqd>=0?"+":""}{fmt(log.iqd)}
                  </TD>
                  <TD s={s} style={{ direction: "ltr", color: log.usd>=0?s.success:s.danger, fontWeight: 600, minWidth: 70 }}>
                    {log.usd>=0?"+":""}${fmt(log.usd)}
                  </TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 90, color: PRIMARY }}>{fmt(log.balIQD)}</TD>
                  <TD s={s} style={{ direction: "ltr", fontWeight: 600, minWidth: 80, color: PRIMARY }}>${fmt(log.balUSD)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length===0 && <div style={{ padding: 50, textAlign: "center", color: s.textMuted, fontSize: 14 }}>{t.noData}</div>}
        </div>
      </div>
    </div>
  );
}

// ==================== MONTHLY ====================
function MonthlyPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate }) {
  const [dateFrom, setDateFrom] = useState(today().slice(0,8)+"01");
  const [dateTo, setDateTo] = useState(today());
  const [activeTab, setActiveTab] = useState("summary");
  const [sizeModal, setSizeModal] = useState(null);
  const [reportCurrency, setReportCurrency] = useState("iqd");
  const [reportRate, setReportRate] = useState(exchangeRate);
  const [withDeposit, setWithDeposit] = useState(false);

  const exp = getLS(`karo_exp_${pKey}`,[]).filter(i=>i.date>=dateFrom&&i.date<=dateTo);
  const conc = getLS(`karo_conc_${pKey}`,[]).filter(i=>i.date>=dateFrom&&i.date<=dateTo);

  const calculateInCurrency = (amountIQD, amountUSD) => {
    if (reportCurrency === "iqd") {
      return Math.round(Number(amountIQD||0) + Number(amountUSD||0) * reportRate);
    } else {
      return Math.round(Number(amountUSD||0) + Number(amountIQD||0) / reportRate);
    }
  };



  const tExp = exp.reduce((a,b) => a + calculateInCurrency(Number(b.amountIQD||0), Number(b.amountUSD||0)), 0);





  const tConcRec = conc.reduce((a,b) => a + calculateInCurrency(b.currency==="iqd"?Number(b.received||0):0, b.currency==="usd"?Number(b.received||0):0), 0);





  const tConcDep = conc.reduce((a,b) => a + calculateInCurrency(b.currency==="iqd"?Number(b.deposit||0):0, b.currency==="usd"?Number(b.deposit||0):0), 0);





  const tMeters = conc.reduce((a,b) => a + Number(b.meters||0), 0);
  const avgPrice = conc.length > 0 
    ? Math.round(conc.reduce((a,b) => a + (Number(b.totalPrice||0) / (Number(b.meters||0) || 1)), 0) / conc.length) 
    : 0;

  const tConcTotal = withDeposit ? tConcRec + tConcDep : tConcRec;
  const profit = tConcTotal - tExp;

  const tabs = [
    { id: "summary", label: t.reportsTitle },
    { id: "expenses", label: t.sidebar.expenses },
    { id: "concrete", label: t.sidebar.concrete },
  ];

  const doExport = (type, size) => {
    const currencyLabel = reportCurrency === "iqd" ? t.iqd : t.usd;
    const symbol = reportCurrency === "usd" ? "$" : "";
    
    const hdrs = [t.type, currencyLabel];
    const rows = [
      [t.totalExpIQD, symbol + fmt(tExp)],
      [t.totalConcreteReceived, symbol + fmt(tConcRec)],
      [t.totalDeposit, symbol + fmt(tConcDep)],
      [t.totalMeters, fmt(tMeters)],
      [t.avgPricePerMeter, symbol + fmt(avgPrice)],
      [t.profitLoss, symbol + fmt(Math.abs(profit)) + (profit >= 0 ? ` ${t.profit}` : ` ${t.loss}`)]
    ];
    
    if (type==="pdf") doPrint({ title: `${t.sidebar.monthlyReport} ${dateFrom} - ${dateTo} (${currencyLabel})`, headers: hdrs, rows, size, isRtl });
    else doExcel({ title: `monthly_${dateFrom}_${dateTo}_${reportCurrency}`, headers: hdrs, rows });
    setSizeModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: PRIMARY, textAlign: "center" }}>{t.sidebar.monthlyReport}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={()=>setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
          <button onClick={()=>setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
        </div>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 15, marginBottom: 15, display: "flex", gap: 15, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center" }}>
        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.selectCurrency}</label>
          <select value={reportCurrency} onChange={e=>setReportCurrency(e.target.value)} style={{ padding: "8px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, minWidth: 130, textAlign: "center" }}>
            <option value="iqd">{t.iqd}</option>
            <option value="usd">{t.usd}</option>
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.exchangeRateForReport}</label>
          <input type="number" value={reportRate} onChange={e=>setReportRate(Number(e.target.value))} style={{ padding: "8px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, width: 130, direction: "ltr", textAlign: "center" }} />
        </div>
        
        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.deposit}</label>
          <select value={withDeposit} onChange={e=>setWithDeposit(e.target.value==="true")} style={{ padding: "8px 15px", borderRadius: 6, border: "1px solid "+s.border, background: s.bgCard2, color: s.text, fontSize: 13, minWidth: 130, textAlign: "center" }}>
            <option value="false">قازانج بە بێ پارەی تەئمین</option>
            <option value="true">قازانج بە پارەی تەئمینەوە</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.from}</label>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ padding: "8px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 3, textAlign: "center" }}>{t.to}</label>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ padding: "8px 15px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr", textAlign: "center" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 15, justifyContent: "center" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ 
            padding: "8px 20px", 
            borderRadius: 6, 
            border: activeTab===tab.id?"none":`1px solid ${s.border}`, 
            background: activeTab===tab.id?PRIMARY:s.bgCard2, 
            color: activeTab===tab.id?"#fff":s.text, 
            fontSize: 13, 
            fontWeight: 600, 
            cursor: "pointer" 
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 15 }}>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${s.danger}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.totalExpIQD} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.danger }}>{reportCurrency === "usd" ? "$" : ""}{fmt(tExp)}</div>
          </div>
          
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${s.success}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.totalConcreteReceived} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.success }}>{reportCurrency === "usd" ? "$" : ""}{fmt(tConcRec)}</div>
          </div>
          
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${s.warning}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.totalDeposit} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.warning }}>{reportCurrency === "usd" ? "$" : ""}{fmt(tConcDep)}</div>
          </div>

          {withDeposit && (
            <div style={{ background: s.bgCard, border: "1px solid "+s.border, borderRadius: 12, padding: 20, textAlign: "center", borderTop: "4px solid #06B6D4" }}>
              <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.totalConcreteReceived} + {t.deposit} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#06B6D4" }}>{reportCurrency === "usd" ? "$" : ""}{fmt(tConcTotal)}</div>
            </div>
          )}

          
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${PRIMARY}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.totalMeters}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{fmt(tMeters)}</div>
          </div>
          
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${PRIMARY}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.avgPricePerMeter} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{reportCurrency === "usd" ? "$" : ""}{fmt(avgPrice)}</div>
          </div>
          
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, textAlign: "center", borderTop: `4px solid ${profit>=0?s.success:s.danger}` }}>
            <div style={{ fontSize: 12, color: s.textMuted, marginBottom: 8 }}>{t.profitLoss} ({reportCurrency === "iqd" ? t.iqd : t.usd})</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: profit>=0?s.success:s.danger }}>
              {reportCurrency === "usd" ? "$" : ""}{fmt(Math.abs(profit))} {profit>=0 ? t.profit : t.loss}
            </div>
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
          <div style={{ overflowX: "auto", height: "100%" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <TH isRtl={isRtl}>{t.amountIQD}</TH>
                  <TH isRtl={isRtl}>{t.amountUSD}</TH>
                  <TH isRtl={isRtl}>{t.receiptNo}</TH>
                  <TH isRtl={isRtl}>{t.note}</TH>
                  <TH isRtl={isRtl}>{t.date}</TH>
                </tr>
              </thead>
              <tbody>
                {exp.map(item => (
                  <tr key={item.id}>
                    <TD s={s} style={{ direction: "ltr" }}>{Number(item.amountIQD)?fmt(item.amountIQD):"-"}</TD>
                    <TD s={s} style={{ direction: "ltr" }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"-"}</TD>
                    <TD s={s}>{item.receiptNo || "-"}</TD>
                    <TD s={s}>{item.note || "-"}</TD>
                    <TD s={s} style={{ direction: "ltr" }}>{item.date}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {exp.length===0 && <div style={{ padding: 50, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {activeTab === "concrete" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
          <div style={{ overflowX: "auto", height: "100%" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <TH isRtl={isRtl}>{t.date}</TH>
                  <TH isRtl={isRtl}>{t.currency}</TH>
                  <TH isRtl={isRtl}>{t.meters}</TH>
                  <TH isRtl={isRtl}>{t.pricePerMeter}</TH>
                  <TH isRtl={isRtl}>{t.totalConcrete}</TH>
                  <TH isRtl={isRtl}>{t.deposit}</TH>
                  <TH isRtl={isRtl}>{t.received}</TH>
                </tr>
              </thead>
              <tbody>
                {conc.map(item => (
                  <tr key={item.id}>
                    <TD s={s} style={{ direction: "ltr" }}>{item.date}</TD>
                    <TD s={s}>{item.currency === "usd" ? t.usd : t.iqd}</TD>
                    <TD s={s} style={{ direction: "ltr" }}>{fmt(item.meters)}</TD>
                    <TD s={s} style={{ direction: "ltr" }}>{fmt(item.pricePerMeter)}</TD>
                    <TD s={s} style={{ direction: "ltr", fontWeight: 700, color: PRIMARY }}>{fmt(item.totalPrice)}</TD>
                    <TD s={s} style={{ direction: "ltr", color: s.warning }}>{fmt(item.deposit)}</TD>
                    <TD s={s} style={{ direction: "ltr", color: s.success }}>{fmt(item.received)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {conc.length===0 && <div style={{ padding: 50, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
    </div>
  );
}
