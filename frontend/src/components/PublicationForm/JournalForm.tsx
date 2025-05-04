import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function JournalForm() {
  const { register, setValue } = useFormContext();

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h2 className="text-xl font-semibold">Journal Publication Details</h2>
      <Input placeholder="Name of the Journal" {...register("journal.name")} required />

      <Select onValueChange={(val) => setValue("journal.quartile", val)}>
        <SelectTrigger><SelectValue placeholder="Quartile of Journal" /></SelectTrigger>
        <SelectContent>
          {['Q1', 'Q2', 'Q3', 'Q4', 'No Quartile assigned'].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
        </SelectContent>
      </Select>

      <Input placeholder="Title of the Paper" {...register("journal.title")} required />
      <Input placeholder="Volume and Issue no" {...register("journal.volumeIssue")} required />
      <Input placeholder="Page No.s" {...register("journal.pages")} required />
      <Input placeholder="Month of publication" {...register("journal.month")} required />
      <Input placeholder="Year of publication" {...register("journal.year")} required />

      <Select onValueChange={(val) => setValue("journal.indexing", val)}>
        <SelectTrigger><SelectValue placeholder="Indexing" /></SelectTrigger>
        <SelectContent>
          {['Web of Science', 'UGC', 'IEEE Transactions', 'SCI', 'SCOPUS', 'Scopus with Web of Science', 'Google Scholar'].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
        </SelectContent>
      </Select>

      <Input placeholder="ISSN number" {...register("journal.issn")} required />
      <Input placeholder="Impact Factor" {...register("journal.impactFactor")} required />
      <Input placeholder="Publisher Name" {...register("journal.publisher")} required />
      <Input placeholder="Link of Paper" {...register("journal.paperLink")} required />
      <Input placeholder="Link of Journal" {...register("journal.journalLink")} required />

      <Label>
        Full Paper of Published Proof (PDF)
        <Input type="file" accept="application/pdf" {...register("journal.fullPaperProof")} required />
      </Label>

      <Label>
        Indexing Proof of Paper (if indexed)
        <Input type="file" accept="application/pdf" {...register("journal.indexingProof")} />
      </Label>

      <Select onValueChange={(val) => setValue("journal.indexDuration", val)}>
        <SelectTrigger><SelectValue placeholder="Approximate duration to get Indexed" /></SelectTrigger>
        <SelectContent>
          {['1 Month', '3 Months', '6 Months', 'Indexed proof attached above'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export default JournalForm;