import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const PostContext = createContext(PostProvider);
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const achieveOptions = useMemo(() => {
    return {
      show: false,
      title: `Post achieve in addition to ${posts.length} main posts`,
    };
  }, [posts.length]);

  const handleAddPost = useCallback((post) => {
    setPosts((posts) => [post, ...posts]);
  }, []);

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onClearPosts: handleClearPosts,
        onAddPosts: handleAddPost,
        searchQuery,
        setSearchQuery,
        achieveOptions,
      }}>
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("Context was used out of it's scope.");
  return context;
}

export { PostProvider, usePosts };
