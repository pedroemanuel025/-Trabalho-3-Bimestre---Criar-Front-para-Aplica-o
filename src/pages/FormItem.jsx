import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function FormItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = Boolean(id);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarListasESeEdicao() {
      try {
        const [resCat, resLoc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais")
        ]);
        setCategorias(resCat.data);
        setLocais(resLoc.data);

        if (isEdicao) {
          const resItem = await api.get(`/itens/${id}`);
          setNome(resItem.data.nome);
          setDescricao(resItem.data.descricao);
          setCategoria(resItem.data.categoria);
          setLocal(resItem.data.local);
          setDataEncontrado(resItem.data.data_encontrado);
        }
      } catch (err) {
        setErro("Erro ao carregar dados do formulário.");
      }
    }
    carregarListasESeEdicao();
  }, [id, isEdicao]);

  async function handleSubmit(e) {
    e.preventDefault();
    const corpo = {
      nome,
      descricao,
      categoria,
      local,
      data_encontrado: dataEncontrado
    };

    try {
      if (isEdicao) {
        await api.put(`/itens/${id}`, corpo);
        alert("Item atualizado com sucesso!");
      } else {
        await api.post("/itens", corpo);
        alert("Item cadastrado com sucesso!");
      }
      navigate("/");
    } catch (err) {

      const msgErro = err.response?.data?.detail || "Erro ao salvar item.";
      setErro(typeof msgErro === "string" ? msgErro : JSON.stringify(msgErro));
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <Link to="/"><button>← Voltar</button></Link>
      <h2>{isEdicao ? "Editar Item" : "Novo Item"}</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input 
          type="text" 
          placeholder="Nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
        
        <textarea 
          placeholder="Descrição" 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
          required 
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
          <option value="">Selecione a Categoria</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)} required>
          <option value="">Selecione o Local</option>
          {locais.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>

        <input 
          type="date" 
          value={dataEncontrado} 
          onChange={(e) => setDataEncontrado(e.target.value)} 
          required 
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}