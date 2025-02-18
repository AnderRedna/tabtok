import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Twitter } from 'lucide-react';
import { TabNewsPost } from '../types/tabnews';
import { useQuery } from 'react-query';
import { fetchPostContent } from '../services/api';
import toast from 'react-hot-toast';

interface ContentCardProps {
  post: TabNewsPost;
  onUpvote: (slug: string) => void;
  onClick: () => void;
  className?: string;
}

export default function ContentCard({ post, onUpvote, onClick, className }: ContentCardProps) {
  const { data: fullPost } = useQuery(
    ['post', post.owner_username, post.slug],
    () => fetchPostContent(post.owner_username, post.slug),
    { staleTime: 1000 * 60 * 5 } // Cache por 5 minutos
  );

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.tabnews.com.br/${post.owner_username}/${post.slug}`;
    const text = `Confira este post interessante no TabNews:\n"${post.title}"\n\n${url}`;
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado! 📋✨', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '0.875rem',
        },
        icon: '🔗',
      });
    } catch (err) {
      toast.error('Ops! Não foi possível copiar o link 😅');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 w-full cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start mb-4">
        <img
          src={`https://ui-avatars.com/api/?name=${post.owner_username}&background=random`}
          alt={post.owner_username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <h3 className="font-semibold text-sm dark:text-white">@{post.owner_username}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-base font-bold mb-1 line-clamp-2 dark:text-white">
        {post.title}
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {fullPost?.body || post.body}
      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(post.slug);
          }}
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
        >
          <Heart size={16} />
          <span className="text-sm">{post.tabcoins}</span>
        </button>
        
        <button 
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle size={16} />
          <span className="text-sm">{post.children_deep_count}</span>
        </button>

        <button 
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={handleShare}
        >
          <Share2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}