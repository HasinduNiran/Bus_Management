import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import BackButton from '../../components/BackButton'
import { useNavigate,useParams} from 'react-router-dom'


function EditBusOwner() {
  const[busOwnID,setBusOwnID]=useState('');
  const[image,setImage]=useState('');
  const[firstName,setFirstName]=useState('');
  const[lastName,setLastname]=useState('');
  const[NIC,setNic]=useState('');
  const[phone,setPhone]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const{id}=useParams();

  useEffect(()=>{
    setLoading(true);
    axios
    .get(`http://localhost:8077/BusOwner/${id}`)
    .then((response)=>{
      setBusOwnID(response.data.busOwnID);
      setImage(response.data.image);
      setFirstName(response.data.firstName);
      setLastname(response.data.lastName);
      setNic(response.data.NIC);
      setPhone(response.data.phone);
      setEmail(response.data.email);
      setPassword(response.data.password);
      setLoading(false);
    })
    .catch((error)=>{
        setLoading(false);
        
        alert('An error happened!');
        console.log(error);
    });
},[])
  const handleEditBusOwner=()=>{
    const data={
      busOwnID,
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
    .put(`http://localhost:8077/BusOwner/${id}`,data)
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
      <h1 className='text-3xl my-4'>Edit  BusOwner</h1>
      {loading ? <Spinner/>:''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>BusOwner Id:</label>
          <input
            type='text'
            value={busOwnID}
            onChange={(e)=>setBusOwnID(e.target.value)}
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
        <button className='p-2 bg-sky-300 m-8 'onClick={handleEditBusOwner} >
          Save
        </button>
      </div>
    </div>
  )
}

export default EditBusOwner