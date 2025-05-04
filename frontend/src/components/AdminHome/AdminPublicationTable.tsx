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
import { ExternalLink } from "lucide-react";
  
interface AdminPublicationTableProps {
    publications: Publication[];
    onSelect: (pub: Publication) => void;
  }
  
  export const AdminPublicationTable = ({ publications, onSelect }: AdminPublicationTableProps) => {
    return (
      <div className="overflow-auto rounded-lg border mt-6">
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
              <TableRow
                key={idx}
                className="cursor-pointer hover:bg-muted transition"
                onClick={() => onSelect(pub)}
              >
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
                  {pub.authors.map((a) => a.name).join(", ")}
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
                      <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
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
  