// Seed data for the Ethiopian Economics Association (EEA) accounting workspace.
// Sourced from the user-supplied CSV sheets (ChartOfAccounts, Customers_Donors,
// Members, Vendors, DonationsAndGrants, MembershipIncome, ConferenceIncome,
// Expenses, Projects). Amounts are in Ethiopian Birr (ETB).

export const cashflowData = [
  { month: "Jan", income: 1_956_250, expenses: 117_000 },
  { month: "Feb", income: 800_000, expenses: 265_500 },
  { month: "Mar", income: 60_000, expenses: 0 },
  { month: "Apr", income: 15_000, expenses: 0 },
  { month: "May", income: 0, expenses: 0 },
  { month: "Jun", income: 0, expenses: 0 },
];

export const recentTransactions = [
  { id: "TXN-1010", date: "2026-02-28", description: "Staff Payroll — January", category: "Staff Salaries", account: "Commercial Bank of Ethiopia", amount: -240000, type: "debit" as const },
  { id: "TXN-1009", date: "2026-02-15", description: "IFPRI Ethiopia — GRANT-004", category: "Research Grant Income", account: "Commercial Bank of Ethiopia", amount: 300000, type: "credit" as const },
  { id: "TXN-1008", date: "2026-02-05", description: "Addis Transport Services — Research travel", category: "Travel & Field Work", account: "Awash Bank Operating Account", amount: -18000, type: "debit" as const },
  { id: "TXN-1007", date: "2026-02-01", description: "Friedrich Ebert Stiftung — GRANT-003", category: "Research Grant Income", account: "Commercial Bank of Ethiopia", amount: 500000, type: "credit" as const },
  { id: "TXN-1006", date: "2026-02-01", description: "Sunshine Stationery — Office materials", category: "Office Supplies", account: "Cash on Hand", amount: -7500, type: "debit" as const },
  { id: "TXN-1005", date: "2026-01-25", description: "Hilton Addis Ababa — Conference hall", category: "Conference Expenses", account: "Commercial Bank of Ethiopia", amount: -80000, type: "debit" as const },
  { id: "TXN-1004", date: "2026-01-15", description: "USAID Ethiopia — GRANT-002", category: "Research Grant Income", account: "Commercial Bank of Ethiopia", amount: 1200000, type: "credit" as const },
  { id: "TXN-1003", date: "2026-01-15", description: "Commercial Printing PLC — Research reports", category: "Printing & Publications", account: "Awash Bank Operating Account", amount: -25000, type: "debit" as const },
  { id: "TXN-1002", date: "2026-01-10", description: "Ethio Telecom — Internet service", category: "Utilities & Internet", account: "Awash Bank Operating Account", amount: -12000, type: "debit" as const },
  { id: "TXN-1001", date: "2026-01-05", description: "World Bank Ethiopia — GRANT-001", category: "Research Grant Income", account: "Commercial Bank of Ethiopia", amount: 750000, type: "credit" as const },
];

export const outstandingInvoices = [
  { number: "INV-2026-005", customer: "USAID Ethiopia", due: "2026-06-30", amount: 400000, status: "Sent" },
  { number: "INV-2026-004", customer: "World Bank Ethiopia", due: "2026-06-22", amount: 250000, status: "Sent" },
  { number: "INV-2026-003", customer: "Addis Ababa University", due: "2026-06-15", amount: 5000, status: "Viewed" },
  { number: "INV-2026-002", customer: "IFPRI Ethiopia", due: "2026-06-10", amount: 150000, status: "Overdue" },
  { number: "INV-2026-001", customer: "Friedrich Ebert Stiftung", due: "2026-07-05", amount: 200000, status: "Draft" },
];

export const upcomingBills = [
  { id: "BILL-104", vendor: "Ethio Telecom", due: "2026-06-10", amount: 12000, category: "Utilities & Internet", status: "Scheduled" },
  { id: "BILL-103", vendor: "Hilton Addis Ababa", due: "2026-06-15", amount: 80000, category: "Conference Expenses", status: "Due soon" },
  { id: "BILL-102", vendor: "Commercial Printing PLC", due: "2026-06-20", amount: 25000, category: "Printing & Publications", status: "Pending" },
  { id: "BILL-101", vendor: "Addis Transport Services", due: "2026-06-25", amount: 18000, category: "Travel & Field Work", status: "Scheduled" },
];

export const bankAccounts = [
  { name: "Cash on Hand", last4: "—", balance: 50000, inBank: 50000, inBooks: 50000 },
  { name: "Commercial Bank of Ethiopia", last4: "4821", balance: 1800000, inBank: 1800000, inBooks: 1782000 },
  { name: "Awash Bank Operating Account", last4: "9043", balance: 600000, inBank: 600000, inBooks: 600000 },
];

export const tasks = [
  { id: 1, label: "Approve February payroll journal entry", due: "Today", priority: "high" as const },
  { id: 2, label: "Send membership renewal reminders (3)", due: "Tomorrow", priority: "med" as const },
  { id: 3, label: "Reconcile CBE account — February", due: "Jun 9", priority: "med" as const },
  { id: 4, label: "File Q1 VAT return", due: "Jul 15", priority: "low" as const },
];

export const customers = [
  "World Bank Ethiopia",
  "USAID Ethiopia",
  "Friedrich Ebert Stiftung",
  "IFPRI Ethiopia",
  "Addis Ababa University",
];

export const customerDirectory = [
  { name: "World Bank Ethiopia", type: "Institutional Donor", email: "ethiopia@worldbank.org", phone: "+251111000000" },
  { name: "USAID Ethiopia", type: "Institutional Donor", email: "info@usaid.gov", phone: "+251111000001" },
  { name: "Friedrich Ebert Stiftung", type: "Institutional Donor", email: "info@fes.de", phone: "+251111000002" },
  { name: "IFPRI Ethiopia", type: "Institutional Donor", email: "ethiopia@ifpri.org", phone: "+251111000003" },
  { name: "Addis Ababa University", type: "Institutional Member", email: "info@aau.edu.et", phone: "+251111000004" },
];

export const members = [
  { id: "M001", type: "Full Member", name: "Dr. Bekele Demissie", fee: 500 },
  { id: "M002", type: "Full Member", name: "Prof. Sara Tadesse", fee: 500 },
  { id: "M003", type: "Associate Member", name: "Abel Worku", fee: 150 },
  { id: "M004", type: "Student Member", name: "Mesfin Alemu", fee: 100 },
  { id: "M005", type: "Institutional Member", name: "Addis Ababa University", fee: 5000 },
];

export const grants = [
  { date: "2026-01-05", donor: "World Bank Ethiopia", reference: "GRANT-001", amount: 750000, account: "Research Grant Income" },
  { date: "2026-01-15", donor: "USAID Ethiopia", reference: "GRANT-002", amount: 1200000, account: "Research Grant Income" },
  { date: "2026-02-01", donor: "Friedrich Ebert Stiftung", reference: "GRANT-003", amount: 500000, account: "Research Grant Income" },
  { date: "2026-02-15", donor: "IFPRI Ethiopia", reference: "GRANT-004", amount: 300000, account: "Research Grant Income" },
];

export const expenseCategories = [
  { name: "Staff Salaries", value: 240000, color: "var(--color-chart-1)" },
  { name: "Conference Expenses", value: 80000, color: "var(--color-chart-2)" },
  { name: "Printing & Publications", value: 25000, color: "var(--color-chart-3)" },
  { name: "Travel & Field Work", value: 18000, color: "var(--color-chart-4)" },
  { name: "Utilities & Internet", value: 12000, color: "var(--color-chart-5)" },
  { name: "Office Supplies", value: 7500, color: "var(--color-chart-1)" },
];

export const aiInsights = [
  { id: 1, kind: "opportunity", title: "Grant income up 38% vs prior quarter", body: "Four institutional grants worth ETB 2,750,000 received YTD. Consider scheduling restricted-fund reporting for donors.", tone: "positive" as const },
  { id: 2, kind: "warning", title: "Conference Expenses near program budget", body: "Hilton Addis Ababa booking (ETB 80,000) consumes 53% of the Annual Conference budget. Confirm remaining catering line items.", tone: "warning" as const },
  { id: 3, kind: "action", title: "IFPRI invoice INV-2026-002 overdue", body: "ETB 150,000 outstanding past due date. Auto-reminder scheduled for Monday.", tone: "neutral" as const },
];

export const activityFeed = [
  { id: 1, who: "Hanna Girma", action: "approved grant receipt", target: "GRANT-004 — IFPRI (ETB 300,000)", time: "12m ago" },
  { id: 2, who: "Auto-rule", action: "categorized 4 transactions as", target: "Research Grant Income", time: "1h ago" },
  { id: 3, who: "Yonas Tesfaye", action: "created invoice", target: "INV-2026-005 for USAID Ethiopia", time: "3h ago" },
  { id: 4, who: "Bank feed", action: "imported 6 new transactions from", target: "Commercial Bank of Ethiopia ····4821", time: "5h ago" },
  { id: 5, who: "Selamawit Asfaw", action: "uploaded receipt for", target: "Conference hall — Hilton Addis Ababa", time: "Yesterday" },
  { id: 6, who: "System", action: "matched payroll journal to", target: "January staff salaries", time: "Yesterday" },
];

export const vendors = [
  { id: "V-01", name: "Ethio Telecom", category: "Utilities & Internet", outstanding: 12000, ytd: 12000, terms: "Net 30" },
  { id: "V-02", name: "Commercial Printing PLC", category: "Printing & Publications", outstanding: 0, ytd: 25000, terms: "Net 30" },
  { id: "V-03", name: "Hilton Addis Ababa", category: "Conference Expenses", outstanding: 0, ytd: 80000, terms: "On receipt" },
  { id: "V-04", name: "Sunshine Stationery", category: "Office Supplies", outstanding: 0, ytd: 7500, terms: "Net 15" },
  { id: "V-05", name: "Addis Transport Services", category: "Travel & Field Work", outstanding: 0, ytd: 18000, terms: "Net 30" },
  { id: "V-06", name: "Staff Payroll", category: "Staff Salaries", outstanding: 0, ytd: 240000, terms: "Monthly" },
];

export const products = [
  { sku: "PUB-001", name: "Ethiopian Economy Annual Report", type: "Inventory", price: 350, qty: 240, value: 84000, status: "In stock" },
  { sku: "PUB-002", name: "Policy Brief Series (set of 6)", type: "Inventory", price: 180, qty: 120, value: 21600, status: "In stock" },
  { sku: "PUB-003", name: "Working Paper — Macroeconomic Outlook", type: "Inventory", price: 120, qty: 18, value: 2160, status: "Low stock" },
  { sku: "TRN-001", name: "Research Methods Training (per seat)", type: "Service", price: 3500, qty: null as number | null, value: null, status: "Active" },
  { sku: "TRN-002", name: "Stata Workshop (per seat)", type: "Service", price: 5000, qty: null, value: null, status: "Active" },
  { sku: "MEM-FULL", name: "Annual Full Membership", type: "Service", price: 500, qty: null, value: null, status: "Active" },
];

export const employees = [
  { id: "E-01", name: "Dr. Tewodros Makonnen", role: "Executive Director", salary: 480000, status: "Active", method: "Direct deposit" },
  { id: "E-02", name: "Hanna Girma", role: "Finance Manager", salary: 360000, status: "Active", method: "Direct deposit" },
  { id: "E-03", name: "Yonas Tesfaye", role: "Research Coordinator", salary: 300000, status: "Active", method: "Direct deposit" },
  { id: "E-04", name: "Selamawit Asfaw", role: "Program Officer", salary: 240000, status: "Active", method: "Direct deposit" },
  { id: "E-05", name: "Daniel Belay", role: "Communications Lead", salary: 216000, status: "On leave", method: "Direct deposit" },
];

export const projects = [
  { id: "PRJ001", name: "Ethiopian Macroeconomic Outlook", client: "World Bank Ethiopia", budget: 1000000, billed: 750000, progress: 75, status: "On track" },
  { id: "PRJ002", name: "Agricultural Productivity Study", client: "USAID Ethiopia", budget: 1500000, billed: 1200000, progress: 80, status: "On track" },
  { id: "PRJ003", name: "Youth Employment Research", client: "Friedrich Ebert Stiftung", budget: 750000, billed: 500000, progress: 66, status: "At risk" },
  { id: "PRJ004", name: "Economic Policy Dialogue Program", client: "IFPRI Ethiopia", budget: 600000, billed: 300000, progress: 50, status: "On track" },
];

const coaTypeMap: Record<string, "Asset" | "Liability" | "Equity" | "Income" | "Expense"> = {
  Bank: "Asset",
  "Accounts Receivable": "Asset",
  "Other Current Asset": "Asset",
  "Fixed Asset": "Asset",
  "Accounts Payable": "Liability",
  "Other Current Liability": "Liability",
  Equity: "Equity",
  Income: "Income",
  Expense: "Expense",
};

const coaSeed: { code: string; name: string; rawType: string; detail: string; balance: number }[] = [
  { code: "1000", name: "Cash on Hand", rawType: "Bank", detail: "Checking", balance: 50000 },
  { code: "1010", name: "Commercial Bank of Ethiopia", rawType: "Bank", detail: "Checking", balance: 1800000 },
  { code: "1020", name: "Awash Bank Operating Account", rawType: "Bank", detail: "Checking", balance: 600000 },
  { code: "1100", name: "Accounts Receivable", rawType: "Accounts Receivable", detail: "Accounts Receivable", balance: 300000 },
  { code: "1200", name: "Prepaid Expenses", rawType: "Other Current Asset", detail: "Prepaid Expenses", balance: 25000 },
  { code: "1500", name: "Office Equipment", rawType: "Fixed Asset", detail: "Furniture and Fixtures", balance: 180000 },
  { code: "2000", name: "Accounts Payable", rawType: "Accounts Payable", detail: "Accounts Payable", balance: 95000 },
  { code: "2100", name: "Accrued Expenses", rawType: "Other Current Liability", detail: "Other Current Liabilities", balance: 32000 },
  { code: "2200", name: "Deferred Membership Revenue", rawType: "Other Current Liability", detail: "Unearned Revenue", balance: 6250 },
  { code: "3000", name: "Net Assets Without Restrictions", rawType: "Equity", detail: "Retained Earnings", balance: 1800000 },
  { code: "3100", name: "Net Assets With Donor Restrictions", rawType: "Equity", detail: "Opening Balance Equity", balance: 950000 },
  { code: "4000", name: "Membership Fees", rawType: "Income", detail: "Membership Income", balance: 6250 },
  { code: "4010", name: "Research Grant Income", rawType: "Income", detail: "Grant Income", balance: 2750000 },
  { code: "4020", name: "Training Income", rawType: "Income", detail: "Program Service Fees", balance: 0 },
  { code: "4030", name: "Conference Registration Income", rawType: "Income", detail: "Program Service Fees", balance: 75000 },
  { code: "4040", name: "Publication Sales", rawType: "Income", detail: "Sales of Product Income", balance: 0 },
  { code: "5000", name: "Research Program Expenses", rawType: "Expense", detail: "Program Expenses", balance: 0 },
  { code: "5100", name: "Conference Expenses", rawType: "Expense", detail: "Program Expenses", balance: 80000 },
  { code: "5200", name: "Training Expenses", rawType: "Expense", detail: "Program Expenses", balance: 0 },
  { code: "5300", name: "Staff Salaries", rawType: "Expense", detail: "Wages", balance: 240000 },
  { code: "5400", name: "Office Rent", rawType: "Expense", detail: "Rent or Lease", balance: 0 },
  { code: "5500", name: "Utilities & Internet", rawType: "Expense", detail: "Utilities", balance: 12000 },
  { code: "5600", name: "Travel & Field Work", rawType: "Expense", detail: "Travel", balance: 18000 },
  { code: "5700", name: "Printing & Publications", rawType: "Expense", detail: "Printing", balance: 25000 },
  { code: "5800", name: "Bank Charges", rawType: "Expense", detail: "Bank Charges", balance: 0 },
];

export const chartOfAccounts = coaSeed.map((a) => ({
  code: a.code,
  name: a.name,
  type: coaTypeMap[a.rawType] ?? "Asset",
  detail: a.detail,
  balance: a.balance,
}));

export const budgetData = [
  { category: "Staff Salaries", budget: 280000, actual: 240000 },
  { category: "Conference Expenses", budget: 120000, actual: 80000 },
  { category: "Printing & Publications", budget: 30000, actual: 25000 },
  { category: "Travel & Field Work", budget: 25000, actual: 18000 },
  { category: "Utilities & Internet", budget: 14000, actual: 12000 },
  { category: "Office Supplies", budget: 10000, actual: 7500 },
];

export const leads = [
  { id: "L-01", name: "African Development Bank", contact: "Dr. Sisay Mengistu", stage: "Qualified", value: 1500000, owner: "Yonas Tesfaye" },
  { id: "L-02", name: "GIZ Ethiopia", contact: "Anna Müller", stage: "Proposal", value: 900000, owner: "Dr. Tewodros Makonnen" },
  { id: "L-03", name: "UNDP Ethiopia", contact: "Robel Hailu", stage: "Negotiation", value: 1200000, owner: "Hanna Girma" },
  { id: "L-04", name: "Mastercard Foundation", contact: "Aida Mohammed", stage: "New", value: 2000000, owner: "Dr. Tewodros Makonnen" },
];

export type RecordType = "invoice" | "bill" | "payment" | "expense" | "customer" | "tax" | "account";

export type LinkRef = {
  type: RecordType;
  id: string;
  label: string;
  amount?: number;
  /** "auto" links were matched by the rules engine; "manual" links were attached by a user. */
  source?: "auto" | "manual";
};

export type DocItem = {
  id: string;
  name: string;
  kind: "Receipt" | "Contract" | "Invoice" | "Bill" | "Tax" | "Statement";
  /** Legacy single-link fields — kept for table summaries. */
  linked: string;
  linkedType: "invoice" | "bill" | "expense" | "customer" | "tax" | "account";
  /** All records this document is attached to. Seeded from `linked` at load time. */
  links?: LinkRef[];
  size: string;
  date: string;
  uploadedBy: string;
  amount?: number;
  vendor?: string;
  tags: string[];
  /** Extracted OCR / body text used for full-text search */
  text: string;
};

export const payments = [
  { id: "PAY-501", customer: "World Bank Ethiopia", invoice: "INV-2026-001", date: "2026-01-05", amount: 750000, method: "Wire" },
  { id: "PAY-502", customer: "USAID Ethiopia", invoice: "INV-2026-002", date: "2026-01-15", amount: 1200000, method: "Wire" },
  { id: "PAY-503", customer: "Friedrich Ebert Stiftung", invoice: "INV-2026-003", date: "2026-02-01", amount: 500000, method: "Wire" },
  { id: "PAY-504", vendor: "Ethio Telecom", bill: "BILL-104", date: "2026-01-10", amount: 12000, method: "ACH" },
  { id: "PAY-505", vendor: "Hilton Addis Ababa", bill: "BILL-103", date: "2026-01-25", amount: 80000, method: "Cheque" },
  { id: "PAY-506", vendor: "Commercial Printing PLC", bill: "BILL-102", date: "2026-01-15", amount: 25000, method: "ACH" },
];

export const documents: DocItem[] = [
  {
    id: "D-01",
    name: "WorldBank-GRANT-001-receipt.pdf",
    kind: "Receipt",
    linked: "GRANT-001",
    linkedType: "expense",
    size: "184 KB",
    date: "Jan 5",
    uploadedBy: "Hanna Girma",
    amount: 750000,
    vendor: "World Bank Ethiopia",
    tags: ["grant", "restricted", "2026"],
    text: "World Bank Ethiopia grant disbursement notice GRANT-001 to Ethiopian Economics Association. Restricted to Ethiopian Macroeconomic Outlook project. Amount ETB 750,000 wired to Commercial Bank of Ethiopia.",
  },
  {
    id: "D-02",
    name: "USAID-grant-agreement-2026.pdf",
    kind: "Contract",
    linked: "USAID Ethiopia",
    linkedType: "customer",
    size: "1.4 MB",
    date: "Jan 12",
    uploadedBy: "Dr. Tewodros Makonnen",
    vendor: "USAID Ethiopia",
    tags: ["grant", "agreement", "agricultural", "2026"],
    text: "Cooperative agreement between USAID Ethiopia and Ethiopian Economics Association for Agricultural Productivity Study (PRJ002). Total award ETB 1,500,000.",
  },
  {
    id: "D-03",
    name: "INV-2026-001.pdf",
    kind: "Invoice",
    linked: "INV-2026-001",
    linkedType: "invoice",
    size: "92 KB",
    date: "Jan 4",
    uploadedBy: "System",
    amount: 750000,
    vendor: "World Bank Ethiopia",
    tags: ["sent", "grant-draw", "macroeconomic"],
    text: "Invoice INV-2026-001 to World Bank Ethiopia. First draw on Ethiopian Macroeconomic Outlook grant. Amount ETB 750,000.",
  },
  {
    id: "D-04",
    name: "Ethio-Telecom-internet-jan.pdf",
    kind: "Bill",
    linked: "BILL-104",
    linkedType: "bill",
    size: "120 KB",
    date: "Jan 10",
    uploadedBy: "Auto-import",
    amount: 12000,
    vendor: "Ethio Telecom",
    tags: ["utilities", "internet", "recurring"],
    text: "Ethio Telecom monthly business internet service for EEA head office. Subtotal ETB 10,440, VAT 1,560, total ETB 12,000.",
  },
  {
    id: "D-05",
    name: "Q1-VAT-return.pdf",
    kind: "Tax",
    linked: "VAT-Q1-2026",
    linkedType: "tax",
    size: "420 KB",
    date: "Apr 30",
    uploadedBy: "Hanna Girma",
    tags: ["VAT", "quarterly", "filed", "ERCA"],
    text: "Ethiopian Revenues and Customs Authority (ERCA) VAT return Q1 2026. Taxable receipts ETB 75,000 from conference registrations. VAT due ETB 11,250.",
  },
  {
    id: "D-06",
    name: "Hilton-conference-contract.pdf",
    kind: "Contract",
    linked: "Hilton Addis Ababa",
    linkedType: "customer",
    size: "640 KB",
    date: "Jan 20",
    uploadedBy: "Selamawit Asfaw",
    vendor: "Hilton Addis Ababa",
    tags: ["conference", "venue", "annual"],
    text: "Conference hall rental agreement with Hilton Addis Ababa for the Annual Ethiopian Economy Conference. Hall rental ETB 80,000, catering invoiced separately.",
  },
  {
    id: "D-07",
    name: "Addis-Transport-receipt-feb.jpg",
    kind: "Receipt",
    linked: "TXN-1008",
    linkedType: "expense",
    size: "1.1 MB",
    date: "Feb 5",
    uploadedBy: "Yonas Tesfaye",
    amount: 18000,
    vendor: "Addis Transport Services",
    tags: ["travel", "field-work", "research"],
    text: "Addis Transport Services receipt for Oromia and SNNPR field research trip. Vehicle hire 14,500, fuel 2,400, per-diem 1,100. Total ETB 18,000.",
  },
  {
    id: "D-08",
    name: "Sunshine-Stationery-feb.pdf",
    kind: "Bill",
    linked: "TXN-1006",
    linkedType: "bill",
    size: "78 KB",
    date: "Feb 1",
    uploadedBy: "Auto-import",
    amount: 7500,
    vendor: "Sunshine Stationery",
    tags: ["office", "supplies"],
    text: "Sunshine Stationery invoice. Office materials: A4 paper, printer toner, notebooks. Subtotal 6,520, VAT 980, total ETB 7,500.",
  },
  {
    id: "D-09",
    name: "CBE-statement-jan.pdf",
    kind: "Statement",
    linked: "Commercial Bank of Ethiopia",
    linkedType: "account",
    size: "1.6 MB",
    date: "Jan 31",
    uploadedBy: "Auto-import",
    vendor: "Commercial Bank of Ethiopia",
    tags: ["bank", "statement", "reconciled"],
    text: "Commercial Bank of Ethiopia business account statement January 2026. Opening balance ETB 720,000, deposits 1,950,000, withdrawals 320,000, ending balance ETB 2,350,000.",
  },
  {
    id: "D-10",
    name: "IFPRI-INV-2026-002.pdf",
    kind: "Invoice",
    linked: "INV-2026-002",
    linkedType: "invoice",
    size: "104 KB",
    date: "May 12",
    uploadedBy: "System",
    amount: 150000,
    vendor: "IFPRI Ethiopia",
    tags: ["sent", "overdue", "policy-dialogue"],
    text: "Invoice INV-2026-002 to IFPRI Ethiopia. Second milestone — Economic Policy Dialogue Program. Amount ETB 150,000, due Jun 10.",
  },
  {
    id: "D-11",
    name: "Commercial-Printing-jan.pdf",
    kind: "Bill",
    linked: "BILL-102",
    linkedType: "bill",
    size: "210 KB",
    date: "Jan 15",
    uploadedBy: "Hanna Girma",
    amount: 25000,
    vendor: "Commercial Printing PLC",
    tags: ["printing", "research-reports"],
    text: "Commercial Printing PLC invoice for 500 copies of the Ethiopian Macroeconomic Outlook research report. Unit cost 50, total ETB 25,000.",
  },
  {
    id: "D-12",
    name: "Annual-membership-roster-2026.pdf",
    kind: "Tax",
    linked: "MEM-2026",
    linkedType: "tax",
    size: "260 KB",
    date: "Jan 1",
    uploadedBy: "Selamawit Asfaw",
    tags: ["members", "roster", "annual"],
    text: "EEA 2026 annual membership roster. Full members 2, Associate 1, Student 1, Institutional 1. Total fees collected ETB 6,250.",
  },
];
