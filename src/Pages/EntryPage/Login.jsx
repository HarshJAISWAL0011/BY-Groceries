import React, { useState,useEffect  } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { signin } from 'FirebaseAuth/Auth.mjs';

export default function Login() {
    let navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get("userToken");
        if (token) {
          navigate('/home');
        }
      }, []);
      
  return (
      <div>
          <div className="bg-yellow-50 h-screen w-screen flex justify-around">
          <div className='flex-col flex-wrap'>
            <img src="/static/food.png"
             alt="food" className='w-3xl mt-12 ms-12  aspect-3/4  ' />
            <h1 className='text-black text-5xl text-center mt-14 font-title text-opacity-90'>Order at ease <br/> Pick with peace</h1>
          </div>

          <div className='  flex justify-center items-center  '>
            <LoginTabs/>
          </div>
          </div>
      </div>
  );
}


 function LoginTabs() {
    const [activeTab, setActiveTab] = useState("customer");

    return (
        <div className="pr-11 pt-11 pb-11 pl-5 bg-white rounded-3xl items-center">
            <div className="ml-14 mr-14 mb-10 " >
               
            <div className="w-full min-w-80 flex justify-between  mb-9 mt-5">
            <button
                    className={`${
                        activeTab === "customer"
                            ? "border-b-2 border-yellow-500 text-yellow-500 font-semibold"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("customer")}
                >
                    Customer Login
                </button>

                <button
                    className={` ${
                        activeTab === "vendor"
                            ? "border-b-2 border-yellow-500 text-yellow-500 font-semibold"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("vendor")}
                >
                    Vendor Login
                </button>
             
            </div>


                
                <div className="mt-6">
                    {activeTab === "vendor" ? (
                        <VendorLogin />
                    ) : (
                        <CustomerLogin />
                    )}
                </div>
            </div>
        </div>
    );
}

function VendorLogin() {
    const navigate = useNavigate();

    return (
        <form className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Vendor Login</h2>
            <div>
                <label className="block text-sm text-gray-600 pb-1">Email</label>
                <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600 pb-1">Password</label>
                <input
                    type="password"
                    className="w-full px-4 mb-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your password"
                />
            </div>
            <button
                type="submit"
                className="w-full font-semibold bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                onClick={()=>{navigate('/home')}}
            >
                Login
            </button>
        </form>
    );
}

function CustomerLogin() {
    const navigate = useNavigate();
     const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

    return (
        <div className='flex-col justify-center items-center'>
        <form className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Customer Login</h2>
            <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 mb-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your password"
                />
            </div>
            <button
                type="submit"
                className=" w-full font-semibold bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                onClick={async(e)=>{  
                    e.preventDefault()
                    let response= await signin(email,password)
                    console.log(response,response.uid)
                    if(response){
                      Cookies.set("userToken", JSON.stringify(response), { expires: 7 });
                     navigate('/home')
                    }
                }}
                >
                Login
            </button>
        </form>
        <h1 className=' mt-3 text-center'>Didn't have an account? <button className='text-blue-500 mx-auto' onClick={()=>{navigate("/signup")}}>Sign up</button></h1>
        </div>
    );
}

