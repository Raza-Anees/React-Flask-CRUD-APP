import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobBoard from './Components/JobBoard';
import AddEditJob from './Components/AddEditJob';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-800 text-black">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5 bg-transparent">
          <Link to="/">
            <h1 className="text-2xl font-bold text-black">Actuary List</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-black hover:underline">About</a>
            <a href="#" className="text-black hover:underline">Blog</a>
            <Link to="/add" className="text-black hover:underline">Post A Job</Link>
            <button className="bg-green-400 text-black px-4 py-2 rounded-lg font-semibold flex items-center">
              Get Free Job Alerts
            </button>
          </nav>
        </header>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<JobBoard />} />
          <Route path="/add" element={<AddEditJob isEdit={false} />} />
          <Route path="/edit/:id" element={<AddEditJob isEdit={true} />} />
        </Routes>
      </div>
    </Router>
  );
} 










// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import JobBoard from './components/JobBoard';
// import JobForm from './components/JobForm';
// import "./App.css";
// import { FaSearch } from 'react-icons/fa';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-800 text-white">
//         {/* Header */}
//         <header className="flex items-center justify-between px-10 py-5 bg-transparent">
//           <Link to="/">
//             <h1 className="text-2xl font-bold text-white">Actuary List</h1>
//           </Link>
//           <nav className="flex items-center space-x-6">
//             <a href="#" className="text-white hover:underline">About</a>
//             <a href="#" className="text-white hover:underline">Blog</a>
//             <Link to="/post-job" className="text-white hover:underline">Post A Job</Link>
//             <button className="bg-green-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center">
//               <FaSearch className="mr-2" /> Get Free Job Alerts
//             </button>
//           </nav>
//         </header>

//         {/* Hero Content */}
//         <section className="text-center mt-20 px-4">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Find Handpicked Actuarial Jobs<br />That Match Your Expertise
//           </h2>
//           <p className="text-lg mb-8">
//             With 300+ open roles and 50 new jobs posted weekly, your dream job is just a click away.
//           </p>

//           {/* Search Box */}
//           <div className="flex justify-center max-w-xl mx-auto">
//             <input
//               type="text"
//               placeholder="Enter Keyword or Job Title or Location"
//               className="w-full px-4 py-3 text-gray-800 rounded-l-lg"
//             />
//             <button className="flex items-center gap-2 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-r-lg font-semibold text-sm">
//               <FaSearch /> Search Jobs
//             </button>
//           </div>

//           {/* Trust Info */}
//           <div className="mt-10 flex justify-center items-center gap-4">
//             <div className="flex items-center">
//               <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-2" alt="avatar" />
//               <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-2" alt="avatar" />
//               <img src="https://randomuser.me/api/portraits/men/12.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-2" alt="avatar" />
//             </div>
//             <span className="text-sm">Trusted by 1700+ actuaries finding their dream jobs.</span>
//           </div>
//         </section>

//         {/* Routes */}
//         <Routes>
//           <Route path="/" element={<JobBoard />} />
//           <Route path="/post-job" element={<JobForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
