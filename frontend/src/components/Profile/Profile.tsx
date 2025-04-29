import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import PublicationWindow from "../PublicationWindow/PublicationWindow";
import { IPublication } from "../PublicationCard/PublicationCard";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState<IPublication[]>([])
  const [showPublications, setShowPublications] = useState(false)
  
  useEffect(()=>{
    if (!showPublications) return;

    const fetchPublications = async () => {
      try {
        const response = await axios.get("http://localhost:4500/user/publications", {
          withCredentials: true,
        });
        if (response.status !== 200) {
          console.error("Error fetching publications:", response.data);
          return;
        }
        setData(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchPublications();
  }, [showPublications]);

  const handleClick = () => {
    setShowPublications(!showPublications);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <p className="text-lg">Welcome to your publications page!</p>
        <Button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        onClick={handleClick}
        >
          {showPublications ? "Hide Publications" : "View Publications"}
        </Button>

        {showPublications && <PublicationWindow publications={data}/>}
      </div>
    </div>
  )
}

export default Profile