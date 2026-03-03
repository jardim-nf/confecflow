// src/context/ProducaoContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialData } from '../data';

// 1. Criamos o Contexto
export const ProducaoContext = createContext();

// 2. Criamos o Provider (Provedor) que vai englobar nossa aplicação
export const ProducaoProvider = ({ children }) => {
  // Inicializa o estado buscando do LocalStorage ou usando os dados iniciais
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem('@BrocouSystem:data');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados salvos:", error);
    }
    return initialData;
  });

  // Salva no LocalStorage toda vez que 'data' sofrer alguma alteração
  useEffect(() => {
    localStorage.setItem('@BrocouSystem:data', JSON.stringify(data));
  }, [data]);

  return (
    <ProducaoContext.Provider value={{ data, setData }}>
      {children}
    </ProducaoContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso nos componentes
export const useProducao = () => useContext(ProducaoContext);