import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { TabNewsPost } from '../types/tabnews';
import { useQuery } from 'react-query';
import { fetchComments, fetchPostContent } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface PostViewProps {
  post: TabNewsPost;
  onClose: () => void;
}

export default function PostView({ post, onClose }: PostViewProps) {
  const { data: fullPost, isLoading: isLoadingPost } = useQuery(
    ['post', post.owner_username, post.slug],
    () => fetchPostContent(post.owner_username, post.slug)
  );

  const { data: comments, isLoading: isLoadingComments } = useQuery(
    ['comments', post.owner_username, post.slug],
    () => fetchComments(post.owner_username, post.slug)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-2xl w-full h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${post.owner_username}&background=random`}
                alt={post.owner_username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">@{post.owner_username}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isLoadingPost ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-4">{fullPost?.title}</h1>
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        pre: ({ node, ...props }) => (
                          <pre className="overflow-auto p-4 bg-gray-100 rounded-lg" {...props} />
                        ),
                        code: ({ node, inline, ...props }) => (
                          inline ? 
                            <code className="bg-gray-100 px-1 rounded" {...props} /> :
                            <code {...props} />
                        )
                      }}
                    >
                      {fullPost?.body || ''}
                    </ReactMarkdown>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200">
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-4">
                  Comentários ({post.children_deep_count})
                </h2>

                <div className="space-y-4">
                  {isLoadingComments ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  ) : comments?.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      Nenhum comentário ainda
                    </p>
                  ) : (
                    comments?.map((comment: TabNewsPost) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${comment.owner_username}&background=random`}
                            alt={comment.owner_username}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="font-semibold text-sm">
                            @{comment.owner_username}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment.published_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {comment.body}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
              <Heart size={24} />
              <span>{post.tabcoins}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600">
              <MessageCircle size={24} />
              <span>{post.children_deep_count}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600">
              <Share2 size={24} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}