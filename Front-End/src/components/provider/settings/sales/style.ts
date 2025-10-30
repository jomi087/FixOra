import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  // HEADER
  headerContainer: {
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    letterSpacing: 1,
  },
  generatedBox: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    padding: 5,
    borderRadius: 4,
  },
  generatedText: {
    fontSize: 9,
    color: "#1e40af",
    fontWeight: "bold",
    marginBottom: 2,
  },

  content: {
    flexGrow: 1, // allows main content to expand and push footer to bottom
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  // SECTIONS
  section: {
    backgroundColor: "#f8fafc",
    marginBottom: 20,
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  historySection: {
    flexGrow: 1, // take remaining vertical space
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 9.5,
    color: "#334155",
    marginBottom: 4,
  },
  totalText: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 8,
  },

  // SUMMARY
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryBox: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 5,
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // IMPROVED AMOUNT SUMMARY
  amountSummary: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginTop: 10,
    marginBottom: 14, // extra spacing below
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 4,
  },
  summaryLabelAlt: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#475569",
  },
  summaryValueAlt: {
    fontSize: 9.5,
    color: "#334155",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e3a8a",
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginTop: 6,
  },
  summaryTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  summaryTotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },

  // TABLE
  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 5,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    color: "#334155",
  },
  amountCell: {
    fontWeight: "bold",
    color: "#0f766e",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200, // ensures enough vertical space for centering
  },
  noDataText: {
    fontSize: 11,
    color: "#64748b",
    fontStyle: "italic",
  },
  // FOOTER
  footer: {
    marginTop: 15,
    borderTopWidth: 1.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
  },
});
