import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import BottomNav from './components/BottomNav';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add other routes as needed */}
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;