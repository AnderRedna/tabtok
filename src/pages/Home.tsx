import React, { useState, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import ContentCard from '../components/ContentCard';
import { fetchPosts } from '../services/api';
import { TabNewsPost } from '../types/tabnews';
import PostView from '../components/PostView';
import { Twitter } from 'lucide-react';
import ProcrastinationCard from '../components/ProcrastinationCard';
// import PullToRefresh from '../components/PullToRefresh';
import PostFilter from '../components/PostFilter';

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

type FilterOption = 'all' | 'pitch' | 'question';

export default function Home() {
  const { ref, inView } = useInView();
  const [selectedPost, setSelectedPost] = useState<TabNewsPost | null>(null);
  const [showProcrastinationMessage, setShowProcrastinationMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const postsPerScroll = Number(localStorage.getItem('postsPerScroll')) || 2;
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [startY, setStartY] = useState(0);
  const strategy = localStorage.getItem('strategy') || 'relevant';
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useInfiniteQuery(
    ['posts', strategy], // Add strategy to query key
    ({ pageParam = 1 }) => fetchPosts(pageParam, strategy), // Pass strategy to fetchPosts
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : undefined;
      },
      staleTime: 1000 * 60 * 5, // Cache por 5 minutos
      cacheTime: 1000 * 60 * 10, // Mantém cache por 10 minutos
      refetchOnWindowFocus: false, // Evita refetch ao focar na janela
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPulling) {
      const deltaY = e.touches[0].clientY - startY;
      const progress = Math.min(Math.max(deltaY / 100, 0), 1);
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 0.5 && !isFetching) {
      refetch();
    }
    setIsPulling(false);
    setPullProgress(0);
  };

  // Usar useMemo para cachear os posts filtrados
  const filteredPosts = useMemo(() => {
    const allPosts = data?.pages.flatMap(page => page) || [];
    if (selectedFilter === 'all') return allPosts;
    
    return allPosts.filter((post) => {
      if (selectedFilter === 'pitch') return post.title.toUpperCase().includes('[PITCH]') || post.title.toUpperCase().includes('[PITh]') || post.title.toUpperCase().includes('[PIT]');
      if (selectedFilter === 'question') return post.title.toUpperCase().includes('[DÚVIDA]') || post.title.toUpperCase().includes('[DUVIDA]') || post.title.toUpperCase().includes('[AJUDA]') ;
      return true;
    });
  }, [data?.pages, selectedFilter]);

  // Usar useMemo para cachear os grupos de posts
  const postGroups = useMemo(() => {
    const groups = [];
    for (let i = 0; i < filteredPosts.length; i += postsPerScroll) {
      const group = filteredPosts.slice(i, i + postsPerScroll);
      groups.push(group);
      
      if ((i + postsPerScroll) % 4 === 0) {
        groups.push(['procrastination']);
      }
    }
    return groups;
  }, [filteredPosts, postsPerScroll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
<div className="flex justify-center items-center h-screen text-red-500 text-center">
    Você realizou muitas solicitações, por favor tente novamente mais tarde.
</div>

    );
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* <PullToRefresh
        isPulling={isPulling}
        pullProgress={pullProgress}
        isRefreshing={isFetching}
      /> */}
      
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

      <PostFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      
      {selectedPost && (
        <PostView post={selectedPost} onClose={handleClosePost} />
      )}
    </div>
  );
}