import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Customer/Home';
import CreateCustomer from './pages/Customer/CreateCustomer';
import DeleteCustomer from './pages/Customer/DeleteCustomer';
import EditCustomer from './pages/Customer/EditCustomer';
import ShowCustomer from './pages/Customer/ShowCustomer';



function App() {
  return (
<Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/customer/create' element={<CreateCustomer/>} />
  <Route path='/customer/details/:id' element={<ShowCustomer/>} />
  <Route path='/customer/edit/:id' element={<EditCustomer/>} />
  <Route path='/customer/delete/:id' element={<DeleteCustomer/>} />
</Routes>

  )
}

export default App