"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const t = useTranslations("tools.invoice-generator");
  const [company, setCompany] = useState("Acme Design Studio");
  const [client, setClient] = useState("Global Tech Solutions");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [date, setDate] = useState("2026-07-30");
  const [dueDate, setDueDate] = useState("2026-08-13");
  const [taxRate, setTaxRate] = useState(10);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "Web Development", quantity: 1, rate: 100 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="invoice-generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.company")}
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t("labels.companyPlaceholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.client")}
              </label>
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder={t("labels.clientPlaceholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.invoiceNumber")}
              </label>
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder={t("labels.invoiceNumberPlaceholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.taxRate")}
              </label>
              <input
                type="number"
                min={0}
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.date")}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.dueDate")}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">{t("labels.items")}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="grid gap-2 sm:grid-cols-12 items-end">
                  <div className="sm:col-span-5">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder={t("labels.itemDescription")}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      placeholder={t("labels.qty")}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      placeholder={t("labels.rate")}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="w-full rounded-lg bg-red-900/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/60 disabled:opacity-40"
                    >
                      {t("buttons.remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              {t("buttons.addItem")}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div
            id="invoice-preview"
            className="rounded-xl border border-zinc-300 bg-white p-6 text-zinc-900 print:shadow-none"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{company || t("labels.yourCompany")}</h2>
                <p className="text-sm text-zinc-600">{t("labels.invoice")} #{invoiceNumber || "—"}</p>
              </div>
              <div className="text-right text-sm text-zinc-600">
                <p>{t("labels.date")}: {date || "—"}</p>
                <p>{t("labels.dueDate")}: {dueDate || "—"}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-zinc-500">{t("labels.billTo")}</p>
              <p className="text-lg font-medium">{client || t("labels.clientName")}</p>
            </div>

            <table className="mb-6 w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-300 text-left">
                  <th className="py-2">{t("labels.itemDescription")}</th>
                  <th className="py-2 text-right">{t("labels.qty")}</th>
                  <th className="py-2 text-right">{t("labels.rate")}</th>
                  <th className="py-2 text-right">{t("labels.amount")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-200">
                    <td className="py-2">{item.description || "—"}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-2 text-right">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end space-y-1 text-sm">
              <div className="flex w-48 justify-between">
                <span className="text-zinc-600">{t("labels.subtotal")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex w-48 justify-between">
                <span className="text-zinc-600">{t("labels.tax")} ({taxRate}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex w-48 justify-between text-lg font-bold">
                <span>{t("labels.total")}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors print:hidden"
          >
            {t("buttons.print")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
