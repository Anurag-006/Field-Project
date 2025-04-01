const Login = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Login</h1>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 
            text-white font-bold rounded transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login