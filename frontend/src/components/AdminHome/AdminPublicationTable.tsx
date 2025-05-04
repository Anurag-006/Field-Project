import { Publication } from "../../types/publication.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, Download } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface AdminPublicationsTableProps {
  publications: Publication[];
}

export const AdminPublicationTable = ({ publications }: AdminPublicationsTableProps) => {

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Publications");
  
    // Add header row
    worksheet.addRow([
      "S. No.",
      "Faculty Name, Designation & Department",
      "List of Authors",
      "Full Title of Paper",
      "Journal/Conference Name",
      "Volume, Issue, Page Nos.",
      "Date/Month/Year of Publication",
      "ISSN No. / ISBN No.",
      "Impact Factor",
      "Indexed In",
      "No. of Citations",
    ]);
  
    // Add data rows
    publications.forEach((pub, index) => {
      worksheet.addRow([
        index + 1,
        pub.facultyName || "",
        pub.authors.map(a => a.name).join(", "),
        pub.type === "journal" ? pub.paperTitle :
        pub.type === "conference" ? pub.conferenceTitle :
        pub.type === "bookChapter" ? pub.bookChapterTitle :
        pub.type === "book" ? pub.bookTitle : "",
        pub.type === "journal" ? pub.journalName :
        pub.type === "conference" ? pub.conferenceName :
        pub.type === "bookChapter" ? pub.proceedingsTitle :
        pub.type === "book" ? pub.bookPublisher : "",
        // pub.volume || "",
        pub.type === "journal" ? pub.publicationYear :
        pub.type === "conference" ? pub.conferenceYear :
        pub.type === "bookChapter" ? pub.presentationYear :
        pub.type === "book" ? pub.bookPublicationYear : "",
        pub.issnIsbn || "",
        pub.impactFactor || "",
        pub.indexedIn || "",
        pub.citations || "",
      ]);
    });
  
    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Publications.xlsx");
  };
  

  return (
    <div className="overflow-auto rounded-lg border mt-6">
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-lg font-semibold">Publications List</h2>
        <Button onClick={exportToExcel} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export to Excel
        </Button>
      </div>
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Journal/Conference/Book</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications.map((pub, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {pub.type === "journal" && pub.paperTitle}
                {pub.type === "conference" && pub.conferenceTitle}
                {pub.type === "bookChapter" && pub.bookChapterTitle}
                {pub.type === "book" && pub.bookTitle}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{pub.type}</Badge>
              </TableCell>
              <TableCell>
                {pub.type === "journal" && pub.publicationYear}
                {pub.type === "conference" && pub.conferenceYear}
                {pub.type === "bookChapter" && pub.presentationYear}
                {pub.type === "book" && pub.bookPublicationYear}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {pub.authors.map(a => a.name).join(", ")}
              </TableCell>
              <TableCell>
                {pub.type === "journal" && pub.journalName}
                {pub.type === "conference" && pub.conferenceName}
                {pub.type === "bookChapter" && pub.proceedingsTitle}
                {pub.type === "book" && pub.bookPublisher}
              </TableCell>
              <TableCell>
                {(() => {
                  let link = "";
                  if (pub.type === "journal") link = pub.paperLink;
                  if (pub.type === "conference") link = pub.conferenceLink;
                  if (pub.type === "bookChapter") link = pub.bookChapterLink;
                  if (pub.type === "book") link = pub.bookLink;

                  return link ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    "-"
                  );
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPublicationTable;