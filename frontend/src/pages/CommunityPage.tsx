import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  ChevronLeft, 
  User, 
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Bookmark,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  mood?: string;
}

const moodEmojis: Record<string, string> = {
  grateful: "🙏",
  hopeful: "🌟",
  struggling: "💙",
  relaxed: "🧘‍♀️",
  happy: "😊",
  excited: "🎉",
  tired: "😴",
  anxious: "🫂"
};

const moodColors: Record<string, string> = {
  grateful: "bg-amber-100 text-amber-700",
  hopeful: "bg-green-100 text-green-700",
  struggling: "bg-blue-100 text-blue-700",
  relaxed: "bg-purple-100 text-purple-700",
  happy: "bg-yellow-100 text-yellow-700",
  excited: "bg-pink-100 text-pink-700",
  tired: "bg-gray-100 text-gray-700",
  anxious: "bg-indigo-100 text-indigo-700"
};

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'support'>('all');

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://sona-ai-backend.onrender.com/api/health-tracker/community/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Error fetching posts:", e);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://sona-ai-backend.onrender.com/api/health-tracker/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
      }
    } catch (e) {
      console.error("Error liking post:", e);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://sona-ai-backend.onrender.com/api/health-tracker/community/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
      }
    } catch (e) {
      console.error("Error bookmarking post:", e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`https://sona-ai-backend.onrender.com/api/health-tracker/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
        setCommentInputs({ ...commentInputs, [postId]: '' });
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    const payload = {
      content: newPostContent,
      mood: selectedMood || null,
      tags: []
    };

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://sona-ai-backend.onrender.com/api/health-tracker/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPostContent('');
        setSelectedMood('');
        setShowMoodSelector(false);
      }
    } catch (e) {
      console.error("Error creating post:", e);
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : activeTab === 'trending' 
    ? posts.filter(p => p.likes > 30)
    : posts.filter(p => p.tags.includes('support') || p.tags.includes('mental health'));


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-purple-700" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sona Community</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {posts.length} posts • {posts.reduce((acc, p) => acc + p.comments.length, 0)} comments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2 p-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
          {(['all', 'trending', 'support'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all",
                activeTab === tab 
                  ? "bg-white shadow-md text-purple-700" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {tab === 'all' && <Users className="w-4 h-4" />}
                {tab === 'trending' && <TrendingUp className="w-4 h-4" />}
                {tab === 'support' && <Heart className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-purple-100 p-6"
        >
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 border-2 border-purple-200">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                {user?.username?.[0]?.toUpperCase() || 'Y'}
              </AvatarFallback>
              <AvatarImage src={user?.avatar} />
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, ask for advice, or celebrate a milestone... 💕"
                className="w-full p-4 bg-purple-50/50 rounded-2xl border-2 border-purple-100 focus:border-purple-400 focus:ring-0 resize-none min-h-[100px] transition-all"
              />
              
              {/* Mood Selector */}
              {showMoodSelector && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      onClick={() => { setSelectedMood(mood); setShowMoodSelector(false); }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        selectedMood === mood 
                          ? moodColors[mood] 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
              
              {selectedMood && (
                <div className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm mt-3", moodColors[selectedMood])}>
                  {moodEmojis[selectedMood]} Feeling {selectedMood}
                  <button 
                    onClick={() => setSelectedMood('')}
                    className="ml-1 hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-purple-100 text-purple-600"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMoodSelector(!showMoodSelector)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      showMoodSelector ? "bg-purple-100 text-purple-600" : "hover:bg-purple-100 text-purple-600"
                    )}
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-purple-200">
                      {post.avatar ? (
                        <AvatarImage src={post.avatar} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                          {post.author[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.mood && (
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", moodColors[post.mood])}>
                        {moodEmojis[post.mood]} {post.mood}
                      </span>
                    )}
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mt-4 text-gray-700 leading-relaxed">{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikePost(post.id)}
                      className={cn(
                        "flex items-center gap-2 transition-colors",
                        post.isLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComments(post.id)}
                      className={cn(
                        "flex items-center gap-2 transition-colors",
                        showComments[post.id] ? "text-purple-600" : "text-gray-500 hover:text-purple-600"
                      )}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments.length}</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBookmarkPost(post.id)}
                    className={cn(
                      "transition-colors",
                      post.isBookmarked ? "text-purple-600" : "text-gray-400 hover:text-purple-600"
                    )}
                  >
                    <Bookmark className={cn("w-5 h-5", post.isBookmarked && "fill-current")} />
                  </motion.button>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {showComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-purple-50 bg-purple-50/30"
                  >
                    <div className="p-6 space-y-4">
                      {/* Existing Comments */}
                      {post.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <Avatar className="w-8 h-8">
                            {comment.avatar ? (
                              <AvatarImage src={comment.avatar} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-300 to-pink-300 text-white text-xs">
                                {comment.author[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-500 transition-colors">
                                <Heart className="w-3 h-3" />
                                {comment.likes}
                              </button>
                              <button className="text-xs text-gray-500 hover:text-purple-600 transition-colors">
                                Reply
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-3 mt-4">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs">
                            {user?.username?.[0]?.toUpperCase() || 'Y'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Write a supportive comment... 💕"
                            className="flex-1 rounded-full border-purple-200 bg-white"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityPage;
