import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { MessageItem } from "../chat/ChatHOC";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#E4E4E4",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

interface ChatPDFExportProps {
    messagesHistory: MessageItem[];
}

// Create Document Component
export const ChatPDFExport = ({ messagesHistory }: ChatPDFExportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);
