/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface UserData {
  nome: string;
  matricula: string;
  setor: string;
  refeitorio: string;
}

interface Step3Props {
  onPrev: () => void;
  onNext: () => void;
  onUserData: (data: UserData) => void;
}

function formatarNome(nome: string) {
  return nome
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

export default function Step3({ onPrev, onNext, onUserData }: Step3Props) {
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState("");
  const [refeitorio, setRefeitorio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSearch = async () => {
    setError("");

    if (!matricula.trim()) {
      setError("Por favor, digite sua matrícula.");
      return;
    }

    if (!refeitorio.trim()) {
      setError("Por favor, selecione um refeitório.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("collaborators")
        .select("nome, setor")
        .eq("matricula", matricula)
        .limit(1)
        .single();

      setLoading(false);

      if (fetchError || !data) {
        setError("Matrícula não encontrada, verifique e tente novamente.");
        return;
      }

      const nomeFormatado = formatarNome(data.nome || "");
      const setorFromDb = data.setor || "";

      const result: UserData = {
        nome: nomeFormatado,
        matricula,
        setor: setorFromDb || setor,
        refeitorio,
      };

      setUserData(result);
      onUserData(result);
    } catch (err: any) {
      setLoading(false);
      setError("Erro ao buscar dados. Tente novamente mais tarde.");
      console.error(err);
    }
  };

  const handleClear = () => {
    setMatricula('');
    setSetor('');
    setRefeitorio('');
    setError('');
    setUserData(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ backgroundImage: 'url(/folha.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100%', margin: '0', padding: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <>
          <div className="card-header">
            <h1 className="card-title">Identificação</h1>
            <p className="card-subtitle">Preencha seus dados de trabalho</p>
          </div>

          {error && <div className="error-message active">{error}</div>}

          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              type="text"
              id="matricula"
              placeholder="Digite sua matrícula (ex: 12345)"
              maxLength={10}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="setorInput">Setor</label>
            <input
              type="text"
              id="setorInput"
              placeholder="Digite seu setor (ex: Administrativo, RH, TI...)"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="refeitorioInput">Refeitório</label>
            <select
              id="refeitorioInput"
              className="form-input"
              value={refeitorio}
              onChange={(e) => setRefeitorio(e.target.value)}
            >
              <option value="">Selecione o refeitório que frequenta</option>
              <option value="R1">R1</option>
              <option value="R2">R2</option>
              <option value="R3">R3</option>
              <option value="R5">R5</option>
            </select>
          </div>

          {loading && (
            <div className="loading active">
              <div className="spinner"></div>
              <p>Buscando seus dados...</p>
            </div>
          )}

          {userData && (
            <div className="user-info">
              <h3>Dados Encontrados</h3>
              <p>
                <strong>Nome:</strong> {userData.nome}
              </p>
              <p>
                <strong>Matrícula:</strong> {userData.matricula}
              </p>
              <p>
                <strong>Setor:</strong> {userData.setor}
              </p>
              <p>
                <strong>Refeitório:</strong> {userData.refeitorio}
              </p>
            </div>
          )}

          <div className="button-group">
            <button className="btn-secondary" onClick={onPrev}>
              ← Voltar
            </button>
            {userData && (
              <button className="btn-secondary" onClick={handleClear}>
                🔄 Limpar
              </button>
            )}
            {!userData && (
              <button className="btn-primary" onClick={handleSearch}>
                Buscar
              </button>
            )}
            {userData && (
              <button className="btn-primary" onClick={onNext}>
                Continuar →
              </button>
            )}
          </div>
        </>
      </div>
    </div>

  );
}
