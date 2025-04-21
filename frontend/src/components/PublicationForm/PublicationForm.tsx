import { useState } from "react";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";

const formSchema = z
  .object({
    // Basic Information
    email: z.string().email({ message: "Invalid email address" }),
    facultyName: z.string().min(1, { message: "Faculty name is required" }),
    employeeId: z.string().min(1, { message: "Employee ID is required" }),
    rigGroupNumber: z
      .string()
      .min(1, { message: "RIG Group number is required" }),
    academicYear: z.string().min(1, { message: "Academic year is required" }),

    // Author Information
    author1Name: z.string().min(1, { message: "Author 1 name is required" }),
    author1Affiliation: z
      .string()
      .min(1, { message: "Author 1 affiliation is required" }),
    author2Name: z.string().min(1, { message: "Author 2 name is required" }),
    author2Affiliation: z
      .string()
      .min(1, { message: "Author 2 affiliation is required" }),
    author3Name: z
      .string()
      .min(1, { message: "Author 3 name or NIL is required" }),
    author3Affiliation: z
      .string()
      .min(1, { message: "Author 3 affiliation or NIL is required" }),
    author4Name: z.string().optional(),
    author4Affiliation: z.string().optional(),
    author5Name: z.string().optional(),
    author5Affiliation: z.string().optional(),
    author6Name: z.string().optional(),
    author6Affiliation: z.string().optional(),

    // Publication Type and Common Fields
    facultyAuthorPosition: z
      .string()
      .min(1, { message: "Faculty author position is required" }),
    belongsToStudent: z
      .string()
      .min(1, { message: "Please specify if paper belongs to student" }),
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
    paperLink: z.string().optional(),
    journalLink: z.string().optional(),
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
    conferenceLink: z.string().optional(),
    conferencePublishedStatus: z
      .enum(["published", "not-published"])
      .optional(),
    conferencePublishDuration: z.string().optional(),

    // Book Chapter Fields
    bookChapterTitle: z.string().optional(),
    paperTitleInChapter: z.string().optional(),
    proceedingsTitle: z.string().optional(),
    presentationMonth: z.string().optional(),
    presentationYear: z.string().optional(),
    bookChapterPublished: z.string().optional(),
    bookChapterPublishedStatus: z
      .enum(["published", "not-published"])
      .optional(),
    bookChapterLink: z.string().optional(),
    doiNumber: z.string().optional(),
    bookChapterPublishDuration: z.string().optional(),

    // File Upload Fields
    fullPaperFile: z.any().optional(), // For file upload
    indexingProofFile: z.any().optional(), // For file upload

    // Book Fields
    bookTitle: z.string().optional(),
    bookPublisher: z.string().optional(),
    bookPublicationYear: z.string().optional(),
    bookPublicationMonth: z.string().optional(),
    bookLink: z.string().optional(),
    modeOfPublication: z.enum(["Online", "Offline"], {
      required_error: "Mode of publication is required",
    }).optional(),
  })
  .refine(
    (data) => {
      // Add conditional validation based on publication type
      switch (data.publicationType) {
        case "Journal":
          return !!(data.journalName && data.paperTitle && data.indexing);
        case "Conference":
          return !!(
            data.conferenceName &&
            data.conferenceTitle &&
            data.organizedInstitute
          );
        case "BookChapter":
          return !!(data.bookChapterTitle && data.paperTitleInChapter);
        case "Book":
          return !!(data.bookTitle && data.bookPublisher);
        default:
          return true;
      }
    },
    {
      message:
        "Please fill in all required fields for the selected publication type",
    }
  );

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
  bookPublisher: string | undefined;
  bookPublicationYear: string | undefined;
  bookPublicationMonth: string | undefined;
  modeOfPublication: string | undefined;
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
  // const [conferencePublished, setConferencePublished] = useState("Published");
  // const [bookChapterPublished, setBookChapterPublished] = useState("Published");

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
      bookPublisher: "",
      bookPublicationYear: "",
      bookPublicationMonth: "",
      modeOfPublication: undefined,
      bookLink: "",

      // File Fields
      fullPaperFile: undefined,
      indexingProofFile: undefined,
    },
  });

  // Add this after your form initialization
  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     // console.log("Form values changed:", value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form]);

  const onSubmit = async (data: FormValues) => {
    console.log("Inside onSubmit Function");
    
    try {
      // Create base publication data
      let publicationData: PublicationData = {
        email: data.email,
        facultyName: data.facultyName,
        employeeId: data.employeeId,
        rigGroupNumber: data.rigGroupNumber,
        academicYear: data.academicYear,
        authors: [
          { name: data.author1Name, affiliation: data.author1Affiliation },
          { name: data.author2Name, affiliation: data.author2Affiliation },
          { name: data.author3Name, affiliation: data.author3Affiliation },
          ...(data.author4Name ? [{ name: data.author4Name, affiliation: data.author4Affiliation || "" }] : []),
          ...(data.author5Name ? [{ name: data.author5Name, affiliation: data.author5Affiliation || "" }] : []),
          ...(data.author6Name ? [{ name: data.author6Name, affiliation: data.author6Affiliation || "" }] : [])
        ],
        facultyAuthorPosition: data.facultyAuthorPosition,
        belongsToStudent: data.belongsToStudent,
        publicationType: data.publicationType
      };

      // Add type-specific details
      switch (data.publicationType) {
        case "Journal":
          publicationData.journalDetails = {
            journalName: data.journalName,
            journalQuartile: data.journalQuartile,
            paperTitle: data.paperTitle,
            volumeIssue: data.volumeIssue,
            pageNumbers: data.pageNumbers,
            publicationMonth: data.publicationMonth,
            publicationYear: data.publicationYear,
            indexing: data.indexing,
            issnNumber: data.issnNumber,
            impactFactor: data.impactFactor,
            publisherName: data.publisherName,
            paperLink: data.paperLink,
            journalLink: data.journalLink
          };
          break;

        // ...rest of your switch cases remain the same
      }

      console.log("Structured Publication Data:", publicationData);
      toast.success("Form submitted successfully");

    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Submission failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const handlePublicationTypeChange = (value: any) => {
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
            <form onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.log("Form errors: ", error)
            })} className="space-y-8">
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
                        <FormLabel>
                          Does this paper belong to student?*
                        </FormLabel>
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
                            <SelectItem value="Conference">
                              Conference
                            </SelectItem>
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="journalQuartile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quartile of Journal*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="paperTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title of the Paper*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter paper title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="volumeIssue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volume and Issue no*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Vol. 10, Issue 2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pageNumbers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page No.s*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 123-145" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publicationMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month of publication*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., January" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="publicationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of publication*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 2024" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="indexing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indexing*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
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
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="issnNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISSN number*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter ISSN number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="impactFactor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impact Factor*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter impact factor"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="publisherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher Name*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter publisher name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paperLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link of Paper*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter paper URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="journalLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link of Journal*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter journal URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullPaperFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Full Paper of Published Proof (PDF)*
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="indexingProofFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indexing Proof (PDF)</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="indexingDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Approximate duration to get Indexed*
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
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
                            If not Indexed in specified months, it will redirect
                            to Google scholar Journal list
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Conference Section */}
              {publicationType === "Conference" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Conference Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="conferenceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of the Conference*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter conference name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="conferenceTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title of the Conference Paper*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter paper title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizedInstitute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organized Institute name*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter institute name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="conferencePlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of conference held*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter conference location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="conferenceMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month of conference held*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., January" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="conferenceYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of conference held*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="participationCertificate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Participation Certificate* (PDF)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="conferencePublishedStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Status*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                              <SelectItem value="not-published">
                                Yet to be Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add conditional fields based on publication status */}
                    {form.watch("conferencePublishedStatus") ===
                      "published" && (
                      <>
                        {/* Published conference fields */}
                        <FormField
                          control={form.control}
                          name="volumeIssue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volume and Issue Number*</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter volume and issue"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pageNumbers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Page Numbers*</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 123-145" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Add other published conference fields... */}
                      </>
                    )}

                    {form.watch("conferencePublishedStatus") ===
                      "not-published" && (
                      <FormField
                        control={form.control}
                        name="conferencePublishDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Expected Publication Duration*
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                        )}
                      />
                    )}
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
                    <FormField
                      control={form.control}
                      name="bookChapterTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title of the Book Chapter*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter book chapter title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paperTitleInChapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Title of the Paper in Book Chapter*
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter paper title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="proceedingsTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Title of the Proceedings (If any)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter proceedings title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="presentationMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month of Presentation</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., January" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="presentationYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of Presentation</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bookChapterPublishedStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Status*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                              <SelectItem value="not-published">
                                Yet to be Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("bookChapterPublishedStatus") ===
                      "published" && (
                      <>
                        <FormField
                          control={form.control}
                          name="doiNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DOI Number*</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter DOI number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bookChapterLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Book Chapter Link*</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter book chapter URL"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fullPaperFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Paper (PDF)*</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {form.watch("bookChapterPublishedStatus") ===
                      "not-published" && (
                      <FormField
                        control={form.control}
                        name="bookChapterPublishDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Expected Publication Duration*
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                        )}
                      />
                    )}
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
                    <FormField
                      control={form.control}
                      name="bookTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title of the Book*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter book title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookPublisher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher Name*</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter publisher name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookPublicationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Publication*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 2024" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modeOfPublication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode of Publication*</FormLabel>
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
                                <SelectValue placeholder="Select mode of publication" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Online">Online</SelectItem>
                              <SelectItem value="Offline">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link of the Book*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter book URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullPaperFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Book PDF*</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Submit Button - should be at the end of the form */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
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
