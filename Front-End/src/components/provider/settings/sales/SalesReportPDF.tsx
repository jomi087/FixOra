import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";
import type { SalesSummary } from "@/shared/typess/salesReport";
import { shortBookingId } from "@/utils/helper/utils";

interface SalesReportPDFProps {
	salesReport: SalesSummary;
}

export const SalesReportPDF: React.FC<SalesReportPDFProps> = ({ salesReport }) => {
  const totalSales =
		salesReport.totalCompletedSaleAmount + salesReport.refundAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Sales Report</Text>
            <View style={styles.generatedBox}>
              <Text style={styles.generatedText}>
								Generated On: {new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.generatedText}>
								Time: {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary Overview</Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Total Bookings</Text>
                <Text style={styles.summaryValue}>{salesReport.summaryCount.total}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Pending</Text>
                <Text style={styles.summaryValue}>{salesReport.summaryCount.pendingWork}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Cancelled</Text>
                <Text style={styles.summaryValue}>{salesReport.summaryCount.cancelled}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Completed</Text>
                <Text style={styles.summaryValue}>{salesReport.summaryCount.completed}</Text>
              </View>
            </View>

            <View style={styles.amountSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelAlt}>Completed Sales</Text>
                <Text style={styles.summaryValueAlt}>{salesReport.totalCompletedSaleAmount}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelAlt}>Refunds</Text>
                <Text style={styles.summaryValueAlt}>{salesReport.refundAmount}</Text>
              </View>

              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total Sales</Text>
                <Text style={styles.summaryTotalValue}>{totalSales.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Detailed History Section */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Detailed Sales History</Text>
            <View style={[styles.table, styles.tableContainer]}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Booking ID</Text>
                <Text style={styles.tableHeaderText}>Service</Text>
                <Text style={styles.tableHeaderText}>Distance</Text>
                <Text style={styles.tableHeaderText}>Commission</Text>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Total</Text>
              </View>

              {salesReport.completeHistory.length > 0 ? (
                salesReport.completeHistory.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{shortBookingId(item.bookingId)}</Text>
                    <Text style={styles.tableCell}>{item.serviceCharge}</Text>
                    <Text style={styles.tableCell}>{item.distanceFee}</Text>
                    <Text style={styles.tableCell}>{item.commission}</Text>
                    <Text style={styles.tableCell}>
                      {new Date(item.Date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.tableCell, styles.amountCell]}>
                      {(item.serviceCharge + item.distanceFee - item.commission).toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No sales data available</Text>
                </View>)}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
						© {new Date().getFullYear()} Sales Report — Generated by Fixora System
          </Text>
        </View>
      </Page>
    </Document>
  );
};
