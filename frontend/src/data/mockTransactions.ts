export interface TransactionData {
  transactionId: string;
  senderName: string;
  senderAccountId: string;
  receiverAccountId: string;
  serviceArea: string;
  description: string;
  paymentTerm: string;
  percentageRange: string;
  amount: number;
  escrowPercentage: number;
  senderRating?: number; // rating given to the sender
  receiverRating?: number; // rating given to the receiver
  transactionRating?: number; // overall rating for the transaction
}

export const mockTransactions: TransactionData[] = [
  {
    transactionId: "TXN-2025-001234",
    senderName: "Johnson Kwaku",
    senderAccountId: "WSP-123456789-A",
    receiverAccountId: "WSP-987654321-B",
    serviceArea: "Construction",
    description:
      "Complete renovation of residential property including painting, flooring, and electrical work. Project must meet building standards and pass inspection.",
    paymentTerm: "Milestones",
    percentageRange: "40–50%",
    amount: 5000,
    escrowPercentage: 50,
    senderRating: 4.8,
    receiverRating: 4.6,
    transactionRating: 4.7,
  },
  {
    transactionId: "TXN-2025-001235",
    senderName: "Ama Serwaa",
    senderAccountId: "WSP-234567890-B",
    receiverAccountId: "WSP-987654321-B",
    serviceArea: "Consulting",
    description:
      "Business strategy consultation for startup company. Includes market analysis, business model development, and financial projections.",
    paymentTerm: "Net 30",
    percentageRange: "30–40%",
    amount: 3500,
    escrowPercentage: 50,
    senderRating: 4.5,
    receiverRating: 4.9,
    transactionRating: 4.7,
  },
  {
    transactionId: "TXN-2025-001236",
    senderName: "Kofi Mensah",
    senderAccountId: "WSP-345678901-C",
    receiverAccountId: "WSP-987654321-B",
    serviceArea: "Transportation",
    description:
      "Weekly logistics and delivery services for wholesale business. Includes pickup, transport, and delivery of goods across the region.",
    paymentTerm: "Upon Delivery",
    percentageRange: "20–30%",
    amount: 2000,
    escrowPercentage: 50,
    senderRating: 4.3,
    receiverRating: 4.6,
    transactionRating: 4.4,
  },
  {
    transactionId: "TXN-2025-001237",
    senderName: "Abena Osei",
    senderAccountId: "WSP-456789012-D",
    receiverAccountId: "WSP-987654321-B",
    serviceArea: "Events & Entertainment",
    description:
      "Complete event planning and management for corporate annual gala. Includes venue, catering, entertainment, and technical setup.",
    paymentTerm: "50/50 (Upfront/Completion)",
    percentageRange: "40–50%",
    amount: 8000,
    escrowPercentage: 50,
    senderRating: 4.9,
    receiverRating: 5.0,
    transactionRating: 4.95,
  },
];

export const getTransactionById = (id: string) =>
  mockTransactions.find((t) => t.transactionId === id) || null;
