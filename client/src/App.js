import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LogIn/index';

const App = () => {
  const logger = require('./utils/logger');

  app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
  
  app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  });  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;