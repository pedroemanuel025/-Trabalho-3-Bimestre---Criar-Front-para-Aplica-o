import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [aluno, setAluno] = useState(null);
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");


  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setLoading(true);
        const [resEu, resCat, resLoc] = await Promise.all([
          api.get("/eu"),
          api.get("/categorias"),
          api.get("/locais")
        ]);
        setAluno(resEu.data);
        setCategorias(resCat.data);
        setLocais(resLoc.data);
      } catch (err) {
        setErro("Não foi possível carregar. Verifique sua chave.");
      } finally {
        setLoading(false);
      }
    }
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    async function buscarItens() {
      try {
        setLoading(true);
        const params = {};
        if (busca) params.busca = busca;
        if (status) params.status = status;
        if (categoria) params.categoria = categoria;
        if (local) params.local = local;

        const response = await api.get("/itens", { params });
        setItens(response.data);
      } catch (err) {
        setErro("Erro ao buscar itens.");
      } finally {
        setLoading(false);
      }
    }
    buscarItens();
  }, [busca, status, categoria, local]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Sistema Achados e Perdidos</h1>
        {aluno && <p>Olá, <strong>{aluno.nome}</strong></p>}
      </header>

      <hr />

      <div style={{ margin: "20px 0" }}>
        <Link to="/novo"><button>+ Novo Item</button></Link>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input 
          type="text" 
          placeholder="Buscar por nome ou descrição..." 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
        
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas as Categorias</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Todos os Locais</option>
          {locais.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {loading && <p>Carregando itens...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!loading && !erro && itens.length === 0 && (
        <p>Nenhum item encontrado.</p>
      )}


      <div style={{ display: "grid", gap: "10px" }}>
        {itens.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
            <h3>{item.nome}</h3>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Categoria:</strong> {item.categoria} | <strong>Local:</strong> {item.local}</p>
            <Link to={`/item/${item.id}`}><button>Ver Detalhes</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}   