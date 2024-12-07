import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import BackButton from '../../components/BackButton'
import { useNavigate } from 'react-router-dom'


function CreateCustomer() {
  const[cusID,setCusId]=useState('');
  const[image,setImage]=useState('');
  const[firstName,setFirstName]=useState('');
  const[lastName,setLastname]=useState('');
  const[NIC,setNic]=useState('');
  const[phone,setPhone]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleSaveCustomer=()=>{
    const data={
      cusID,
      image,
      firstName,
      lastName,
      NIC,
      phone,
      email,
      password,
    };
    setLoading(true);
    axios
    .post('http://localhost:8077/Customer',data)
    .then(()=>{
        setLoading(false);
        navigate('/');
    })
    .catch((error)=>{
      setLoading(false);
      alert('An error happened!')
      console.log(error);
  });
  };

  return (
    <div className='p-4'>
      <BackButton/>
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner/>:''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Customer Id:</label>
          <input
            type='text'
            value={cusID}
            onChange={(e)=>setCusId(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Image:</label>
          <input
            type='text'
            value={image}
            onChange={(e)=>setImage(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>First Name:</label>
          <input
            type='text'
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Last Name:</label>
          <input
            type='text'
            value={lastName}
            onChange={(e)=>setLastname(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>NIC No:</label>
          <input
            type='text'
            value={NIC}
            onChange={(e)=>setNic(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Phone No:</label>
          <input
            type='text'
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Email:</label>
          <input
            type='text'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Password:</label>
          <input
            type='text'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8 'onClick={handleSaveCustomer} >
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateCustomer