import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import ContentCard from '../components/ContentCard';
import { fetchPosts } from '../services/api';
import { TabNewsPost } from '../types/tabnews';
import PostView from '../components/PostView';

export default function Home() {
  const { ref, inView } = useInView();
  const [selectedPost, setSelectedPost] = React.useState<TabNewsPost | null>(null);

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

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleUpvote = (slug: string) => {
    console.log('Upvote:', slug);
  };

  const handlePostClick = (post: TabNewsPost) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

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

  // Group posts into pairs
  const postPairs = data?.pages.flatMap(page => page).reduce((acc: TabNewsPost[][], post, index) => {
    if (index % 2 === 0) {
      acc.push([post]);
    } else {
      acc[acc.length - 1].push(post);
    }
    return acc;
  }, []) || [];

  return (
    <>
      <div className="pb-16 pt-4 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-lg mx-auto">
          {postPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="snap-start h-[100vh] flex flex-col justify-center gap-4">
              {pair.map((post) => (
                <ContentCard
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  onClick={() => handlePostClick(post)}
                />
              ))}
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