import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { JournalForm } from "./JournalForm.js";
import { ConferenceForm } from "./ConferenceForm.js";
import { BookChapterForm } from "./BookChapterForm.js";
import { BookForm } from "./BookForm.js";
import { toast } from "sonner";
import axios from "axios";

// Schema
const publicationSchema = z.object({
  email: z.string().email(),
  facultyName: z.string().min(1),
  employeeId: z.string().min(1),
  rigGroup: z.string().min(1),
  academicYear: z.enum(["2023-2024", "2024-2025"]),
  authors: z.array(z.object({
    name: z.string().min(1),
    affiliation: z.string().min(1),
  })),
  facultyPosition: z.enum(["1", "2", "3", "4", "5", "6"]),
  studentPaper: z.enum(["Yes", "No"]),
  publicationType: z.enum(["Journal", "Conference", "Book Chapter", "Book"]),
  journal: z.object({
    name: z.string(),
    quartile: z.string(),
    title: z.string(),
    volumeIssue: z.string(),
    pages: z.string(),
    month: z.string(),
    year: z.string(),
    indexing: z.string(),
    issn: z.string(),
    impactFactor: z.string(),
    publisher: z.string(),
    paperLink: z.string(),
    journalLink: z.string(),
    indexDuration: z.string()
  }).optional(),
  conference: z.object({
    name: z.string(),
    paperTitle: z.string(),
    institute: z.string(),
    place: z.string(),
    month: z.string(),
    year: z.string(),
    status: z.enum(["Published", "Yet to get Published"]),
    volume: z.string().optional(),
    pages: z.string().optional(),
    pubMonth: z.string().optional(),
    pubYear: z.string().optional(),
    indexing: z.string().optional(),
    issn: z.string().optional(),
    doi: z.string().optional(),
    publisher: z.string().optional(),
    paperLink: z.string().optional(),
    conferenceLink: z.string().optional(),
    indexDuration: z.string().optional(),
    publishDuration: z.string().optional()
  }).optional(),
  bookChapter: z.object({
    title: z.string(),
    bookTitle: z.string(),
    publisher: z.string(),
    year: z.string(),
    pages: z.string(),
    isbn: z.string(),
    chapterNumber: z.string()
  }).optional(),
  book: z.object({
    title: z.string(),
    publisher: z.string(),
    year: z.string(),
    isbn: z.string(),
    pages: z.string(),
    edition: z.string()
  }).optional()
});

type TPublicationType = z.infer<typeof publicationSchema>["publicationType"];

export function PublicationForm() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Set user state from localStorage
    }
  }, []);

  const [publicationType, setPublicationType] = useState("");
  const form = useForm<z.infer<typeof publicationSchema>>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      authors: Array(6).fill({ name: "", affiliation: "" }),
      publicationType: undefined,
      journal: undefined,
      conference: undefined,
      bookChapter: undefined,
      book: undefined
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

  const onSubmit = async (data: z.infer<typeof publicationSchema>) => {
    console.log("Inside onSubmit", data);  // Debugging line
    try {
      if (!user?._id) {
        toast.error("User not authenticated");
        return;
      }
  
      const basePublicationData = {
        user: user._id,
        email: data.email,
        facultyName: data.facultyName,
        employeeId: data.employeeId,
        rigNo: data.rigGroup,
        academicYear: data.academicYear,
        authors: data.authors.filter(author => author.name && author.affiliation),
        facultyAuthorPosition: parseInt(data.facultyPosition),
        doesPaperBelongToStudent: data.studentPaper === "Yes",
        type: data.publicationType.toLowerCase()
      };
  
      let publicationData;
      let endpoint;
  
      switch (data.publicationType) {
        case "Journal":
          if (!data.journal) throw new Error("Journal details are required");
          publicationData = {
            ...basePublicationData,
            journalName: data.journal.name,
            journalQuartile: data.journal.quartile,
            paperTitle: data.journal.title,
            volumeIssue: data.journal.volumeIssue,
            pageNumbers: data.journal.pages,
            publicationMonth: data.journal.month,
            publicationYear: data.journal.year,
            indexing: data.journal.indexing,
            issnNumber: data.journal.issn,
            impactFactor: parseFloat(data.journal.impactFactor),
            publisherName: data.journal.publisher,
            paperLink: data.journal.paperLink,
            journalLink: data.journal.journalLink,
            indexingDuration: parseInt(data.journal.indexDuration)
          };
          endpoint = "journal";
          break;
  
        case "Conference":
          if (!data.conference) throw new Error("Conference details are required");
          publicationData = {
            ...basePublicationData,
            conferenceName: data.conference.name,
            paperTitle: data.conference.paperTitle,
            organizedInstitute: data.conference.institute,
            conferencePlace: data.conference.place,
            conferenceMonth: data.conference.month,
            conferenceYear: data.conference.year,
            conferenceStatus: data.conference.status,
            ...(data.conference.status === "Published" && {
              volume: data.conference.volume,
              pageNumbers: data.conference.pages,
              publicationMonth: data.conference.pubMonth,
              publicationYear: data.conference.pubYear,
              indexing: data.conference.indexing,
              issnNumber: data.conference.issn,
              doiNumber: data.conference.doi,
              publisherName: data.conference.publisher,
              paperLink: data.conference.paperLink,
              conferenceLink: data.conference.conferenceLink,
              indexingDuration: parseInt(data.conference.indexDuration || "0")
            }),
            ...(data.conference.status === "Yet to get Published" && {
              publishDuration: data.conference.publishDuration
            })
          };
          endpoint = "conference";
          break;
          
        case "Book Chapter":
          if (!data.bookChapter) throw new Error("Book chapter details are required");
          publicationData = {
            ...basePublicationData,
            chapterTitle: data.bookChapter.title,
            bookTitle: data.bookChapter.bookTitle,
            publisherName: data.bookChapter.publisher,
            publicationYear: data.bookChapter.year,
            pageNumbers: data.bookChapter.pages,
            isbnNumber: data.bookChapter.isbn,
            chapterNumber: parseInt(data.bookChapter.chapterNumber)
          };
          endpoint = "book-chapter";
          break;

        case "Book":
          if (!data.book) throw new Error("Book details are required");
          publicationData = {
            ...basePublicationData,
            bookTitle: data.book.title,
            publisherName: data.book.publisher,
            publicationYear: data.book.year,
            isbnNumber: data.book.isbn,
            totalPages: parseInt(data.book.pages),
            edition: data.book.edition
          };
          endpoint = "book";
          break;
  
        default:
          throw new Error("Invalid publication type");
      }
  
      const response = await axios.post(
        `http://localhost:4500/publications/${endpoint}`,
        publicationData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
  
      if (response.status === 201) {
        toast.success("Publication submitted successfully!");
        form.reset();
      }
  
    } catch (error) {
      console.error("Error submitting publication:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit publication");
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Publication Details Submission
            </h1>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input 
                      className="w-full" 
                      placeholder="Enter your email" 
                      {...register("email")} 
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Faculty Name
                    </label>
                    <Input 
                      className="w-full" 
                      placeholder="Enter faculty name with designation" 
                      {...register("facultyName")} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID
                    </label>
                    <Input 
                      className="w-full" 
                      placeholder="Enter employee ID" 
                      {...register("employeeId")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RIG Group
                    </label>
                    <Select onValueChange={(val) => setValue("rigGroup", val)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select RIG Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={`RIG ${i + 1}`}>
                            {`RIG ${i + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Academic Year
                    </label>
                    <Select onValueChange={(val) => setValue("academicYear", val)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Academic Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Authors Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Authors
                  </label>
                  {/* Render the author fields dynamically */}
                  {Array(6).fill(null).map((_, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4" key={index}>
                      <div>
                        <Input 
                          className="w-full" 
                          placeholder={`Author ${index + 1} Name`} 
                          {...register(`authors.${index}.name`)} 
                        />
                      </div>
                      <div>
                        <Input 
                          className="w-full" 
                          placeholder={`Author ${index + 1} Affiliation`} 
                          {...register(`authors.${index}.affiliation`)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Publication Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Publication Type
                  </label>
                  <Select
                    onValueChange={(val: TPublicationType) => {
                      setPublicationType(val);
                      setValue("publicationType", val);  // Sync with react-hook-form
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Publication Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Journal">Journal</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional Forms for Each Publication Type */}
                {publicationType === "Journal" && <JournalForm />}
                {publicationType === "Conference" && <ConferenceForm />}
                {publicationType === "Book Chapter" && <BookChapterForm />}
                {publicationType === "Book" && <BookForm />}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-6"
                >
                  Submit Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
export default PublicationForm;
