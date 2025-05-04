import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function BookForm() {
  const { register, setValue } = useFormContext();

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h2 className="text-xl font-semibold">Book Publication Details</h2>
      
      <Input placeholder="Title of the Book" {...register("book.title")} required />
      <Input placeholder="Month of Publication" {...register("book.month")} required />
      <Input placeholder="Year of Publication" {...register("book.year")} required />
      <Input placeholder="Publisher Name" {...register("book.publisher")} required />
      
      <Select onValueChange={(val) => setValue("book.type", val)}>
        <SelectTrigger><SelectValue placeholder="Book Published" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Online">Online</SelectItem>
          <SelectItem value="Offline">Offline</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Link of Published Book" {...register("book.bookLink")} required />

      <Label>
        Proof of Published Book (Page containing details and title) (PDF)
        <Input type="file" accept="application/pdf" {...register("book.proof")} required />
      </Label>
    </div>
  );
}
export default BookForm;