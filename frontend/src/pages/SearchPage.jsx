import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";

// 1. [MUDANÇA] Importamos o nosso serviço 'api'
import api from "../services/api"; 

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

function SearchPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Autosuggestion states
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // --- [NOVO] Estilos CSS-in-JS (Padrão das nossas páginas) ---
  const styles = {
    // O 'card' para o formulário
    formContainer: {
      padding: '20px',
      margin: '0 auto', // Centraliza na coluna
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff' // Fundo branco
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      position: 'relative' // Para a lista de sugestões
    },
    input: {
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc'
    },
    button: {
      padding: '12px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '1.5rem', // 24px
      fontWeight: 'bold',
      marginBottom: '1rem' // 16px
    },
    subtitle: {
      fontSize: '1.25rem', // 20px
      fontWeight: 'bold',
      marginTop: '1.5rem', // 24px
      marginBottom: '1rem'
    },
    // Estilos para a lista de resultados
    resultsContainer: {
      marginTop: '1.5rem'
    },
    resultItem: {
      border: '1px solid #eee',
      padding: '12px',
      marginBottom: '10px',
      borderRadius: '4px'
    },
    resultButton: {
      marginTop: '10px',
      padding: '8px 12px',
      backgroundColor: '#28a745', // Verde
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    // Estilos para as sugestões (autocomplete)
    suggestionList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxHeight: '200px',
      overflowY: 'auto',
      borderRadius: '0 0 4px 4px',
      zIndex: 10
    },
    suggestionItem: {
      padding: '10px',
      cursor: 'pointer'
    }
  };
  // --- Fim dos Estilos ---

  // ... (Toda a lógica de 'debounce' e 'fetchSuggestions' permanece igual) ...
  // Debounce for origin
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(formData.from);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.from]);

  // Debounce for destination
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(formData.to);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.to]);

  // Fetch suggestions
  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === "origin") setOriginSuggestions([]);
      if (type === "destination") setDestinationSuggestions([]);
      return;
    }

    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (type === "origin") {
        setOriginSuggestions(data);
      } else if (type === "destination") {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  // Fetch origin suggestions whenever debouncedOrigin changes
  useEffect(() => {
    fetchSuggestions(debouncedOrigin, "origin");
  }, [debouncedOrigin]);

  // Fetch destination suggestions whenever debouncedDestination changes
  useEffect(() => {
    fetchSuggestions(debouncedDestination, "destination");
  }, [debouncedDestination]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async () => {
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      // 2. [MUDANÇA CRÍTICA] Trocado 'fetch' por 'api.get'
      // O 'api.js' já sabe a URL do Render e já adiciona o token!
      const response = await api.get(
        `/search-rides?from=${formData.from}&to=${formData.to}&date=${formData.date}`
      );
      
      const data = response.data; // No axios, os dados vêm em 'response.data'

      // No axios, 'response.ok' não existe, verificamos pelo 'status' (mas o axios falha em erros)
      setSearchResults(data);
      setSearchTriggered(true);
      if (data.length === 0) {
        toast.info("Nenhuma carona encontrada para esta busca.");
      }

    } catch (error) {
      console.error("Erro:", error);
      // O axios coloca o erro em 'error.response'
      const errorMsg = error.response?.data?.message || "Ocorreu um erro ao buscar caronas";
      toast.error(errorMsg);
    }
  };

  const handleRequestRide = async (rideId) => {
    try {
      // 3. [MUDANÇA CRÍTICA] Trocado 'fetch' por 'api.post'
      // O 'api.js' trata do 'Content-Type' e do 'Authorization'
      const response = await api.post("/request-ride", {
        shareId: rideId,
        message: "Solicitando esta carona",
      });

      const data = response.data; // Dados vêm em 'response.data'
      toast.success(data.message || "Solicitação de carona enviada com sucesso");

    } catch (error) {
      console.error("Erro:", error);
      const errorMsg = error.response?.data?.message || "Erro ao enviar solicitação de carona";
      toast.error(errorMsg);
    }
  };

  // ... (A lógica de 'handleSuggestionClick' permanece igual) ...
  const handleSuggestionClick = async (suggestion, type) => {
    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", suggestion.display_name);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (type === "origin") {
          setFormData({ ...formData, from: suggestion.display_name });
          setOriginCoordinates([parseFloat(lat), parseFloat(lon)]);
          setOriginSuggestions([]);
        } else if (type === "destination") {
          setFormData({ ...formData, to: suggestion.display_name });
          setDestinationCoordinates([parseFloat(lat), parseFloat(lon)]);
          setDestinationSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
    }
  };


  // 4. [MUDANÇA NO LAYOUT] Aplicamos estilos e classes responsivas
  return (
    // O 'flex-col' empilha em mobile, 'md:flex-row' vira linha em desktop
    <div className="flex flex-col md:flex-row p-4 gap-4"> 
      <ToastContainer />

      {/* Coluna da Esquerda (Formulário) */}
      {/* Ocupa 100% em mobile (w-full), 1/3 em desktop (md:w-1/3) */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        {/* O 'card' que pediste */}
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Pesquisar caronas</h2>
          
          {/* Formulário agora usa os estilos */}
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="from">De</label>
              <input
                id="from"
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                style={styles.input}
                placeholder="Digite o local de origem"
              />
              {originSuggestions.length > 0 && (
                <ul style={styles.suggestionList}>
                  {originSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      style={styles.suggestionItem}
                      className="hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion, "origin")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="to">Para</label>
              <input
                id="to"
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                style={styles.input}
                placeholder="Digite o destino"
              />
              {destinationSuggestions.length > 0 && (
                 <ul style={styles.suggestionList}>
                  {destinationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      style={styles.suggestionItem}
                      className="hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion, "destination")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="date">Data</label>
              <input
                id="date"
                type="date" // Mudei para 'date' (data), o seu 'handleSearch' usa 'date'
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            style={{ ...styles.button, width: '100%', marginTop: '15px' }} // Botão com largura total
          >
            Buscar
          </button>
          
          {/* Resultados da Busca */}
          <div style={styles.resultsContainer}>
            <h3 style={styles.subtitle}>Resultados</h3>
            {searchResults.length > 0 ? (
              searchResults.map((ride, index) => (
                <div key={index} style={styles.resultItem}>
                  <p><strong>Origem:</strong> {ride.origin}</p>
                  <p><strong>Destino:</strong> {ride.destination}</p>
                  <p><strong>Data:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                  <p><strong>Vagas:</strong> {ride.spots}</p>
                  <p><strong>Motorista:</strong> {ride.driver.firstName} {ride.driver.lastName}</p>
                  <button
                    onClick={() => handleRequestRide(ride.id)}
                    style={styles.resultButton}
                    className="hover:bg-green-600"
                  >
                    Solicitar carona
                  </button>
                </div>
              ))
            ) : (
              // Mostra esta mensagem APENAS se a busca foi feita (searchTriggered)
              searchTriggered && <p>Nenhuma carona encontrada</p>
            )}
          </div>
        </div>
      </div>

      {/* Coluna da Direita (Mapa) */}
      {/* h-[60vh] (60% da altura da tela) em mobile, h-auto em desktop */}
      <div className="w-full md:flex-1 h-[60vh] md:h-auto rounded-lg overflow-hidden shadow-lg">
        <Maps
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered}
        />
      </div>
    </div>
  );
}

export default SearchPage;