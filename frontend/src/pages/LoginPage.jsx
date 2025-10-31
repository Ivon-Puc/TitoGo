import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signinImage from "../assets/signin.jpeg"

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                toast.success("Login realizado com sucesso!");
                window.location.href = "/share"; // Redirect to the share page
            } else {
                toast.error(data.message || "Falha no login!");
            }
            } catch (error) {
            console.error("Login failed:", error);
            toast.error("Algo deu errado. Por favor, tente novamente.");
        }
    };    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full flex bg-white shadow-lg rounded-lg overflow-hidden h-[700px]">
                {/* Left Column - Signin Image */}
                <div
                    className="w-1/2 bg-cover bg-center h-full"
                    style={{ backgroundImage: `url(${signinImage})` }} // Use the imported image
                > 
                    {/* You can add any additional content or overlay here */}
                </div>

                {/* Right Column - Login Form */}
                <div className="w-1/2 p-12 flex flex-col justify-center">
                    <ToastContainer />
                    <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;