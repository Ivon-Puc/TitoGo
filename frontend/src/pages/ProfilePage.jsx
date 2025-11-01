// frontend/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast'; // Usamos o toast para mensagens de erro/sucesso

// Define a estrutura de dados esperada para o perfil
const initialProfileState = {
    firstName: '',
    lastName: '',
    email: '',
    driverLicense: '',
    gender: 'OTHER', // Deve ser MALE, FEMALE, ou OTHER
    senacId: '',
    statusVerificacao: '', // PENDENTE, APROVADO, REPROVADO
    role: '', // USER ou ADMIN
};

const ProfilePage = () => {
    // 1. Estados
    const [profile, setProfile] = useState(initialProfileState);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 2. Função para carregar os dados do perfil (GET /api/profile)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Chama a rota protegida
                const response = await api.get('/api/profile'); 
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                // Se for um erro de autenticação, redireciona para o login
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    toast.error("Sessão expirada. Faça login novamente.");
                } else {
                    toast.error('Erro ao carregar o perfil: ' + (err.response?.data?.message || err.message));
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    // Lida com a mudança de campos (usaremos isto para o PUT na próxima etapa)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    // 3. Renderização
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-indigo-600 font-bold">Carregando perfil...</div>;
    }

    // Estilo de acordo com o status de verificação
    const statusColor = profile.statusVerificacao === 'APROVADO' 
                        ? 'text-green-600' 
                        : profile.statusVerificacao === 'REPROVADO' 
                        ? 'text-red-600' 
                        : 'text-yellow-600';
    
    const roleColor = profile.role === 'ADMIN' ? 'text-indigo-600' : 'text-gray-500';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Meu Perfil
                    </h2>
                    
                    {/* Placeholder para a Foto de Perfil / Avatar (usando as iniciais) */}
                    <div className="mt-4 w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-800 border-4 border-indigo-600">
                        {profile.firstName[0]}{profile.lastName[0]}
                    </div>

                    {/* Exibe o status e cargo */}
                    <p className={`mt-2 text-sm font-medium ${statusColor}`}>
                        Status: {profile.statusVerificacao} 
                    </p>
                    <p className={`mt-1 text-xs font-medium ${roleColor}`}>
                        Cargo: {profile.role}
                    </p>
                </div>

                {/* Formulário de Perfil (Ainda apenas para exibição) */}
                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Nome */}
                        <InputField label="Primeiro Nome" id="firstName" name="firstName" type="text" value={profile.firstName} onChange={handleInputChange} required />

                        {/* Sobrenome */}
                        <InputField label="Sobrenome" id="lastName" name="lastName" type="text" value={profile.lastName} onChange={handleInputChange} required />

                        {/* Email (Apenas leitura) */}
                        <ReadOnlyField label="E-mail" id="email" value={profile.email} />

                        {/* ID Senac (Apenas leitura) */}
                        <ReadOnlyField label="ID Senac (E-mail Institucional)" id="senacId" value={profile.senacId} />

                        {/* CNH */}
                        <InputField label="CNH (Identidade do Motorista)" id="driverLicense" name="driverLicense" type="text" value={profile.driverLicense || ''} onChange={handleInputChange} />

                        {/* Gênero */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                Gênero
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={profile.gender}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="MALE">Masculino</option>
                                <option value="FEMALE">Feminino</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>
                    </div>

                    {/* Botão de Salvar (Ainda não funcional) */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 opacity-50 cursor-not-allowed"
                            disabled // Desativado até implementarmos a rota PUT
                        >
                            Salvar Alterações (Aguardando Rota PUT)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente auxiliar para campos de entrada editáveis
const InputField = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...props}
        />
    </div>
);

// Componente auxiliar para campos de entrada apenas de leitura
const ReadOnlyField = ({ label, id, value }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            type="text"
            value={value}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
        />
    </div>
);

export default ProfilePage;