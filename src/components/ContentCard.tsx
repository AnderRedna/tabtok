import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { TabNewsPost } from '../types/tabnews';

interface ContentCardProps {
  post: TabNewsPost;
  onUpvote: (slug: string) => void;
  onClick: () => void;
}

export default function ContentCard({ post, onUpvote, onClick }: ContentCardProps) {
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    // Find the last space within the maxLength
    const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
    return `${text.substring(0, lastSpace)}...`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-4 mb-4 w-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-start mb-4">
        <img
          src={`https://ui-avatars.com/api/?name=${post.owner_username}&background=random`}
          alt={post.owner_username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <h3 className="font-semibold text-sm">@{post.owner_username}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-base font-bold mb-2 line-clamp-2 min-h-[2.5rem]">
        {post.title}
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        {truncateText(post.body, 120)}
      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(post.slug);
          }}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
        >
          <Heart size={16} />
          <span className="text-sm">{post.tabcoins}</span>
        </button>
        
        <button 
          className="flex items-center space-x-1 text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle size={16} />
          <span className="text-sm">{post.children_deep_count}</span>
        </button>

        <button 
          className="flex items-center space-x-1 text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}