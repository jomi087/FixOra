import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
  },
  // Header Section
  headerContainer: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2563eb",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e40af",
    letterSpacing: 1,
  },
  bookingInfoBox: {
    backgroundColor: "#eff6ff",
    padding: 4,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: "#2563eb",
  },
  bookingInfoText: {
    fontSize: 9,
    color: "#1e40af",
    marginBottom: 2,
    fontWeight: "bold",
  },
  // Section Styles
  section: {
    marginBottom: 10,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#3b82f6",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 9,
    marginBottom: 3,
    color: "#334155",
    lineHeight: 1.3,
  },
  textLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
  },
  // Payment Table
  paymentSection: {
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
  },
  table: {
    marginTop: 4,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 5,
    borderRadius: 3,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
    flex: 1,
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    padding: 5,
    marginTop: 4,
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  totalAmount: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "right",
  },
  // Payment Details
  paymentDetails: {
    backgroundColor: "#ffffff",
    padding: 5,
    borderRadius: 4,
    marginTop: 4,
  },
  // Parts Section
  partsContainer: {
    marginTop: 6,
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  partItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  partName: {
    fontSize: 11,
    color: "#334155",
  },
  partCost: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#059669",
  },
  // Footer
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#e2e8f0",
    textAlign: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#64748b",
    fontStyle: "italic",
  },
  // Diagnosis Section
  diagnosisSection: {
    marginBottom: 10,
    backgroundColor: "#fefce8",
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#eab308",
  },
  // Work Proof Section
  workProofSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    gap: 5,
  },
  workImage: {
    width: "20%",
    height: 80,
    objectFit: "cover",
    borderRadius: 3,
    border: "2px solid #e2e8f0",
  },
});