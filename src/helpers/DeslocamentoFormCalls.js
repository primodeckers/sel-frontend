import api from '../services/api';

export const fetchPessoas = async (setData) => {
  const result = await api.get("/pessoas");
  setData(result.data);
}

