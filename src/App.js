import React from 'react';
import './login.css';
import Home from './component/Home';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import PublicRoutes from './component/Routes/PublicRoutes.jsx';
import ProtectedRoutes from './component/Routes/ProtectedRoutes.jsx';
import Cookies from 'js-cookie';
//auth
import Login from './component/Login';
import DashBord from './component/DashBord.jsx';
import TotalPurchaseList from './component/TotalPurchaseList.jsx';
import TotalSaleList from './component/TotalSaleList.jsx';
import TotalBankList from './component/TotalBankList.jsx';

import Notfoundpage from './component/NotFound.jsx';
import Listpartners from './component/Listpartners.jsx';
import Addpartners from './component/Addpartners.jsx';
import Editpartners from './component/Editpartners.jsx';
import Listclients from './component/Listclients.jsx';
import Addclients from './component/Addclients.jsx';
import Editclients from './component/Editclients.jsx';

import ListLicence from './component/ListLicence.jsx';
import AddLicence from './component/AddLicence.jsx';
import EditLicence from './component/EditLicence.jsx';
import ListCompliances from './component/ListCompliances.jsx';
import AddCompliances from './component/AddCompliances.jsx';
import EditCompliances from './component/EditCompliances.jsx';

import AddUser from './component/AddUser.jsx';
import UserList from './component/UserList.jsx';
import EditUser from './component/EditUser.jsx';

function App() {
  const user = JSON.parse(Cookies.get('user') || '{}');
  const user_type = user?.user_type;
  console.log('user', user);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('load');
    const user = Cookies.get('user');
    const user_type = user?.user_type;
    if (!user) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [window.location.href]);

  return (
    <Routes>
      {/* ProtectedRoutes */}
      <Route path="/" element={<ProtectedRoutes />}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/clients/dashboard/:dashboardId" element={<DashBord />} />

        <Route exact path="/TotalPurchaseList" element={<TotalPurchaseList />} />
        <Route exact path="/TotalSaleList" element={<TotalSaleList />} />
        <Route exact path="/TotalBankBalanceList" element={<TotalBankList />} />

        <Route exact path="/clients/list" element={<Listclients />} />
        <Route exact path="/clients/add" element={<Addclients />} />
        <Route exact path="/clients/edit/:id" element={<Editclients />} />

        {(user_type === 'Admin' || user_type === 'Partner') && (
          <>
            <Route exact path="/licence/list" element={<ListLicence />} />
            <Route exact path="/licence/create" element={<AddLicence />} />
            <Route exact path="/licence/Edit/:id" element={<EditLicence />} />

            {/* user */}
            <Route exact path="/User/AddUser" element={<AddUser />} />
            <Route exact path="/User/list" element={<UserList />} />
            <Route exact path="/User/EditUser/:userId" element={<EditUser />} />
          </>
        )}

        {user_type === 'Admin' && (
          <>
            <Route exact path="/partners/list" element={<Listpartners />} />
            <Route exact path="/partners/add" element={<Addpartners />} />
            <Route exact path="/partners/edit/:id" element={<Editpartners />} />
            <Route exact path="/compliance/list" element={<ListCompliances />} />
            <Route exact path="/compliance/add" element={<AddCompliances />} />
            <Route exact path="/compliance/edit/:id" element={<EditCompliances />} />
          </>
        )}
        <Route path="*" element={<Notfoundpage />} />
      </Route>

      {/* PublicRoutes */}
      <Route path="/login" element={<PublicRoutes />}>
        <Route exact path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
