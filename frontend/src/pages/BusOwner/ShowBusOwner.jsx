import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'


function ShowBusOwner() {
  const [busowner,setBusOwner]=useState({});
  const [loading,setLoading]=useState(false);
  const{id}=useParams();

  useEffect(()=>{
    setLoading(true);
    axios
    .get(`http://localhost:8077/BusOwner/${id}`)
    .then((response)=>{
        setBusOwner(response.data);
        
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
      <h1 className='text-3xl my-4'>Show Bus Owners</h1>
      {loading ?(
            <Spinner/>
        ) :(
            <div className='flex flex-col border-sky-400 rounded-xl w-fit p-4'>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>BusOwner Id :</span>
                <span>{busowner.busOwnID}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Firstname :</span>
                <span>{busowner.firstName}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>LastName :</span>
                <span>{busowner.lastName}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>NIC No :</span>
                <span>{busowner.NIC}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Phone no :</span>
                <span>{busowner.phone}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Email :</span>
                <span>{busowner.email}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Create Time :</span>
                <span>{new Date(busowner.createdAt).toString()}</span>
              </div>
              <div className='my-4'>
                <span classname='text-xl' mr-4 text-gray-500>Last Update Time :</span>
                <span>{new Date(busowner.updatedAt).toString()}</span>
              </div>
            </div>
        )}
    </div>
  )
}

export default ShowBusOwner