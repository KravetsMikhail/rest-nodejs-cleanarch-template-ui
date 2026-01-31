import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';

function TestComponent() {
  const location = useLocation();
  console.log('TestComponent - location:', location.pathname);
  
  return (
    <div>
      <h1>Minimal Router Test</h1>
      <p>Current path: {location.pathname}</p>
      <p>Matched: {location.pathname.includes('/tasks/show/') ? 'YES' : 'NO'}</p>
    </div>
  );
}

function AppMinimal() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tasks/show/:id" element={<TestComponent />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppMinimal;
