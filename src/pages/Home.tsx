import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import ContentCard from '../components/ContentCard';
import { fetchPosts } from '../services/api';
import { TabNewsPost } from '../types/tabnews';
import PostView from '../components/PostView';
import { Twitter } from 'lucide-react';
import ProcrastinationCard from '../components/ProcrastinationCard';

const procrastinationMessages = [
  "Você está a muito tempo scrollando, acho melhor você não procrastinar?",
  "Hey, que tal fazer uma pausa? Você já scrollou bastante!",
  "Lembre-se: produtividade é importante! Talvez seja hora de voltar ao trabalho?",
  "Scrolling infinito não é tão produtivo quanto parece...",
  "Já considerou fazer uma pausa para esticar as pernas?",
  "Que tal dar uma pausa e beber água?",
  "Seus olhos merecem um descanso, não acha?",
  "Muita informação por hoje, não?",
];

export default function Home() {
  const { ref, inView } = useInView();
  const [selectedPost, setSelectedPost] = useState<TabNewsPost | null>(null);
  const [showProcrastinationMessage, setShowProcrastinationMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const postsPerScroll = Number(localStorage.getItem('postsPerScroll')) || 2;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError
  } = useInfiniteQuery(
    'posts',
    ({ pageParam = 1 }) => fetchPosts(pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : undefined;
      },
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const newPostCount = data?.pages.reduce((acc, page) => acc + page.length, 0) || 0;
    
    if (newPostCount !== postCount) {
      setPostCount(newPostCount);
      
      // Show message every 4 posts viewed
      if (newPostCount > 0 && Math.floor(newPostCount / 4) > Math.floor(postCount / 4)) {
        setShowProcrastinationMessage(true);
        setMessageIndex(prev => (prev + 1) % procrastinationMessages.length);
      }
    }
  }, [data, postCount]);

  const handleUpvote = (slug: string) => {
    console.log('Upvote:', slug);
  };

  const handlePostClick = (post: TabNewsPost) => {
    // Add state to history when opening post
    window.history.pushState({ post: true }, '');
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  // Add effect to handle popstate event
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedPost) {
        event.preventDefault();
        setSelectedPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedPost]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error ao carregar os posts.
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page) || [];
  const postGroups = [];
  
  for (let i = 0; i < allPosts.length; i += postsPerScroll) {
    const group = allPosts.slice(i, i + postsPerScroll);
    postGroups.push(group);
    
    // Add ProcrastinationCard after every 4 posts
    if ((i + postsPerScroll) % 4 === 0) {
      postGroups.push(['procrastination']);
    }
  }

  return (
    <>
      <div className="pb-16 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-lg mx-auto">
          {postGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="snap-start min-h-screen flex flex-col justify-center gap-4">
              {group[0] === 'procrastination' ? (
                <ProcrastinationCard />
              ) : (
                group.map((post: TabNewsPost) => (
                  <ContentCard
                    key={post.id}
                    post={post}
                    onUpvote={handleUpvote}
                    onClick={() => handlePostClick(post)}
                  />
                ))
              )}
            </div>
          ))}
        </div>
        <div ref={ref} className="h-10" />
      </div>

      {selectedPost && (
        <PostView post={selectedPost} onClose={handleClosePost} />
      )}
    </>
  );
}