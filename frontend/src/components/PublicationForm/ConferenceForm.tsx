import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ConferenceForm() {
  const { register, setValue, watch } = useFormContext();
  const status = watch("conference.status");

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h2 className="text-xl font-semibold">Conference Details</h2>

      <Input placeholder="Name of the Conference" {...register("conference.name")} required />
      <Input placeholder="Title of the Conference Paper" {...register("conference.paperTitle")} required />
      <Input placeholder="Organized Institute name" {...register("conference.institute")} required />
      <Input placeholder="Place of conference held" {...register("conference.place")} required />
      <Input placeholder="Month of conference held and Presented" {...register("conference.month")} required />
      <Input placeholder="Year of conference held" {...register("conference.year")} required />

      <Label>
        Participation Certificate (PDF)
        <Input type="file" accept="application/pdf" {...register("conference.certificate")} required />
      </Label>

      <Select onValueChange={(val) => setValue("conference.status", val)}>
        <SelectTrigger><SelectValue placeholder="Presented Paper Details" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Yet to get Published">Yet to get Published</SelectItem>
        </SelectContent>
      </Select>

      {status === "Published" ? (
        <>
          <Input placeholder="Volume and issue Number" {...register("conference.volume")} required />
          <Input placeholder="Page Numbers" {...register("conference.pages")} required />
          <Input placeholder="Month of Publication" {...register("conference.pubMonth")} required />
          <Input placeholder="Year of Publication" {...register("conference.pubYear")} required />

          <Select onValueChange={(val) => setValue("conference.indexing", val)}>
            <SelectTrigger><SelectValue placeholder="Indexing" /></SelectTrigger>
            <SelectContent>
              {["IEEE", "Scopus", "Web of Science", "Scopus & Web of Science", "UGC", "Google Scholar"].map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="ISSN / ISBN Number" {...register("conference.issn")} required />
          <Input placeholder="DOI Number or Link" {...register("conference.doi")} required />
          <Input placeholder="Publisher Name" {...register("conference.publisher")} required />
          <Input placeholder="Link of Published Conference Paper" {...register("conference.paperLink")} required />
          <Input placeholder="Link of the Conference" {...register("conference.conferenceLink")} required />

          <Label>
            Full Paper of the Published Conference Paper (PDF)
            <Input type="file" accept="application/pdf" {...register("conference.fullPaper")} required />
          </Label>

          <Label>
            Indexing Proof (PDF)
            <Input type="file" accept="application/pdf" {...register("conference.indexingProof")} />
          </Label>

          <Select onValueChange={(val) => setValue("conference.indexDuration", val)}>
            <SelectTrigger><SelectValue placeholder="Approximate duration to get Indexing" /></SelectTrigger>
            <SelectContent>
              {["1 Month", "3 Months", "6 Months", "Already indexed attached above"].map(i => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : status === "Yet to get Published" ? (
        <>
          <Select onValueChange={(val) => setValue("conference.publishDuration", val)}>
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

export default ConferenceForm;