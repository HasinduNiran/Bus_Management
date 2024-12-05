import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home';
import CreateCustomer from './pages/CreateCustomer';
import DeleteCustomer from './pages/DeleteCustomer';
import EditCustomer from './pages/EditCustomer';
import ShowCustomer from './pages/ShowCustomer';



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