import React,{useEffect,useState} from 'react'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { AiOutlineEdit} from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox,MdOutlineDelete } from 'react-icons/md'

function Home() {
    const [customer,setCustomer]=useState([]);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        setLoading(true);
        axios
        .get('http://localhost:8077/Customer')
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
        <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>Customer List</h1>
            <Link to='/customer/create'>
                <MdOutlineAddBox className='text-sky-800 text-4xl'/>
            </Link>
        </div>
        {loading ?(
            <Spinner/>
        ) :(
            <table className='w-full border-separate border-spacing-2'>
                <thead>
                    <tr>
                        <th className='border border-slate-600 rounded-md'>No</th>
                        <th className='border border-slate-600 rounded-md'>CustomerId</th>
                        <th className='border border-slate-600 rounded-md'>firstName</th>
                        <th className='border border-slate-600 rounded-md'>lastName</th>
                        <th className='border border-slate-600 rounded-md'>Nic</th>
                        <th className='border border-slate-600 rounded-md'>Phone</th>
                        <th className='border border-slate-600 rounded-md'>Email</th>
                        <th className='border border-slate-600 rounded-md'>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {customer.map((customer,index)=>(
                        <tr key={customer._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {index + 1}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.cusID}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.firstName}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.lastName}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.NIC}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.phone}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {customer.email}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <Link to={`/customer/details/${customer._id}`}>
                                        <BsInfoCircle className='text-2xl text-green-800'/>
                                    </Link>
                                    <Link to={`/customer/edit/${customer._id}`}>
                                        <AiOutlineEdit className='text-2xl text-yellow-800'/>
                                    </Link>
                                    <Link to={`/customer/delete/${customer._id}`}>
                                        <MdOutlineDelete className='text-2xl text-red-800'/>
                                    </Link>
                                </div>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  )
}

export default Home