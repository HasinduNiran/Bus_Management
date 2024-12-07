import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'


function ShowCustomer() {
  const [customer,setCustomer]=useState({});
  const [loading,setLoading]=useState(false);
  const{id}=useParams();

  useEffect(()=>{
    setLoading(true);
    axios
    .get(`http://localhost:8077/Customer/${id}`)
    .then((response)=>{
        setCustomer(response.data);
        
        setLoading(false);
    })
    .catch((error)=>{
        console.log(error);
        setLoading(false);
    });
},[])


  return (
    <div className='p-4'>
      <BackButton/>
      <h1 className='text-3xl my-4'>Show Book</h1>
      {loading ?(
            <Spinner/>
        ) :(
            <div className='flex flex-col border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Customer Id :</span>
                <span>{customer.cusID}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Firstname :</span>
                <span>{customer.firstName}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>LastName :</span>
                <span>{customer.lastName}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>NIC No :</span>
                <span>{customer.NIC}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Phone no :</span>
                <span>{customer.phone}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Email :</span>
                <span>{customer.email}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Create Time :</span>
                <span>{new Date(customer.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Last Update Time :</span>
                <span>{new Date(customer.updatedAt).toString()}</span>
              </div>
            </div>
        )}
    </div>
  )
}

export default ShowCustomer