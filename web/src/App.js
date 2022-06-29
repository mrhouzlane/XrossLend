import React from "react";

import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./pages/index";
import { BorrowPage } from "./pages/borrow";
import { MyPage } from "./pages/my";
import { LendPage } from "./pages/lend";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/borrow" element={<BorrowPage />} />
      <Route path="/lend" element={<LendPage />} />
    </Routes>
  );
};

export default App;
