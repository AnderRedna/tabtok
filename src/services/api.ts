import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.tabnews.com.br/api/v1',
});

// Adicionar interceptor para retry
api.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  
  // Não retry se for erro 429 (too many requests)
  if (response?.status === 429) {
    throw error;
  }
  
  // Limite de 3 tentativas
  if (!config || !config.retry || config.retry >= 3) {
    throw error;
  }
  
  // Incrementa contador de retry
  config.retry = config.retry ? config.retry + 1 : 1;
  
  // Delay exponencial entre tentativas
  const delay = Math.min(1000 * (2 ** config.retry), 10000);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return api(config);
});

export const fetchPosts = async (page = 1, strategy = 'relevant') => {
  const { data } = await api.get(`/contents?page=${page}&strategy=${strategy}&per_page=10`);
  return data;
};

export const fetchPostContent = async (username: string, slug: string) => {
  const { data } = await api.get(`/contents/${username}/${slug}`);
  return data;
};

export const fetchUser = async (username: string) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

export const fetchComments = async (username: string, slug: string) => {
  const { data } = await api.get(`/contents/${username}/${slug}/children`);
  return data;
};

export const upvotePost = async (slug: string, token: string) => {
  const { data } = await api.post(`/contents/${slug}/tabcoins`, {
    transaction_type: 'credit'
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data;
};

export default api;