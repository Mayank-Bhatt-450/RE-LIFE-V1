import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NAV from './components/nav_bar/nav_bar';
import './main.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';
import Profile from "./pages/profile/profile";
import MarketPlace from './pages/market_place/market_place';
import AddTask from './pages/add_task/add_task';
// import SubTask from './pages/sub_task/sub_task';
import SubSkillsPage from './pages/sub_task/sub_task';
import ImportantTaskList from './pages/task_list/task_list';
import Quest from './pages/add_quest/add_quest';

import Quests from './pages/quests/quests';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <NAV />
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/add-task" element={<AddTask />} />
      {/* <Route path="/sub-task" element={<SubTask />} /> */}
      <Route path="/add-quest" element={<Quest />} />
      <Route path="/quests" element={<Quests />} />
      <Route path="/task-list" element={<ImportantTaskList />} />
      <Route path="/sub-skills" element={<SubSkillsPage />} />


    </Routes>
  </Router>
);
