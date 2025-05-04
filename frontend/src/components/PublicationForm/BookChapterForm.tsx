import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function BookChapterForm() {
  const { register, setValue, watch } = useFormContext();
  const status = watch("bookChapter.status");

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h2 className="text-xl font-semibold">Book Chapter Details</h2>
      
      <Input placeholder="Title of the Book Chapter" {...register("bookChapter.title")} required />
      <Input placeholder="Title of the Paper in Book Chapter" {...register("bookChapter.paperTitle")} required />
      <Input placeholder="Title of the Proceedings of the Conference" {...register("bookChapter.proceedingsTitle")} />
      <Input placeholder="Month of Presentation of Paper" {...register("bookChapter.month")} />
      <Input placeholder="Year of Presentation of Paper" {...register("bookChapter.year")} />
      
      <Select onValueChange={(val) => setValue("bookChapter.status", val)}>
        <SelectTrigger><SelectValue placeholder="Book Chapter details" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Yet to get Published">Yet to get Published</SelectItem>
        </SelectContent>
      </Select>

      {status === "Published" ? (
        <>
          <Input placeholder="Month of Publication" {...register("bookChapter.monthPublished")} required />
          <Input placeholder="Year of Publication" {...register("bookChapter.yearPublished")} required />
          <Input placeholder="Volume and Issue Number" {...register("bookChapter.volumeIssue")} required />
          <Input placeholder="Page Numbers" {...register("bookChapter.pages")} required />
          <Input placeholder="ISSN/ISBN Number" {...register("bookChapter.isbn")} required />

          <Select onValueChange={(val) => setValue("bookChapter.indexing", val)}>
            <SelectTrigger><SelectValue placeholder="Indexing" /></SelectTrigger>
            <SelectContent>
              {["Scopus", "Web of Science", "Scopus & Web of Science", "UGC", "Google Scholar"].map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Publisher Name" {...register("bookChapter.publisher")} required />
          <Input placeholder="DOI Number or Link" {...register("bookChapter.doi")} required />
          <Input placeholder="Link of Published Paper in Book Chapter" {...register("bookChapter.paperLink")} required />
          <Input placeholder="Link of Book Chapter" {...register("bookChapter.bookLink")} required />

          <Label>
            Full Length Paper of All Pages in Book Chapter (PDF)
            <Input type="file" accept="application/pdf" {...register("bookChapter.fullPaper")} required />
          </Label>

          <Select onValueChange={(val) => setValue("bookChapter.indexDuration", val)}>
            <SelectTrigger><SelectValue placeholder="Approximate duration to get Indexed" /></SelectTrigger>
            <SelectContent>
              {["1 Month", "3 Months", "6 Months", "Already indexed"].map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>
            Indexing Proof of Book Chapter (if indexed)
            <Input type="file" accept="application/pdf" {...register("bookChapter.indexingProof")} />
          </Label>
        </>
      ) : status === "Yet to get Published" ? (
        <>
          <Select onValueChange={(val) => setValue("bookChapter.publishDuration", val)}>
            <SelectTrigger><SelectValue placeholder="Approximate duration to get Published" /></SelectTrigger>
            <SelectContent>
              {["1 Month", "3 Months", "6 Months"].map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : null}
    </div>
  );
}

export default BookChapterForm;