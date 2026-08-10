import fs from "fs";
import path from "path";

const messagesDir = path.join(process.cwd(), "messages");
const locales = ["en", "zh", "ja", "ko"];

const labels = {
  company: "Company",
  companyPlaceholder: "Your company name",
  client: "Client",
  clientPlaceholder: "Client name",
  invoiceNumber: "Invoice #",
  invoiceNumberPlaceholder: "INV-001",
  taxRate: "Tax Rate (%)",
  date: "Date",
  dueDate: "Due Date",
  items: "Items",
  itemDescription: "Description",
  qty: "Qty",
  rate: "Rate",
  amount: "Amount",
  subtotal: "Subtotal",
  tax: "Tax",
  total: "Total",
  yourCompany: "Your Company",
  invoice: "Invoice",
  billTo: "Bill To",
  clientName: "Client Name",
};

const buttons = {
  addItem: "Add Item",
  remove: "Remove",
  print: "Print / Save PDF",
};

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const tool = data.tools["invoice-generator"];
  if (tool) {
    tool.labels = labels;
    tool.buttons = buttons;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated messages/${locale}.json`);
}
