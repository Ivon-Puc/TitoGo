import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signupImage from "../assets/signup.jpeg"

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
        driverLicenseId: "",
        gender: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.repeatPassword) {
            toast.error("Passwords do not match");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success("User registered successfully!");
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    repeatPassword: "",
                    driverLicenseId: "",
                    gender: "",
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred during registration. Please try again.");
            console.error('Error during registration:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            repeatPassword: "",
            driverLicenseId: "",
            gender: ""
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Parent container with a defined height */}
            <div className="max-w-6xl w-full flex bg-white shadow-lg rounded-lg overflow-hidden min-h-[700px]">
                {/* Left Column - Signup Image */}
                <div
                    className="w-1/2 bg-[0px_100px] h-auto" // h-full to take full height of parent
                    style={{ backgroundImage: `url(${signupImage})` }}
                >
                    {/* You can add any additional content or overlay here */}
                </div>

                {/* Right Column - Signup Form */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <ToastContainer />
                    <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="repeatPassword">
                                Repeat Password
                            </label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="driverLicenseId">
                                Driver's License ID
                            </label>
                            <input
                                type="text"
                                id="driverLicenseId"
                                name="driverLicenseId"
                                value={formData.driverLicenseId}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-lg font-bold mb-3">Gender</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Male
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
