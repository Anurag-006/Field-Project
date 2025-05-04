import { Publication } from "../../types/publication.types";
import { PublicationCard } from "../PublicationCard/PublicationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface PublicationWindowProps {
  publications: Publication[];
}

const PublicationWindow = ({ publications }: PublicationWindowProps) => {
  const journals = publications.filter(pub => pub.type === "journal");
  const conferences = publications.filter(pub => pub.type === "conference");
  const bookChapters = publications.filter(pub => pub.type === "bookChapter");
  const books = publications.filter(pub => pub.type === "book");

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="journal">Journals</TabsTrigger>
          <TabsTrigger value="conference">Conferences</TabsTrigger>
          <TabsTrigger value="bookChapter">Book Chapters</TabsTrigger>
          <TabsTrigger value="book">Books</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {publications.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          {journals.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </TabsContent>

        <TabsContent value="conference" className="space-y-4">
          {conferences.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </TabsContent>

        <TabsContent value="bookChapter" className="space-y-4">
          {bookChapters.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </TabsContent>

        <TabsContent value="book" className="space-y-4">
          {books.map((pub) => (
            <PublicationCard key={pub._id} publication={pub} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicationWindow;