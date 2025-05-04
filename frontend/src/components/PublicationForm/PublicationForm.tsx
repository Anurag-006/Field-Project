import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

// Define our Zod schema for validation
const publicationSchema = z.object({
  email: z.string().email("Valid email is required"),
  facultyName: z.string().min(1, "Faculty name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  rigGroup: z.string().min(1, "RIG Group is required"),
  academicYear: z.enum(["2023-2024", "2024-2025"]),
  authors: z.array(
    z.object({
      name: z.string().optional(),
      affiliation: z.string().optional(),
    })
  ),
  facultyPosition: z.string().min(1, "Faculty position is required"),
  studentPaper: z.enum(["Yes", "No"]),
  publicationType: z.enum(["Journal", "Conference", "Book Chapter", "Book"]),
  
  // Journal specific fields (conditionally required)
  name: z.string().optional(),
  quartile: z.string().optional(),
  title: z.string().optional(),
  volumeIssue: z.string().optional(),
  pages: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
  indexing: z.string().optional(),
  issn: z.string().optional(),
  impactFactor: z.string().optional(),
  publisher: z.string().optional(),
  paperLink: z.string().optional(),
  journalLink: z.string().optional(),
  indexDuration: z.string().optional(),
  
  // Conference specific fields
  paperTitle: z.string().optional(),
  institute: z.string().optional(),
  place: z.string().optional(),
  status: z.enum(["Published", "Yet to get Published"]).optional(),
  volume: z.string().optional(),
  pubMonth: z.string().optional(),
  pubYear: z.string().optional(),
  doi: z.string().optional(),
  conferenceLink: z.string().optional(),
  publishDuration: z.string().optional(),
  
  // Book Chapter specific fields
  bookTitle: z.string().optional(),
  isbnNumber: z.string().optional(),
  chapterNumber: z.string().optional(),
  
  // Book specific fields
  totalPages: z.string().optional(),
  edition: z.string().optional(),
}).refine(data => {
  // If publication type is Journal, require journal fields
  if (data.publicationType === 'Journal') {
    return !!data.name && !!data.quartile && !!data.title && !!data.volumeIssue && 
           !!data.pages && !!data.month && !!data.year && !!data.indexing && 
           !!data.issn && !!data.impactFactor && !!data.publisher && 
           !!data.paperLink && !!data.journalLink && !!data.indexDuration;
  }
  // If publication type is Conference, require conference fields
  else if (data.publicationType === 'Conference') {
    return !!data.name && !!data.paperTitle && !!data.institute && !!data.place && 
           !!data.month && !!data.year && !!data.status;
  }
  // If publication type is Book Chapter, require book chapter fields
  else if (data.publicationType === 'Book Chapter') {
    return !!data.title && !!data.bookTitle && !!data.publisher && !!data.year && 
           !!data.pages && !!data.isbnNumber && !!data.chapterNumber;
  }
  // If publication type is Book, require book fields
  else if (data.publicationType === 'Book') {
    return !!data.title && !!data.publisher && !!data.year && !!data.isbnNumber && 
           !!data.totalPages && !!data.edition;
  }
  return true;
}, {
  message: "Please fill all required fields for the selected publication type",
  path: ["publicationType"],
});

// Define Input component for reuse
const Input = ({ className, ...props }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-md ${className || ""}`}
    {...props}
  />
);

// Define Select component for reuse
const Select = ({ children, className, ...props }) => (
  <select
    className={`w-full p-2 border border-gray-300 rounded-md ${className || ""}`}
    {...props}
  >
    {children}
  </select>
);

// Journal Form Component
const JournalForm = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Journal Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Journal Name*
          </label>
          <Input placeholder="Journal name" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Journal Quartile*
          </label>
          <Select {...register("quartile")}>
            <option value="">Select Quartile</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </Select>
          {errors.quartile && <p className="mt-1 text-sm text-red-500">{errors.quartile.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Paper Title*
        </label>
        <Input placeholder="Paper title" {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Volume/Issue*
          </label>
          <Input placeholder="Volume/Issue" {...register("volumeIssue")} />
          {errors.volumeIssue && <p className="mt-1 text-sm text-red-500">{errors.volumeIssue.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pages*
          </label>
          <Input placeholder="Pages (e.g., 123-145)" {...register("pages")} />
          {errors.pages && <p className="mt-1 text-sm text-red-500">{errors.pages.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ISSN*
          </label>
          <Input placeholder="ISSN number" {...register("issn")} />
          {errors.issn && <p className="mt-1 text-sm text-red-500">{errors.issn.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Month*
          </label>
          <Select {...register("month")}>
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </Select>
          {errors.month && <p className="mt-1 text-sm text-red-500">{errors.month.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year*
          </label>
          <Input type="number" placeholder="Year" {...register("year")} />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Impact Factor*
          </label>
          <Input type="number" step="0.01" placeholder="Impact factor" {...register("impactFactor")} />
          {errors.impactFactor && <p className="mt-1 text-sm text-red-500">{errors.impactFactor.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Indexing*
          </label>
          <Select {...register("indexing")}>
            <option value="">Select Indexing</option>
            <option value="Scopus">Scopus</option>
            <option value="Web of Science">Web of Science</option>
            <option value="SCI">SCI</option>
            <option value="ESCI">ESCI</option>
            <option value="Other">Other</option>
          </Select>
          {errors.indexing && <p className="mt-1 text-sm text-red-500">{errors.indexing.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Publisher*
          </label>
          <Input placeholder="Publisher name" {...register("publisher")} />
          {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paper Link*
          </label>
          <Input type="url" placeholder="URL to paper" {...register("paperLink")} />
          {errors.paperLink && <p className="mt-1 text-sm text-red-500">{errors.paperLink.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Journal Link*
          </label>
          <Input type="url" placeholder="URL to journal" {...register("journalLink")} />
          {errors.journalLink && <p className="mt-1 text-sm text-red-500">{errors.journalLink.message}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Indexing Duration (months)*
        </label>
        <Input type="number" placeholder="Duration in months" {...register("indexDuration")} />
        {errors.indexDuration && <p className="mt-1 text-sm text-red-500">{errors.indexDuration.message}</p>}
      </div>
    </div>
  );
};

// Conference Form Component
const ConferenceForm = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const status = watch("status");
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Conference Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Conference Name*
        </label>
        <Input placeholder="Conference name" {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Paper Title*
        </label>
        <Input placeholder="Paper title" {...register("paperTitle")} />
        {errors.paperTitle && <p className="mt-1 text-sm text-red-500">{errors.paperTitle.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organizing Institute*
          </label>
          <Input placeholder="Institute name" {...register("institute")} />
          {errors.institute && <p className="mt-1 text-sm text-red-500">{errors.institute.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conference Place*
          </label>
          <Input placeholder="City, Country" {...register("place")} />
          {errors.place && <p className="mt-1 text-sm text-red-500">{errors.place.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conference Month*
          </label>
          <Select {...register("month")}>
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </Select>
          {errors.month && <p className="mt-1 text-sm text-red-500">{errors.month.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conference Year*
          </label>
          <Input type="number" placeholder="Year" {...register("year")} />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status*
          </label>
          <Select {...register("status")}>
            <option value="">Select Status</option>
            <option value="Published">Published</option>
            <option value="Yet to get Published">Yet to get Published</option>
          </Select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
        </div>
      </div>
      
      {status === "Published" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Volume
              </label>
              <Input placeholder="Volume" {...register("volume")} />
              {errors.volume && <p className="mt-1 text-sm text-red-500">{errors.volume.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pages
              </label>
              <Input placeholder="Pages (e.g., 123-145)" {...register("pages")} />
              {errors.pages && <p className="mt-1 text-sm text-red-500">{errors.pages.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Month
              </label>
              <Select {...register("pubMonth")}>
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </Select>
              {errors.pubMonth && <p className="mt-1 text-sm text-red-500">{errors.pubMonth.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Year
              </label>
              <Input type="number" placeholder="Year" {...register("pubYear")} />
              {errors.pubYear && <p className="mt-1 text-sm text-red-500">{errors.pubYear.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indexing
              </label>
              <Select {...register("indexing")}>
                <option value="">Select Indexing</option>
                <option value="Scopus">Scopus</option>
                <option value="Web of Science">Web of Science</option>
                <option value="SCI">SCI</option>
                <option value="ESCI">ESCI</option>
                <option value="Other">Other</option>
              </Select>
              {errors.indexing && <p className="mt-1 text-sm text-red-500">{errors.indexing.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ISSN
              </label>
              <Input placeholder="ISSN number" {...register("issn")} />
              {errors.issn && <p className="mt-1 text-sm text-red-500">{errors.issn.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                DOI
              </label>
              <Input placeholder="DOI number" {...register("doi")} />
              {errors.doi && <p className="mt-1 text-sm text-red-500">{errors.doi.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publisher
              </label>
              <Input placeholder="Publisher name" {...register("publisher")} />
              {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paper Link
              </label>
              <Input type="url" placeholder="URL to paper" {...register("paperLink")} />
              {errors.paperLink && <p className="mt-1 text-sm text-red-500">{errors.paperLink.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conference Link
              </label>
              <Input type="url" placeholder="URL to conference" {...register("conferenceLink")} />
              {errors.conferenceLink && <p className="mt-1 text-sm text-red-500">{errors.conferenceLink.message}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Indexing Duration (months)
            </label>
            <Input type="number" placeholder="Duration in months" {...register("indexDuration")} />
            {errors.indexDuration && <p className="mt-1 text-sm text-red-500">{errors.indexDuration.message}</p>}
          </div>
        </>
      )}
      
      {status === "Yet to get Published" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Publication Duration (months)
          </label>
          <Input type="number" placeholder="Expected duration in months" {...register("publishDuration")} />
          {errors.publishDuration && <p className="mt-1 text-sm text-red-500">{errors.publishDuration.message}</p>}
        </div>
      )}
    </div>
  );
};

// Book Chapter Form Component
const BookChapterForm = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Book Chapter Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Chapter Title*
        </label>
        <Input placeholder="Chapter title" {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Book Title*
        </label>
        <Input placeholder="Book title" {...register("bookTitle")} />
        {errors.bookTitle && <p className="mt-1 text-sm text-red-500">{errors.bookTitle.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Publisher*
          </label>
          <Input placeholder="Publisher name" {...register("publisher")} />
          {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year*
          </label>
          <Input type="number" placeholder="Year" {...register("year")} />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pages*
          </label>
          <Input placeholder="Number of pages" {...register("pages")} />
          {errors.pages && <p className="mt-1 text-sm text-red-500">{errors.pages.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ISBN Number*
          </label>
          <Input placeholder="ISBN number" {...register("isbnNumber")} />
          {errors.isbnNumber && <p className="mt-1 text-sm text-red-500">{errors.isbnNumber.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chapter Number*
          </label>
          <Input type="number" placeholder="Chapter number" {...register("chapterNumber")} />
          {errors.chapterNumber && <p className="mt-1 text-sm text-red-500">{errors.chapterNumber.message}</p>}
        </div>
      </div>
    </div>
  );
};

// Book Form Component
const BookForm = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Book Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Book Title*
        </label>
        <Input placeholder="Book title" {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Publisher*
          </label>
          <Input placeholder="Publisher name" {...register("publisher")} />
          {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year*
          </label>
          <Input type="number" placeholder="Year" {...register("year")} />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ISBN Number*
          </label>
          <Input placeholder="ISBN number" {...register("isbnNumber")} />
          {errors.isbnNumber && <p className="mt-1 text-sm text-red-500">{errors.isbnNumber.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Pages*
          </label>
          <Input type="number" placeholder="Number of pages" {...register("totalPages")} />
          {errors.totalPages && <p className="mt-1 text-sm text-red-500">{errors.totalPages.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Edition*
          </label>
          <Input placeholder="Edition (e.g., First, Second)" {...register("edition")} />
          {errors.edition && <p className="mt-1 text-sm text-red-500">{errors.edition.message}</p>}
        </div>
      </div>
    </div>
  );
};

// Main Publication Form Component
export default function PublicationForm() {
  const [user, setUser] = useState({});
  const [publicationType, setPublicationType] = useState("");
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      email: "",
      facultyName: "",
      employeeId: "",
      rigGroup: "",
      academicYear: undefined,
      authors: Array(6).fill({ name: "", affiliation: "" }),
      facultyPosition: "",
      studentPaper: undefined,
      publicationType: undefined
    }
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;
  
  const selectedPublicationType = watch("publicationType");
  
  useEffect(() => {
    // If publicationType changes in the form, update the local state
    if (selectedPublicationType) {
      setPublicationType(selectedPublicationType);
    }
  }, [selectedPublicationType]);
  
  const onSubmit = async (data) => {
    try {
      if (!user?._id) {
        toast("User not authenticated", { 
          style: { backgroundColor: "red", color: "white" } 
        });
        return;
      }
      
      // Base publication data common to all types
      const basePublicationData = {
        user: user._id,
        email: data.email,
        facultyName: data.facultyName,
        employeeId: data.employeeId,
        rigNo: data.rigGroup,
        academicYear: data.academicYear,
        authors: data.authors.filter(author => author.name && author.affiliation),
        facultyAuthorPosition: data.facultyPosition,
        doesPaperBelongToStudent: data.studentPaper === "Yes",
        publicationType: data.publicationType
      };
      
      let publicationData;
      let endpoint;
      
      // Format data based on publication type
      switch (data.publicationType) {
        case "Journal":
          publicationData = {
            ...basePublicationData,
            journalName: data.name,
            journalQuartile: data.quartile,
            paperTitle: data.title,
            volumeIssue: data.volumeIssue,
            pageNumbers: data.pages,
            publicationMonth: data.month,
            publicationYear: data.year,
            indexing: data.indexing,
            issnNumber: data.issn,
            impactFactor: data.impactFactor,
            publisherName: data.publisher,
            paperLink: data.paperLink,
            journalLink: data.journalLink,
            indexingDuration: data.indexDuration
          };
          endpoint = "journal";
          break;
          
        case "Conference":
          publicationData = {
            ...basePublicationData,
            conferenceName: data.name,
            conferenceTitle: data.paperTitle,
            organizedInstitute: data.institute,
            conferencePlace: data.place,
            conferenceMonth: data.month,
            conferenceYear: data.year,
            status: data.status,
            ...(data.status === "Published" && {
              volume: data.volume,
              pages: data.pages,
              indexing: data.indexing,
              issn: data.issn,
              doi: data.doi,
              publisher: data.publisher,
              paperLink: data.paperLink,
              conferenceLink: data.conferenceLink,
              indexDuration: data.indexDuration
            }),
            ...(data.status === "Yet to get Published" && {
              publishDuration: data.publishDuration
            })
          };
          endpoint = "conference";
          break;
          
        case "Book Chapter":
          publicationData = {
            ...basePublicationData,
            title: data.title,
            bookTitle: data.bookTitle,
            publisher: data.publisher,
            year: data.year,
            pages: data.pages,
            isbnNumber: data.isbnNumber,
            chapterNumber: data.chapterNumber
          };
          endpoint = "book-chapter";
          break;
          
        case "Book":
          publicationData = {
            ...basePublicationData,
            title: data.title,
            publisher: data.publisher,
            year: data.year,
            isbnNumber: data.isbnNumber,
            totalPages: data.totalPages,
            edition: data.edition
          };
          endpoint = "book";
          break;
          
        default:
          throw new Error("Invalid publication type");
      }

      console.log("Publication Data:", publicationData);
      
      // Submit data to API
      const response = await axios.post(
        `http://localhost:4500/publication/create/${endpoint}`,
        publicationData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        toast("Publication submitted successfully!", { 
          style: { backgroundColor: "green", color: "white" } 
        });
        form.reset();
        setPublicationType("");
      }
      
    } catch (error) {
      console.error("Error submitting publication:", error);
      toast(error instanceof Error ? error.message : "Failed to submit publication", { 
        style: { backgroundColor: "red", color: "white" } 
      });
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
                      Email*
                    </label>
                    <Input 
                      placeholder="Enter your email" 
                      {...register("email")} 
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Faculty Name*
                    </label>
                    <Input 
                      placeholder="Enter faculty name with designation" 
                      {...register("facultyName")} 
                    />
                    {errors.facultyName && (
                      <p className="mt-1 text-sm text-red-500">{errors.facultyName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID*
                    </label>
                    <Input 
                      placeholder="Enter employee ID" 
                      {...register("employeeId")} 
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-sm text-red-500">{errors.employeeId.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RIG Group*
                    </label>
                    <Select {...register("rigGroup")}>
                      <option value="">Select RIG Group</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={`RIG ${i + 1}`}>
                          {`RIG ${i + 1}`}
                        </option>
                      ))}
                    </Select>
                    {errors.rigGroup && (
                      <p className="mt-1 text-sm text-red-500">{errors.rigGroup.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Academic Year*
                    </label>
                    <Select {...register("academicYear")}>
                      <option value="">Select Academic Year</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2024-2025">2024-2025</option>
                    </Select>
                    {errors.academicYear && (
                      <p className="mt-1 text-sm text-red-500">{errors.academicYear.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Faculty Position and Student Paper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Faculty Position in Authors List*
                    </label>
                    <Select {...register("facultyPosition")}>
                      <option value="">Select Position</option>
                      <option value="1">1st Author</option>
                      <option value="2">2nd Author</option>
                      <option value="3">3rd Author</option>
                      <option value="4">4th Author</option>
                      <option value="5">5th Author</option>
                      <option value="6">6th Author</option>
                    </Select>
                    {errors.facultyPosition && (
                      <p className="mt-1 text-sm text-red-500">{errors.facultyPosition.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student Paper*
                    </label>
                    <Select {...register("studentPaper")}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Select>
                    {errors.studentPaper && (
                      <p className="mt-1 text-sm text-red-500">{errors.studentPaper.message}</p>
                    )}
                  </div>
                </div>

                {/* Authors Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Authors
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Enter all authors in order. At least one author is required.</p>
                  
                  {Array(6).fill(null).map((_, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4" key={index}>
                      <div>
                        <Input 
                          placeholder={`Author ${index + 1} Name`} 
                          {...register(`authors.${index}.name`)} 
                        />
                      </div>
                      <div>
                        <Input 
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
                    Publication Type*
                  </label>
                  <Select {...register("publicationType")}>
                    <option value="">Select Publication Type</option>
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Book">Book</option>
                  </Select>
                  {errors.publicationType && (
                    <p className="mt-1 text-sm text-red-500">{errors.publicationType.message}</p>
                  )}
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
