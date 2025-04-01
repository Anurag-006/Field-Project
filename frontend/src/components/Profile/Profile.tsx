import { Button } from "../ui/button"
import { useState } from "react"
import PublicationWindow from "../PublicationWindow/PublicationWindow";

const dummyData = [
  {
    title: "Exploring the Future of AI",
    description: "A deep dive into the potential and challenges of artificial intelligence.",
    link: "#"
  },
  {
    title: "The Rise of Remote Work",
    description: "How remote work is shaping the future of employment and collaboration.",
    link: "#"
  },
  {
    title: "Sustainability in Modern Cities",
    description: "Examining sustainable practices and green innovations in urban environments.",
    link: "#"
  },
  {
    title: "Blockchain: Beyond Cryptocurrency",
    description: "Understanding the broader applications of blockchain technology.",
    link: "#"
  },
  {
    title: "Mental Health in the Digital Age",
    description: "Addressing the impact of digital technologies on mental well-being.",
    link: "#"
  },
  {
    title: "The Next Generation of Space Exploration",
    description: "What the future holds for space travel and humanity’s journey into the cosmos.",
    link: "#"
  },
  {
    title: "The Impact of Social Media on Society",
    description: "Exploring the positive and negative effects of social media on our culture.",
    link: "#"
  },
  {
    title: "Advancements in Quantum Computing",
    description: "What quantum computing means for the future of technology and business.",
    link: "#"
  },
  {
    title: "The Evolution of E-Commerce",
    description: "How online shopping is changing the retail landscape.",
    link: "#"
  },
  {
    title: "The Role of Education in a Digital World",
    description: "How digital technologies are transforming education and learning.",
    link: "#"
  }
];

const Profile = () => {
  const [showPublications, setShowPublications] = useState(false)
  const handleClick = () => {
    setShowPublications(!showPublications);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <p className="text-lg">Welcome to your publications page!</p>
        <Button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        onClick={handleClick}
        >
          View Publications
        </Button>

        {showPublications && <PublicationWindow publications={dummyData}/>}
      </div>
    </div>
  )
}

export default Profile