import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  
  // Controle da Devolução e Confirmação de Exclusão
  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  useEffect(() => {
    async function carregarItem() {
      try {
        const response = await api.get(`/itens/${id}`);
        setItem(response.data);
      } catch (err) {
        setErro("Erro ao carregar detalhes do item.");
      } finally {
        setLoading(false);
      }
    }
    carregarItem();
  }, [id]);

  async function handleDevolver(e) {
    e.preventDefault();
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: devolvidoPara });
      alert("Item marcado como devolvido!");
      navigate("/");
    } catch (err) {
      setErro("Erro ao registrar devolução.");
    }
  }

  async function handleExcluir() {
    try {
      await api.delete(`/itens/${id}`);
      alert("Item excluído com sucesso!");
      navigate("/");
    } catch (err) {
      setErro("Erro ao excluir o item.");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!item) return <p>Item não encontrado.</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <Link to="/"><button>← Voltar</button></Link>
      <h2>{item.nome}</h2>
      <p><strong>Descrição:</strong> {item.descricao}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
      <p><strong>Local:</strong> {item.local}</p>
      <p><strong>Encontrado em:</strong> {item.data_encontrado}</p>
      <p><strong>Status:</strong> {item.status}</p>
      {item.status === "devolvido" && (
        <>
          <p><strong>Devolvido para:</strong> {item.devolvido_para}</p>
          <p><strong>Data da Devolução:</strong> {item.data_devolucao}</p>
        </>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Link to={`/editar/${item.id}`}><button>Editar</button></Link>
        <button onClick={() => setConfirmandoExclusao(true)} style={{ background: "red", color: "white" }}>Excluir</button>
      </div>

      {/* Modal / Bloco de Confirmação de Exclusão */}
      {confirmandoExclusao && (
        <div style={{ background: "#ffeeee", padding: "15px", marginTop: "15px", border: "1px solid red" }}>
          <p>Tem certeza que deseja excluir?</p>
          <button onClick={handleExcluir} style={{ marginRight: "10px" }}>Sim, Excluir</button>
          <button onClick={() => setConfirmandoExclusao(false)}>Cancelar</button>
        </div>
      )}

      {/* Marcar como Devolvido */}
      {item.status === "aguardando" && (
        <form onSubmit={handleDevolver} style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "15px" }}>
          <h3>Marcar como devolvido</h3>
          <input 
            type="text" 
            placeholder="Nome de quem recebeu" 
            value={devolvidoPara} 
            onChange={(e) => setDevolvidoPara(e.target.value)} 
            required 
          />
          <button type="submit" style={{ marginLeft: "10px" }}>Confirmar Devolução</button>
        </form>
      )}
    </div>
  );
}