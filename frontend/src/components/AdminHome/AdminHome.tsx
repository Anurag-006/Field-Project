import { useState, useEffect } from "react";
import { AdminPublicationTable } from "./AdminPublicationTable";
import { Publication } from "../../types/publication.types";
import { PublicationCard } from "../PublicationCard/PublicationCard.js";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function AdminHome() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("http://localhost:4500/publication/all");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPublications(data.data); // Use the 'data' field from the response
        console.log("Publications data:", data.data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Publications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AdminPublicationTable publications={publications} onSelect={setSelectedPub} />

          <Drawer open={!!selectedPub} onOpenChange={() => setSelectedPub(null)}>
            <DrawerContent className="max-w-3xl ml-auto h-full overflow-y-auto p-4">
              <DrawerHeader className="flex items-center justify-between">
                <DrawerTitle>Publication Details</DrawerTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPub(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </DrawerHeader>
              {selectedPub && <PublicationCard publication={selectedPub} />}
            </DrawerContent>
          </Drawer>
        </>
      )}
    </div>
  );
}
