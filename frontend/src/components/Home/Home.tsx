// import { Button } from "../ui/button"
import Profile from "../Profile/Profile.js";
import AdminHome from "../AdminHome/AdminHome.js";


const Home = () => {
  const user = localStorage.getItem("user");
  const isAdmin = user && JSON.parse(user).role === "admin";
  return (
    <>
      {
        isAdmin ? (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Home</h1>
            <AdminHome />
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Home</h1>
            <Profile />
          </div>
        )
      }
    </>
  )
}

export default Home