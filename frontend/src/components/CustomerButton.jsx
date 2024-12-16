import React from 'react';
import { useNavigate } from 'react-router-dom';

function Button() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/customer/Home');
    };

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out" 
        onClick={goToHome}>
            Customer
        </button>
    );
}

export default Button;
