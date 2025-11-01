import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";
import api from "../services/api"; 

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

function SearchPage() {
  // ... (Estados 'formData', 'searchResults', 'coordinates', etc. permanecem iguais) ...
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // --- Os Estilos (styles) permanecem exatamente os mesmos ---
  const styles = {
    formContainer: {
      padding: '20px',
      margin: '0 auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff'
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
      position: 'relative'
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
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginTop: '1.5rem',
      marginBottom: '1rem'
    },
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
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
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
      cursor: 'pointer',
      fontSize: '0.9rem' // [BÓNUS] Fonte ligeiramente menor para caber
    }
  };
  // --- Fim dos Estilos ---

  // 1. [NOVO] Função "ajudante" para formatar o endereço
  const formatSuggestion = (address) => {
    if (!address) return "Localização inválida";

    // Cria uma lista de partes do endereço que queremos
    const parts = [
      address.road,         // Rua (ex: Av. Giovanni Gronchi)
      address.suburb,       // Bairro (ex: Vila Andrade)
      address.city,         // Cidade (ex: São Paulo)
      address.postcode,     // CEP
      address.country       // País (como último recurso)
    ];

    // Filtra (remove) as partes que são nulas (undefined)
    // e junta (join) o resto com uma vírgula.
    // O 'new Set()' remove duplicados (ex: se "city" e "suburb" forem iguais)
    const uniqueParts = [...new Set(parts.filter(part => part))];
    
    // Se tivermos rua e bairro, já é suficiente
    if(address.road && address.suburb) {
      return `${address.road}, ${address.suburb}, ${address.city || ''}`;
    }
    
    // Senão, devolve os primeiros 3 itens que encontrar (ex: Bairro, Cidade, CEP)
    return uniqueParts.slice(0, 3).join(', ');
  };


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
    url.searchParams.set("addressdetails", "1"); // <-- A chave está aqui

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


  // ... (A lógica de 'handleChange', 'handleSearch' e 'handleRequestRide' permanece igual) ...
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
      const response = await api.get(
        `/search-rides?from=${formData.from}&to=${formData.to}&date=${formData.date}`
      );
      
      const data = response.data;
      setSearchResults(data);
      setSearchTriggered(true);
      if (data.length === 0) {
        toast.info("Nenhuma carona encontrada para esta busca.");
      }

    } catch (error) {
      console.error("Erro:", error);
      const errorMsg = error.response?.data?.message || "Ocorreu um erro ao buscar caronas";
      toast.error(errorMsg);
    }
  };

  const handleRequestRide = async (rideId) => {
    try {
      const response = await api.post("/request-ride", {
        shareId: rideId,
        message: "Solicitando esta carona",
      });

      const data = response.data;
      toast.success(data.message || "Solicitação de carona enviada com sucesso");

    } catch (error) {
      console.error("Erro:", error);
      const errorMsg = error.response?.data?.message || "Erro ao enviar solicitação de carona";
      toast.error(errorMsg);
    }
  };

  const handleSuggestionClick = async (suggestion, type) => {
    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", suggestion.display_name); // Mantemos o display_name para precisão
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (type === "origin") {
          // [IMPORTANTE] Guardamos o 'display_name' completo no formulário
          // mas mostramos o nome curto na lista
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


  // 5. [MUDANÇA NO LAYOUT] Aplicamos estilos e classes responsivas
  return (
    <div className="flex flex-col md:flex-row p-4 gap-4"> 
      <ToastContainer />

      {/* Coluna da Esquerda (Formulário) */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Pesquisar caronas</h2>
          
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
                    // 2. [MUDANÇA] Usamos o formatSuggestion aqui
                    <li
                      key={suggestion.place_id}
                      style={styles.suggestionItem}
                      className="hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion, "origin")}
                    >
                      {formatSuggestion(suggestion.address)}
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
                    // 3. [MUDANÇA] E usamos o formatSuggestion aqui
                    <li
                      key={suggestion.place_id}
                      style={styles.suggestionItem}
                      className="hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion, "destination")}
                    >
                      {formatSuggestion(suggestion.address)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="date">Data</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            style={{ ...styles.button, width: '100%', marginTop: '15px' }}
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
              searchTriggered && <p>Nenhuma carona encontrada</p>
            )}
          </div>
        </div>
      </div>

      {/* Coluna da Direita (Mapa) */}
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