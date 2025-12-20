import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import type { BookingInfoDetails } from "@/shared/types/booking";
import { toPascalCase } from "@/utils/helper/utils";
import { styles } from "./style";

interface InvoicePDFProps {
  invoiceData: BookingInfoDetails;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => {
  const totalAmount = invoiceData.pricing.baseCost + invoiceData.pricing.distanceFee;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.bookingInfoBox}>
              <Text style={styles.bookingInfoText}>
                Booking ID: {invoiceData.bookingId}
              </Text>
              <Text style={styles.bookingInfoText}>
                Date: {new Date(invoiceData.scheduledAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.textLabel}>Appointment: </Text>
            <Text style={styles.text}>
              {new Date(invoiceData.scheduledAt).toLocaleDateString()} at{" "}
              {new Date(invoiceData.scheduledAt).toLocaleTimeString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.textLabel}>Service: </Text>
            <Text style={styles.text}>{invoiceData.category.name.toUpperCase()}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.textLabel}>Issue: </Text>
            <Text style={styles.text}>
              {invoiceData.category.subCategory.name.toUpperCase()}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textLabel}>Description: </Text>
            <Text style={styles.text}>{toPascalCase(invoiceData.issue)}</Text>
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider Information</Text>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.textLabel}>Name: </Text>
            <Text style={styles.text}>
              {invoiceData.providerUser.fname} {invoiceData.providerUser.lname}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textLabel}>Email: </Text>
            <Text style={styles.text}>{invoiceData.providerUser.email}</Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>

          {/* Payment Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Item</Text>
              <Text style={[styles.tableHeaderText, { textAlign: "right" }]}>
                Amount ($)
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Service Charge</Text>
              <Text style={[styles.tableCell, { textAlign: "right" }]}>
                {invoiceData.pricing.baseCost.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Distance Fee</Text>
              <Text style={[styles.tableCell, { textAlign: "right" }]}>
                {invoiceData.pricing.distanceFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text style={styles.textLabel}>Payment Mode: </Text>
              <Text style={styles.text}>{invoiceData.paymentInfo.mop}</Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text style={styles.textLabel}>Transaction ID: </Text>
              <Text style={styles.text}>{invoiceData.paymentInfo.transactionId}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textLabel}>Paid At: </Text>
              <Text style={styles.text}>
                {new Date(invoiceData.paymentInfo.paidAt!).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Diagnosis */}
        <View style={styles.diagnosisSection}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.text}>
            {invoiceData.diagnosed?.description || "N/A"}
          </Text>

          {/* Replaced Parts */}
          {invoiceData.diagnosed?.replaceParts?.length ? (
            <View style={styles.partsContainer}>
              <Text style={[styles.textLabel, { marginBottom: 8 }]}>
                Replaced Parts:
              </Text>
              {invoiceData.diagnosed.replaceParts.map((part, index) => (
                <View key={index} style={styles.partItem}>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partCost}>${part.cost.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Work Proof Images */}
        {invoiceData.workProof && invoiceData.workProof.length > 0 && (
          <View style={styles.workProofSection}>
            <Text style={styles.sectionTitle}>Work Proof</Text>
            <View style={styles.imageContainer}>
              {invoiceData.workProof.map((imageUrl, index) => (
                <Image
                  key={index}
                  src={imageUrl}
                  style={styles.workImage}
                />
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing our service! We appreciate your business.
          </Text>
        </View>
      </Page>
    </Document>
  );
};