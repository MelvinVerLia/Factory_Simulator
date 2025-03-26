import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import Layout from "./component/Layout";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
