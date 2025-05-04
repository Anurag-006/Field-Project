import { useEffect, useState, useMemo } from "react";
import { AdminPublicationTable } from "./AdminPublicationTable";
import { Button } from "../ui/button";
import ExcelJS from "exceljs";

export default function AdminHome() {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchPublications = async () => {
      const res = await fetch("http://localhost:4500/publication/all");
      const json = await res.json();
      setPublications(json.data);
      setFiltered(json.data);
    };
    fetchPublications();
  }, []);

  useEffect(() => {
    let result = [...publications];

    if (typeFilter !== "all") {
      result = result.filter((pub) => pub.type === typeFilter);
    }

    if (search) {
      result = result.filter((pub) =>
        (pub.paperTitle || pub.conferenceTitle || pub.bookTitle || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [typeFilter, search, publications]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Filtered Publications");

    // Define headers
    sheet.addRow([
      "S. No.",
      "Faculty Name",
      "Authors",
      "Full Title",
      "Venue",
      "Volume/Issue/Page",
      "Date",
      "ISSN/ISBN",
      "Impact Factor",
      "Indexed In",
      "Citations",
    ]);

    filtered.forEach((pub, i) => {
      const title =
        pub.type === "journal"
          ? pub.paperTitle
          : pub.type === "conference"
          ? pub.conferenceTitle
          : pub.type === "bookChapter"
          ? pub.bookChapterTitle
          : pub.bookTitle;

      const venue =
        pub.type === "journal"
          ? pub.journalName
          : pub.type === "conference"
          ? pub.conferenceName
          : pub.type === "bookChapter"
          ? pub.proceedingsTitle
          : pub.bookPublisher;

      const date =
        pub.publicationYear ||
        pub.conferenceYear ||
        pub.presentationYear ||
        pub.bookPublicationYear;

      sheet.addRow([
        i + 1,
        pub.facultyName || "",
        pub.authors?.map((a) => a.name).join(", "),
        title,
        venue,
        pub.volume || "",
        date,
        pub.issn || pub.isbn || "",
        pub.impactFactor || "",
        pub.indexedIn || "",
        pub.citations || "",
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `filtered-publications.xlsx`;
    link.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">All Publications</h1>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
            <option value="bookChapter">Book Chapter</option>
            <option value="book">Book</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title..."
            className="border rounded px-2 py-1"
          />
          <Button onClick={exportToExcel}>Export</Button>
        </div>
      </div>
      <AdminPublicationTable publications={filtered} />
    </div>
  );
}
