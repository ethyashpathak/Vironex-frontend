import { useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header/Header.jsx'
import Sidebar from './components/Header/Sidebar.jsx'
import { useAuthInit } from './custom-hooks/useAuthinit.js'

function App({ children }) {
  const sidebarOpen = useSelector(state => state.sideBar?.status)
  useAuthInit();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <Sidebar />
      <main className={`pt-14 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  )
}

export default App
