import { Publication } from "../../types/publication.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

interface PublicationCardProps {
  publication: Publication;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  const renderPublicationDetails = () => {
    switch (publication.type) {
      case "journal":
        return (
          <>
            <CardHeader>
              <Badge>{publication.journalQuartile}</Badge>
              <CardTitle>{publication.paperTitle}</CardTitle>
              <CardDescription>
                Published in {publication.journalName} ({publication.publicationYear})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Impact Factor: {publication.impactFactor}</p>
                <p>Indexing: {publication.indexing}</p>
                <p>ISSN: {publication.issnNumber}</p>
                <p>Volume/Issue: {publication.volumeIssue}</p>
                <p>Pages: {publication.pageNumbers}</p>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={publication.paperLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Paper
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={publication.journalLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Journal
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );

      case "conference":
        return (
          <>
            <CardHeader>
              <Badge>{publication.conferencePublishedStatus}</Badge>
              <CardTitle>{publication.conferenceTitle}</CardTitle>
              <CardDescription>
                Presented at {publication.conferenceName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Organized by: {publication.organizedInstitute}</p>
                <p>Location: {publication.conferencePlace}</p>
                <p>Date: {publication.conferenceMonth} {publication.conferenceYear}</p>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={publication.conferenceLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );

      case "bookChapter":
        return (
          <>
            <CardHeader>
              <CardTitle>{publication.bookChapterTitle}</CardTitle>
              <CardDescription>{publication.paperTitleInChapter}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {publication.proceedingsTitle && (
                  <p>Proceedings: {publication.proceedingsTitle}</p>
                )}
                <p>DOI: {publication.doiNumber}</p>
                <p>Publication Status: {publication.bookChapterPublished}</p>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={publication.bookChapterLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Chapter
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );

      case "book":
        return (
          <>
            <CardHeader>
              <CardTitle>{publication.bookTitle}</CardTitle>
              <CardDescription>
                Published by {publication.bookPublisher} ({publication.bookPublicationYear})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Mode: {publication.modeOfPublication}</p>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={publication.bookLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Book
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className="w-full">
      {renderPublicationDetails()}
      <CardContent className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Authors: {publication.authors.map(a => a.name).join(", ")}
        </p>
      </CardContent>
    </Card>
  );
};