"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Users, Heart, MessageCircle, Send, Shield, Plus, Sparkles, Trash2 } from "lucide-react"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/AuthContext"
import React from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const cardHoverVariants = {
  hover: {
    y: -2,
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.99,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

// Utility to build a nested comment tree
function buildCommentTree(comments: any[]) {
  const map: Record<number, any> = {};
  const roots: any[] = [];
  comments.forEach(comment => {
    map[comment.id] = { ...comment, children: [] };
  });
  comments.forEach(comment => {
    if (comment.parentCommentId) {
      map[comment.parentCommentId]?.children.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });
  return roots;
}

// Recursive comment renderer
function CommentNode({ comment, level, onReply, replyingToCommentId, replyContent, setReplyContent, createCommentMutation, refetchComments, deleteCommentMutation, user }: any) {
  // Explicitly type onReply
  const handleReply = (id: number | null) => onReply(id);
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }
  return (
    <div style={{ marginLeft: level * 24 }} className="mb-2">
      <div className="bg-purple-50 rounded-xl p-3 text-sm text-gray-700">
        <div className="flex items-center gap-2 mb-1">
          {comment.anonymous && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs rounded-full">Anonymous</Badge>
          )}
          <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <div>{comment.content}</div>
        <div className="mt-1 flex gap-2">
          <Button size="sm" variant="ghost" className="text-xs px-2 py-0.5" onClick={() => handleReply(comment.id as number)}>
            Reply
          </Button>
          {user && comment.userId === user.id && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs px-2 py-0.5 text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={() => deleteCommentMutation.mutate(comment.id)}
              disabled={deleteCommentMutation.isPending}
            >
              Delete
            </Button>
          )}
        </div>
        {replyingToCommentId === comment.id && (
          <div className="mt-2 space-y-2">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              className="min-h-[40px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-2xl"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  await createCommentMutation.mutateAsync({ postId: comment.postId, content: replyContent.trim(), parentCommentId: comment.id as number });
                  setReplyContent("");
                  refetchComments();
                  handleReply(null);
                }}
                disabled={!replyContent.trim() || createCommentMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-2xl py-1 px-3 font-medium shadow-lg disabled:opacity-50"
              >
                {createCommentMutation.isPending ? "Replying..." : "Reply"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { handleReply(null); setReplyContent(""); }}
                className="rounded-2xl px-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          {comment.children.map((child: any) => (
            <CommentNode
              key={child.id}
              comment={child}
              level={level + 1}
              onReply={handleReply}
              replyingToCommentId={replyingToCommentId}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              createCommentMutation={createCommentMutation}
              refetchComments={refetchComments}
              deleteCommentMutation={deleteCommentMutation}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Community() {
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const [newPostContent, setNewPostContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [showPostForm, setShowPostForm] = useState(false)
  const [replyingToPostId, setReplyingToPostId] = useState<number | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();
  const [openRepliesPostId, setOpenRepliesPostId] = useState<number | null>(null);
  const {
    data: openPostComments = [],
    refetch: refetchOpenPostComments,
    isFetching: isFetchingComments
  } = useQuery<Comment[]>({
    queryKey: openRepliesPostId ? ["/api/community/posts", openRepliesPostId, "comments"] : [],
    queryFn: async () => {
      if (!openRepliesPostId) return [];
      const res = await fetch(`/api/community/posts/${openRepliesPostId}/comments`);
      if (!res.ok) return [];
      return (await res.json()).comments || [];
    },
    enabled: !!openRepliesPostId,
  });

  const openAuthModal = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal"))
  }

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["/api/community/posts"],
    queryFn: async () => {
      const response = await fetch("/api/community/posts?limit=20")
      if (!response.ok) return { posts: [] }
      return response.json()
    },
  })

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; anonymous: boolean }) => {
      if (!user) throw new Error("No user")
      const response = await apiRequest("POST", "/api/community/posts", {
        userId: user.id,
        content: postData.content,
        anonymous: postData.anonymous,
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] })
      setNewPostContent("")
      setShowPostForm(false)
      toast({
        title: "Post shared successfully!",
        description: "Your message has been shared with the community.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error sharing post",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", `/api/community/posts/${postId}/like`, {})
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] })
    },
  })

  // Add mutation for creating a comment/reply
  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content, parentCommentId }: { postId: number; content: string; parentCommentId?: number | null }) => {
      if (!user) throw new Error("No user");
      const response = await apiRequest("POST", `/api/community/posts/${postId}/comments`, {
        userId: user.id,
        content,
        anonymous: isAnonymous,
      });
      return response.json();
    },
    onSuccess: () => {
      setReplyContent("");
      setReplyingToPostId(null);
      // Invalidate posts query to refresh reply counts
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({
        title: "Reply posted!",
        description: "Your reply has been added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error posting reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      if (!user) throw new Error("No user");
      const response = await apiRequest("DELETE", `/api/community/posts/${postId}`, {
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      if (!user) throw new Error("No user");
      const response = await apiRequest("DELETE", `/api/community/comments/${commentId}`, {
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch comments for a post
  const useComments = (postId: number) => {
    const query = useQuery<Comment[]>({
      queryKey: ["/api/community/posts", postId, "comments"],
      queryFn: async () => {
        const res = await fetch(`/api/community/posts/${postId}/comments`);
        if (!res.ok) return [];
        return (await res.json()).comments || [];
      },
      enabled: openRepliesPostId === postId,
    });
    // Update reply count when comments change
    React.useEffect(() => {
      if (query.data) {
        // setReplyCounts((prev) => ({ ...prev, [postId]: query.data!.length }));
      }
    }, [query.data, postId]);
    return query;
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return

    createPostMutation.mutate({
      content: newPostContent.trim(),
      anonymous: isAnonymous,
    })
  }

  const handleLikePost = (postId: number) => {
    likePostMutation.mutate(postId)
  }

  const getInitials = (anonymous: boolean, id: number) => {
    if (anonymous) return "A"
    return String.fromCharCode(65 + (id % 26))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  // Show a subtle loading indicator instead of blocking the entire page
  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="text-xs text-gray-600">Loading...</span>
        </div>
      </div>
    </motion.div>
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Join Our Community</h2>
          <p className="text-gray-600">
            Connect with others on their wellness journey. Share experiences and find support.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={openAuthModal}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full px-8 py-3 font-medium shadow-lg"
            >
              Login / Sign Up
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (user.isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Community Access</h2>
          <p className="text-gray-600">
            Create an account to join our supportive community and share your wellness journey.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={openAuthModal}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 rounded-full px-8 py-3 font-medium shadow-lg"
            >
              Create Account
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {loading && <LoadingIndicator />}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Community
          </h1>
          <p className="text-gray-600 text-lg">Share your journey and support others</p>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 text-lg">Safe Space Guidelines</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                {[
                  "Be kind and supportive to all members",
                  "Share experiences, not advice",
                  "Respect privacy and anonymity",
                  "Report concerning content",
                ].map((guideline, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>{guideline}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Post Section */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            {!showPostForm ? (
              <motion.div
                key="create-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setShowPostForm(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-2xl py-4 text-lg font-medium shadow-lg"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your Experience
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="create-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      Share with Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Share your thoughts, feelings, or experiences..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[120px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-2xl"
                    />

                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                      <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                      <Label htmlFor="anonymous" className="text-sm font-medium text-purple-800">
                        Post anonymously for privacy
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          onClick={handleSubmitPost}
                          disabled={!newPostContent.trim() || createPostMutation.isPending}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-2xl py-3 font-medium shadow-lg disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {createPostMutation.isPending ? "Sharing..." : "Share"}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPostForm(false)
                            setNewPostContent("")
                          }}
                          className="rounded-2xl px-6"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Posts Feed */}
        <motion.div variants={itemVariants} className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-white/60 backdrop-blur-sm shadow-lg border-0 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : postsData?.posts?.length > 0 ? (
            <AnimatePresence>
              {postsData.posts.map((post: any, index: number) => {
                const isOpen = openRepliesPostId === post.id;
                const replyCount = post.replyCount || 0; // Always use the reply count from the server
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={cardHoverVariants}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 rounded-3xl overflow-hidden transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md"
                          >
                            <span className="text-white text-sm font-bold">{getInitials(post.anonymous, post.id)}</span>
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {post.anonymous && (
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs rounded-full">
                                  Anonymous
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500 font-medium">{formatTimeAgo(post.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                            <div className="flex items-center space-x-6">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLikePost(post.id)}
                                className="flex items-center space-x-2 text-xs text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                <span className="font-medium">{post.likes}</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 text-xs text-gray-500 hover:text-purple-500 transition-colors"
                                onClick={() => {
                                  if (isOpen) {
                                    setOpenRepliesPostId(null);
                                    setReplyingToPostId(null);
                                    setReplyingToCommentId(null);
                                    setReplyContent("");
                                  } else {
                                    setOpenRepliesPostId(post.id);
                                    setReplyingToPostId(post.id);
                                  }
                                }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="font-medium">Reply</span>
                                {replyCount > 0 && (
                                  <span className="ml-1 text-xs text-gray-400">({replyCount})</span>
                                )}
                              </motion.button>
                              {user && post.userId === user.id && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => deletePostMutation.mutate(post.id)}
                                  disabled={deletePostMutation.isPending}
                                  className="flex items-center space-x-2 text-xs text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="font-medium">Delete</span>
                                </motion.button>
                              )}
                            </div>
                            {replyingToPostId === post.id && (
                              <div className="mt-4 space-y-2">
                                <Textarea
                                  placeholder="Write your reply..."
                                  value={replyContent}
                                  onChange={e => setReplyContent(e.target.value)}
                                  className="min-h-[60px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-2xl"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={async () => {
                                      await createCommentMutation.mutateAsync({ postId: post.id, content: replyContent.trim(), parentCommentId: null });
                                      refetchOpenPostComments();
                                    }}
                                    disabled={!replyContent.trim() || createCommentMutation.isPending}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-2xl py-2 px-4 font-medium shadow-lg disabled:opacity-50"
                                  >
                                    {createCommentMutation.isPending ? "Replying..." : "Reply"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => { setReplyingToPostId(null); setReplyingToCommentId(null); setReplyContent(""); }}
                                    className="rounded-2xl px-4"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                            {isOpen && openPostComments.length > 0 && (
                              <div className="mt-4 space-y-3 border-l-2 border-purple-100 pl-4">
                                {buildCommentTree(openPostComments).map((comment: any) => (
                                  <CommentNode
                                    key={comment.id}
                                    comment={comment}
                                    level={0}
                                    onReply={setReplyingToCommentId}
                                    replyingToCommentId={replyingToCommentId}
                                    replyContent={replyContent}
                                    setReplyContent={setReplyContent}
                                    createCommentMutation={createCommentMutation}
                                    refetchComments={refetchOpenPostComments}
                                    deleteCommentMutation={deleteCommentMutation}
                                    user={user}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience with the community</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowPostForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full px-8 py-3 font-medium shadow-lg"
                >
                  Share Your Story
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Community Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Community Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md"
                  >
                    <motion.p
                      key={postsData?.posts?.length}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      {postsData?.posts?.length || 0}
                    </motion.p>
                    <p className="text-sm text-gray-600 font-medium">Stories Shared</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md"
                  >
                    <motion.p
                      key={postsData?.posts?.reduce((sum: number, post: any) => sum + post.likes, 0)}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
                    >
                      {postsData?.posts?.reduce((sum: number, post: any) => sum + post.likes, 0) || 0}
                    </motion.p>
                    <p className="text-sm text-gray-600 font-medium">Hearts Given</p>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
