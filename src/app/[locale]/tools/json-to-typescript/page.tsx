"use client";

import JsonToCodeClient from "@/components/JsonToCodeClient";

const EXAMPLE = `{
  "id": 1001,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "isActive": true,
  "balance": 128.5,
  "avatar": null,
  "roles": ["admin", "editor"],
  "address": {
    "street": "12 Analytical St",
    "city": "London",
    "zipCode": "W1T 4JG"
  },
  "orders": [
    { "orderId": "A-1042", "total": 39.9, "paid": true },
    { "orderId": "A-1043", "total": 12.5, "paid": false }
  ]
}`;

export default function JsonToTypeScriptPage() {
  return (
    <JsonToCodeClient slug="json-to-typescript" lang="typescript" example={EXAMPLE} />
  );
}
