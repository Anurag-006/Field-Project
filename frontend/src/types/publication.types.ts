export type PublicationType = "journal" | "conference" | "bookChapter" | "book";

export interface BasePublication {
  _id: string;
  type: PublicationType;
  facultyName: string;
  employeeId: string;
  rigGroupNumber: string;
  academicYear: string;
  authors: Array<{
    name: string;
    affiliation: string;
  }>;
  facultyAuthorPosition: string;
  belongsToStudent: string;
}

export interface JournalPublication extends BasePublication {
  type: "journal";
  journalName: string;
  journalQuartile: string;
  paperTitle: string;
  volumeIssue: string;
  pageNumbers: string;
  publicationMonth: string;
  publicationYear: string;
  indexing: string;
  issnNumber: string;
  impactFactor: number;
  publisherName: string;
  paperLink: string;
  journalLink: string;
}

export interface ConferencePublication extends BasePublication {
  type: "conference";
  conferenceName: string;
  conferenceTitle: string;
  organizedInstitute: string;
  conferencePlace: string;
  conferenceMonth: string;
  conferenceYear: string;
  conferencePublished: string;
  conferenceLink: string;
  conferencePublishedStatus: "published" | "not-published";
  participationCertificate: string;
}

export interface BookChapterPublication extends BasePublication {
  type: "bookChapter";
  bookChapterTitle: string;
  paperTitleInChapter: string;
  proceedingsTitle?: string;
  presentationMonth?: string;
  presentationYear?: string;
  bookChapterPublished: string;
  bookChapterLink: string;
  doiNumber: string;
}

export interface BookPublication extends BasePublication {
  type: "book";
  bookTitle: string;
  bookPublisher: string;
  bookPublicationYear: string;
  bookPublicationMonth: string;
  modeOfPublication: "Online" | "Offline";
  bookLink: string;
}

export type Publication = 
  | JournalPublication 
  | ConferencePublication 
  | BookChapterPublication 
  | BookPublication;