import React from 'react'
import { Routes,Route } from 'react-router-dom'
import CustomerHome from './pages/Customer/ShowallCustomer';
import CreateCustomer from './pages/Customer/CreateCustomer';
import DeleteCustomer from './pages/Customer/DeleteCustomer';
import EditCustomer from './pages/Customer/EditCustomer';
import ShowCustomer from './pages/Customer/ShowCustomer';
import CustomerButton from './components/CustomerButton';
import BusOwnerHome from './pages/BusOwner/ShowallBusOwner';
import CreateBusOwner from './pages/BusOwner/CreateBusOwner';
import DeleteBusOwner from './pages/BusOwner/DeleteBusOwner';
import EditBusOwner from './pages/BusOwner/EditBusOwner';
import ShowBusOwner from './pages/BusOwner/ShowBusOwner';
import Login from './components/Login';
import DashboardLayoutCus from "./pages/Customer/DashboardLayoutCus";
import Home from './pages/Home';



function App() {
  return (
<Routes>

  <Route path='/' element={<Login/>} />
  {/* <Route path='/busowner/create' element={<CreateBusOwner/>} />
  <Route path='/busowner/details/:id' element={<ShowBusOwner/>} />
  <Route path='/busowner/edit/:id' element={<EditBusOwner/>} />
  <Route path='/busowner/delete/:id' element={<DeleteBusOwner/>} /> */}
  
  
  {/* <Route path='/' element={<CustomerButton/>} />
  <Route path='/customer/home' element={<CustomerHome/>} />
  <Route path='/customer/create' element={<CreateCustomer/>} />
  <Route path='/customer/details/:id' element={<ShowCustomer/>} />
  <Route path='/customer/edit/:id' element={<EditCustomer/>} />
  <Route path='/customer/delete/:id' element={<DeleteCustomer/>} /> */}
</Routes>

  )
}

export default App