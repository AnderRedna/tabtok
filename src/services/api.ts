const API_BASE_URL = 'https://www.tabnews.com.br/api/v1';

export const fetchPosts = async (page = 1, strategy = 'relevant') => {
  const response = await fetch(`${API_BASE_URL}/contents?page=${page}&per_page=10&strategy=${strategy}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const fetchPostContent = async (username: string, slug: string) => {
  const response = await fetch(`${API_BASE_URL}/contents/${username}/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch post content');
  return response.json();
};

export const fetchUser = async (username: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${username}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const fetchComments = async (username: string, slug: string) => {
  const response = await fetch(`${API_BASE_URL}/contents/${username}/${slug}/children`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};

export const upvotePost = async (slug: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/contents/${slug}/tabcoins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ transaction_type: 'credit' })
  });
  if (!response.ok) throw new Error('Failed to upvote');
  return response.json();
};