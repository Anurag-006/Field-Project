import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner"


const formSchema = z.object({
  // Basic Information
  email: z.string().email({ message: "Invalid email address" }),
  facultyName: z.string().min(1, { message: "Faculty name is required" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  rigGroupNumber: z.string().min(1, { message: "RIG Group number is required" }),
  academicYear: z.string().min(1, { message: "Academic year is required" }),

  // Author Information
  author1Name: z.string().min(1, { message: "Author 1 name is required" }),
  author1Affiliation: z.string().min(1, { message: "Author 1 affiliation is required" }),
  author2Name: z.string().min(1, { message: "Author 2 name is required" }),
  author2Affiliation: z.string().min(1, { message: "Author 2 affiliation is required" }),
  author3Name: z.string().min(1, { message: "Author 3 name or NIL is required" }),
  author3Affiliation: z.string().min(1, { message: "Author 3 affiliation or NIL is required" }),
  author4Name: z.string().optional(),
  author4Affiliation: z.string().optional(),
  author5Name: z.string().optional(),
  author5Affiliation: z.string().optional(),
  author6Name: z.string().optional(),
  author6Affiliation: z.string().optional(),

  // Publication Type and Common Fields
  facultyAuthorPosition: z.string().min(1, { message: "Faculty author position is required" }),
  belongsToStudent: z.string().min(1, { message: "Please specify if paper belongs to student" }),
  publicationType: z.enum(["Journal", "Conference", "BookChapter", "Book"], {
    required_error: "Publication type is required",
  }),

  // Journal Fields
  journalName: z.string().optional(),
  journalQuartile: z.string().optional(),
  paperTitle: z.string().optional(),
  volumeIssue: z.string().optional(),
  pageNumbers: z.string().optional(),
  publicationMonth: z.string().optional(),
  publicationYear: z.string().optional(),
  indexing: z.string().optional(),
  issnNumber: z.string().optional(),
  impactFactor: z.string().optional(),
  publisherName: z.string().optional(),
  paperLink: z.string().url().optional(),
  journalLink: z.string().url().optional(),
  indexingDuration: z.string().optional(),

  // Conference Fields
  conferenceName: z.string().optional(),
  conferenceTitle: z.string().optional(),
  organizedInstitute: z.string().optional(),
  conferencePlace: z.string().optional(),
  conferenceMonth: z.string().optional(),
  conferenceYear: z.string().optional(),
  conferencePublished: z.string().optional(),
  participationCertificate: z.any().optional(), // For file upload
  conferenceLink: z.string().url().optional(),
  conferencePublishedStatus: z.enum(["published", "not-published"]).optional(),
  conferencePublishDuration: z.string().optional(),

  // Book Chapter Fields
  bookChapterTitle: z.string().optional(),
  paperTitleInChapter: z.string().optional(),
  proceedingsTitle: z.string().optional(),
  presentationMonth: z.string().optional(),
  presentationYear: z.string().optional(),
  bookChapterPublished: z.string().optional(),
  bookChapterPublishedStatus: z.enum(["published", "not-published"]).optional(),
  bookChapterLink: z.string().url().optional(),
  doiNumber: z.string().optional(),
  bookChapterPublishDuration: z.string().optional(),

  // File Upload Fields
  fullPaperFile: z.any().optional(), // For file upload
  indexingProofFile: z.any().optional(), // For file upload

  // Book Fields
  bookTitle: z.string().optional(),
  isbn: z.string().optional(),
  bookPublisher: z.string().optional(),
  bookPublicationYear: z.string().optional(),
  bookLink: z.string().url().optional(),
}).refine((data) => {
  // Add conditional validation based on publication type
  switch (data.publicationType) {
    case "Journal":
      return !!(data.journalName && data.paperTitle && data.indexing);
    case "Conference":
      return !!(data.conferenceName && data.conferenceTitle && data.organizedInstitute);
    case "BookChapter":
      return !!(data.bookChapterTitle && data.paperTitleInChapter);
    case "Book":
      return !!(data.bookTitle && data.isbn);
    default:
      return true;
  }
}, {
  message: "Please fill in all required fields for the selected publication type"
});

type FormValues = z.infer<typeof formSchema>;

// Add these interfaces before the PublicationForm component
interface Author {
  name: string;
  affiliation: string;
}

// Update the interfaces to handle optional fields
interface JournalDetails {
  journalName: string | undefined;
  journalQuartile: string | undefined;
  paperTitle: string | undefined;
  volumeIssue: string | undefined;
  pageNumbers: string | undefined;
  publicationMonth: string | undefined;
  publicationYear: string | undefined;
  indexing: string | undefined;
  issnNumber: string | undefined;
  impactFactor: string | undefined;
  publisherName: string | undefined;
  paperLink: string | undefined;
  journalLink: string | undefined;
}

interface ConferenceDetails {
  conferenceName: string | undefined;
  conferenceTitle: string | undefined;
  organizedInstitute: string | undefined;
  conferencePlace: string | undefined;
  conferenceMonth: string | undefined;
  conferenceYear: string | undefined;
  conferencePublished: string | undefined;
  publishedDetails?: {
    volumeIssue: string | undefined;
    pageNumbers: string | undefined;
    publicationMonth: string | undefined;
    publicationYear: string | undefined;
    indexing: string | undefined;
    issnNumber: string | undefined;
    publisherName: string | undefined;
    paperLink: string | undefined;
    conferenceLink: string | undefined;
  };
}

interface BookChapterDetails {
  bookChapterTitle: string | undefined;
  paperTitleInChapter: string | undefined;
  proceedingsTitle?: string | undefined;
  presentationMonth?: string | undefined;
  presentationYear?: string | undefined;
  bookChapterPublished: string | undefined;
  publishedDetails?: {
    publicationMonth: string | undefined;
    publicationYear: string | undefined;
    volumeIssue: string | undefined;
    pageNumbers: string | undefined;
    issnNumber: string | undefined;
    indexing: string | undefined;
    publisherName: string | undefined;
    doiNumber: string | undefined;
    paperLink: string | undefined;
    bookChapterLink: string | undefined;
  };
}

interface BookDetails {
  bookTitle: string | undefined;
  isbn: string | undefined;
  bookPublisher: string | undefined;
  bookPublicationYear: string | undefined;
  bookLink: string | undefined;
}

interface PublicationData {
  email: string;
  facultyName: string;
  employeeId: string;
  rigGroupNumber: string;
  academicYear: string;
  authors: Author[];
  facultyAuthorPosition: string;
  belongsToStudent: string;
  publicationType: "Journal" | "Conference" | "BookChapter" | "Book";
  journalDetails?: JournalDetails;
  conferenceDetails?: ConferenceDetails;
  bookChapterDetails?: BookChapterDetails;
  bookDetails?: BookDetails;
}

const PublicationForm = () => {
  const [publicationType, setPublicationType] = useState("");
  const [conferencePublished, setConferencePublished] = useState("Published");
  const [bookChapterPublished, setBookChapterPublished] = useState("Published");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Basic Information
      email: "",
      facultyName: "",
      employeeId: "",
      rigGroupNumber: "",
      academicYear: "",

      // Author Information
      author1Name: "",
      author1Affiliation: "",
      author2Name: "",
      author2Affiliation: "",
      author3Name: "",
      author3Affiliation: "",
      author4Name: "",
      author4Affiliation: "",
      author5Name: "",
      author5Affiliation: "",
      author6Name: "",
      author6Affiliation: "",
      
      // Publication Type
      facultyAuthorPosition: "",
      belongsToStudent: "",
      publicationType: undefined,

      // Journal Fields
      journalName: "",
      journalQuartile: "",
      paperTitle: "",
      volumeIssue: "",
      pageNumbers: "",
      publicationMonth: "",
      publicationYear: "",
      indexing: "",
      issnNumber: "",
      impactFactor: "",
      publisherName: "",
      paperLink: "",
      journalLink: "",
      indexingDuration: "",

      // Conference Fields
      conferenceName: "",
      conferenceTitle: "",
      organizedInstitute: "",
      conferencePlace: "",
      conferenceMonth: "",
      conferenceYear: "",
      conferencePublished: "",
      conferenceLink: "",
      conferencePublishedStatus: undefined,
      conferencePublishDuration: "",

      // Book Chapter Fields
      bookChapterTitle: "",
      paperTitleInChapter: "",
      proceedingsTitle: "",
      presentationMonth: "",
      presentationYear: "",
      bookChapterPublished: "",
      bookChapterPublishedStatus: undefined,
      bookChapterLink: "",
      doiNumber: "",
      bookChapterPublishDuration: "",

      // Book Fields
      bookTitle: "",
      isbn: "",
      bookPublisher: "",
      bookPublicationYear: "",
      bookLink: "",

      // File Fields
      fullPaperFile: undefined,
      indexingProofFile: undefined,
    }
  });

  // Add this after your form initialization
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // First, let's log the raw form data
      console.log("Raw Form Data:", data);
  
      // Validate the data
      const validatedData = formSchema.parse(data);
      
      // Create publication data object
      let publicationData: PublicationData = {
        email: validatedData.email,
        facultyName: validatedData.facultyName,
        employeeId: validatedData.employeeId,
        rigGroupNumber: validatedData.rigGroupNumber,
        academicYear: validatedData.academicYear,
        authors: [
          {
            name: validatedData.author1Name,
            affiliation: validatedData.author1Affiliation,
          },
          {
            name: validatedData.author2Name,
            affiliation: validatedData.author2Affiliation,
          },
          {
            name: validatedData.author3Name,
            affiliation: validatedData.author3Affiliation,
          },
          ...(validatedData.author4Name ? [{
            name: validatedData.author4Name,
            affiliation: validatedData.author4Affiliation ?? "",
          }] : []),
          ...(validatedData.author5Name ? [{
            name: validatedData.author5Name,
            affiliation: validatedData.author5Affiliation ?? "",
          }] : []),
          ...(validatedData.author6Name ? [{
            name: validatedData.author6Name,
            affiliation: validatedData.author6Affiliation ?? "",
          }] : []),
        ].filter((author): author is Author => author !== null),
        facultyAuthorPosition: validatedData.facultyAuthorPosition,
        belongsToStudent: validatedData.belongsToStudent,
        publicationType: validatedData.publicationType,
      };
  
      // Add publication type specific details
      if (validatedData.publicationType === "Journal") {
        publicationData.journalDetails = {
          journalName: validatedData.journalName,
          journalQuartile: validatedData.journalQuartile,
          paperTitle: validatedData.paperTitle,
          volumeIssue: validatedData.volumeIssue,
          pageNumbers: validatedData.pageNumbers,
          publicationMonth: validatedData.publicationMonth,
          publicationYear: validatedData.publicationYear,
          indexing: validatedData.indexing,
          issnNumber: validatedData.issnNumber,
          impactFactor: validatedData.impactFactor,
          publisherName: validatedData.publisherName,
          paperLink: validatedData.paperLink,
          journalLink: validatedData.journalLink
        };
      }
  
      // Log the structured data
      console.log("Structured Publication Data:", publicationData);
      
      // Show success toast
      toast.success("Form data logged to console", {
        description: "Check browser console (F12) for details"
      });
  
    } catch (error) {
      // Log and show any errors
      if (error instanceof z.ZodError) {
        console.error("Validation Errors:", error.errors);
        toast.error("Validation failed", {
          description: error.errors.map(e => e.message).join(", ")
        });
      } else {
        console.error("Error:", error);
        toast.error("An error occurred");
      }
    }
  };
  

  const handlePublicationTypeChange = (value:any) => {
    setPublicationType(value);
    form.setValue("publicationType", value);
  };

  return (
    <>
      <Toaster richColors closeButton position="top-center" />
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Publication Details Submission
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your email"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facultyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty Name with Designation*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter faculty name with designation"
                            {...field}
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter employee ID"
                            {...field}
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rigGroupNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RIG Group Number*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select RIG Group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i} value={`RIG ${i + 1}`}>
                                RIG {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select Academic Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2023-2024">2023-2024</SelectItem>
                            <SelectItem value="2024-2025">2024-2025</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Author Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Author 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author1Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author 1 Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 1 name"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author1Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author 1 Affiliation*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 1 affiliation"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Author 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author2Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author 2 Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 2 name"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author2Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author 2 Affiliation*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 2 affiliation"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Author 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author3Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 3 Name* (If no Author 3, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 3 name or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author3Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 3 Affiliation* (If no Author 3, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 3 affiliation or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Author 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author4Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 4 Name (If no Author 4, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 4 name or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author4Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 4 Affiliation (If no Author 4, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 4 affiliation or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Author 5 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author5Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 5 Name (If no Author 5, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 5 name or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author5Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 5 Affiliation (If no Author 5, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 5 affiliation or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Author 6 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author6Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 6 Name (If no Author 6, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 6 name or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author6Affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Author 6 Affiliation (If no Author 6, specify NIL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter author 6 affiliation or NIL"
                              {...field}
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="facultyAuthorPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty Author Position*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(6)].map((_, i) => (
                              <SelectItem key={i} value={`${i + 1}`}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="belongsToStudent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Does this paper belong to student?*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publicationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Publication*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            handlePublicationTypeChange(value);
                          }}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select Publication Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Journal">Journal</SelectItem>
                            <SelectItem value="Conference">Conference</SelectItem>
                            <SelectItem value="BookChapter">
                              Book Chapter
                            </SelectItem>
                            <SelectItem value="Book">Book</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Journal Section */}
              {publicationType === "Journal" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">Journal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="journalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name of the Journal*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter journal name"
                                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Quartile of Journal*</FormLabel>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select Quartile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Q1">Q1</SelectItem>
                            <SelectItem value="Q2">Q2</SelectItem>
                            <SelectItem value="Q3">Q3</SelectItem>
                            <SelectItem value="Q4">Q4</SelectItem>
                            <SelectItem value="No Quartile assigned">
                              No Quartile assigned
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <FormItem>
                      <FormLabel>Title of the Paper*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter paper title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormItem>
                        <FormLabel>Volume and Issue no*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Vol. 10, Issue 2"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Page No.s*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 123-145"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Month of publication*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., January"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Year of publication*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2024"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Indexing*</FormLabel>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select Indexing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Web of Science">
                              Web of Science
                            </SelectItem>
                            <SelectItem value="UGC">UGC</SelectItem>
                            <SelectItem value="IEEE Transactions">
                              IEEE Transactions
                            </SelectItem>
                            <SelectItem value="SCI">SCI</SelectItem>
                            <SelectItem value="SCOPUS">SCOPUS</SelectItem>
                            <SelectItem value="Scopus with Web of Science">
                              Scopus with Web of Science
                            </SelectItem>
                            <SelectItem value="Google Scholar">
                              Google Scholar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>ISSN number*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ISSN number"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Impact Factor*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter impact factor"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <FormItem>
                      <FormLabel>Publisher Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter publisher name"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Link of Paper*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter paper link"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Link of Journal*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter journal link"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>
                          Full Paper of Published Proof (PDF)*
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>
                          Indexing Proof of that Paper if already indexed (PDF)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>
                          Approximate duration to get Indexed*
                        </FormLabel>
                        <Select>
                          <FormControl>
                            <SelectTrigger
                              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 Month">1 Month</SelectItem>
                            <SelectItem value="3 Months">3 Months</SelectItem>
                            <SelectItem value="6 Months">6 Months</SelectItem>
                            <SelectItem value="Indexed proof attached above">
                              Indexed proof attached above
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          If not Indexed in specified months, it will redirect to
                          Google scholar Journal list
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Conference Section */}
              {publicationType === "Conference" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">Conference Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormItem>
                      <FormLabel>Name of the Conference*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter conference name"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Title of the Conference Paper*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter paper title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Organized Institute name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter institute name"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Place of conference held*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter conference location"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>
                          Month of conference held and Presented*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., January"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Year of conference held*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2024"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <FormItem>
                      <FormLabel>Participation Certificate* (File)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Presented Paper Details*</FormLabel>
                      <Tabs defaultValue="published" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="published">Published</TabsTrigger>
                          <TabsTrigger value="not-published">
                            Yet to get Published
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="published" className="space-y-4 mt-4">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Publication and Indexing of Conference
                            </h3>

                            <FormItem>
                              <FormLabel>Volume and issue Number*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter volume and issue"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Page Numbers*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 123-145"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormItem>
                                <FormLabel>Month of Publication*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., January"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Year of Publication*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 2024"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>

                            <FormItem>
                              <FormLabel>Indexing*</FormLabel>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select Indexing" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="IEEE">IEEE</SelectItem>
                                  <SelectItem value="Scopus">Scopus</SelectItem>
                                  <SelectItem value="Web of Science">
                                    Web of Science
                                  </SelectItem>
                                  <SelectItem value="Scopus & Web of Science">
                                    Scopus & Web of Science
                                  </SelectItem>
                                  <SelectItem value="UGC">UGC</SelectItem>
                                  <SelectItem value="Google Scholar">
                                    Google Scholar
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>ISSN / ISBN Number*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter ISSN/ISBN number"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>DOI Number or link*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter DOI"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Publisher Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter publisher name"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Link of Published Conference Paper*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter paper link"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Link of the Conference*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter conference link"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Full Paper of the Published Conference Paper
                                (PDF)*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Indexing Proof of the Conference Paper (If indexed
                                already) (PDF)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Approximate duration to get Indexing*
                              </FormLabel>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1 Month">1 Month</SelectItem>
                                  <SelectItem value="3 Months">
                                    3 Months
                                  </SelectItem>
                                  <SelectItem value="6 Months">
                                    6 Months
                                  </SelectItem>
                                  <SelectItem value="Already indexed attached above">
                                    Already indexed attached above
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                If not Indexed in specified months, it will be
                                moved to UGC list
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="not-published"
                          className="space-y-4 mt-4"
                        >
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Conference Paper Publication details (Yet to get
                              publish)
                            </h3>

                            <FormItem>
                              <FormLabel>
                                Approximate duration to get Published*
                              </FormLabel>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1 Month">1 Month</SelectItem>
                                  <SelectItem value="3 Months">
                                    3 Months
                                  </SelectItem>
                                  <SelectItem value="6 Months">
                                    6 Months
                                  </SelectItem>
                                  </SelectContent>
                              </Select>
                              <FormDescription>
                                If not published in specified months, it will be
                                removed from list
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  </CardContent>
                </Card>
              )}

              {/* Book Chapter Section */}
              {publicationType === "BookChapter" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Book Chapter Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormItem>
                      <FormLabel>Title of the Book Chapter*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter book chapter title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Title of the Paper in Book Chapter*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter paper title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>
                        Title of the Proceedings of the Conference for this Book
                        chapter (If any)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter proceedings title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>
                          Month of Presentation of paper if it through conference
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., January"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>
                          Year of Presentation of paper if it through conference
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2024"
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <FormItem>
                      <FormLabel>Book chapter details*</FormLabel>
                      <Tabs defaultValue="published" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="published">Published</TabsTrigger>
                          <TabsTrigger value="not-published">
                            Yet to get Published
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="published" className="space-y-4 mt-4">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Book Chapter Publication Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormItem>
                                <FormLabel>
                                  Month of Publication of Book chapter*
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., January"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>
                                  Year of Publication of Book chapter*
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 2024"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormItem>
                                <FormLabel>Volume and Issue Number*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter volume and issue"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Page Numbers*</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 123-145"
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>

                            <FormItem>
                              <FormLabel>ISSN/ISBN Number*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter ISSN/ISBN number"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Indexing*</FormLabel>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select Indexing" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Scopus">Scopus</SelectItem>
                                  <SelectItem value="Web of Science">
                                    Web of Science
                                  </SelectItem>
                                  <SelectItem value="Scopus & Web of Science">
                                    Scopus & Web of Science
                                  </SelectItem>
                                  <SelectItem value="UGC">UGC</SelectItem>
                                  <SelectItem value="Google Scholar">
                                    Google Scholar
                                  </SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Publisher Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter publisher name"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>DOI Number or Link*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter DOI"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Link of Published Paper in Book Chapter*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter paper link"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>Link of Book Chapter*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter book chapter link"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Full length paper of all pages in Book Chapter*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Approximate duration to get Indexing*
                              </FormLabel>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1 Month">1 Month</SelectItem>
                                  <SelectItem value="3 Months">
                                    3 Months
                                  </SelectItem>
                                  <SelectItem value="6 Months">
                                    6 Months
                                  </SelectItem>
                                  <SelectItem value="Already indexed">
                                    Already indexed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                If not Indexed in specified months, it will be
                                moved to UGC list
                              </FormDescription>
                              <FormMessage />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                Indexing Proof of the Conference Paper (If indexed
                                already)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="not-published"
                          className="space-y-4 mt-4"
                        >
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                              Book chapter details (Yet to get Published)
                            </h3>

                            <FormItem>
                              <FormLabel>
                                Approximate duration to get Published*
                              </FormLabel>
                              <FormDescription>
                                If not published in below specified months, then
                                it will be removed from list
                              </FormDescription>
                              <Select>
                                <FormControl>
                                  <SelectTrigger
                                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1 Month">1 Month</SelectItem>
                                  <SelectItem value="3 Months">
                                    3 Months
                                  </SelectItem>
                                  <SelectItem value="6 Months">
                                    6 Months
                                  </SelectItem>
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  </CardContent>
                </Card>
              )}
              {/* Book Section */}
              {publicationType === "Book" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">Book Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Book form fields go here */}
                    <FormItem>
                      <FormLabel>Title of the Book*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter book title"
                          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    {/* Additional book-specific fields would go here */}
                  </CardContent>
                </Card>
              )}

              {/* Submit Button - should be at the end of the form */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                >
                  Submit Publication
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PublicationForm;