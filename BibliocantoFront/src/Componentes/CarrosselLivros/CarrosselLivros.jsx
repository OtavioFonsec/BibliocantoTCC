import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './CarrosselLivros.css';

const CarrosselLivros = ({ livros }) => {

  const navigate = useNavigate();

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [historico, setHistorico] = useState([]);
  const timeoutRef = useRef(null);

  const trocarAleatorio = () => {
    if (livros.length <= 1) return;

    const indicesDisponiveis = livros
      .map((_, i) => i)
      .filter(i => i !== indiceAtual);

    const aleatorio = indicesDisponiveis[Math.floor(Math.random() * indicesDisponiveis.length)];
    setHistorico(prev => [...prev, indiceAtual]);
    setIndiceAtual(aleatorio);
  };

  const avancar = () => trocarAleatorio();

  const voltar = () => {
    if (historico.length === 0) return;
    const novoHistorico = [...historico];
    const ultimo = novoHistorico.pop();
    setHistorico(novoHistorico);
    setIndiceAtual(ultimo);
  };

  useEffect(() => {
    if (!livros.length) return;

    timeoutRef.current = setTimeout(() => {
      trocarAleatorio();
    }, 10000);

    return () => clearTimeout(timeoutRef.current);
  }, [indiceAtual, livros]);

  if (!livros.length || !livros[indiceAtual]) {
    return <div>Carregando livro...</div>;
  }

  const livro = livros[indiceAtual];

  return (
    <div className="carrossel-container">
      <button className="carrossel-seta esquerda" onClick={voltar}>❮</button>

      <img className="carrossel-imagem" 
      src={livro.caminhoImagem} 
      alt={livro.titulo}
      onClick={() => navigate(`/Livro/${livro.id}`)}
       />
      <div className="carrossel-info">
        <h2 className="carrossel-titulo-livro">{livro.titulo}</h2>
        <p className="carrossel-descricao-livro">{livro.descricao}</p>
      </div>

      <button className="carrossel-seta direita" onClick={avancar}>❯</button>
    </div>
  );
};

export default CarrosselLivros;