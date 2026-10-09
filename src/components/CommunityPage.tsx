import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  PlusCircle, 
  Sparkles, 
  Filter, 
  Share2, 
  Check, 
  Calendar, 
  User, 
  MapPin, 
  Tag 
} from 'lucide-react';
import { CommunityPost, Campus, Student } from '../types';

interface CommunityPageProps {
  posts: CommunityPost[];
  onReactionToggle: (postId: string, reactionType: 'like' | 'love' | 'clap' | 'celebrate' | 'star' | 'fire') => void;
  onAddComment: (postId: string, author: string, role: 'Parent' | 'Teacher' | 'Community', text: string) => void;
  onAddPost: (post: Omit<CommunityPost, 'id' | 'reactions' | 'comments'>) => void;
  loggedInStudent: Student | null;
}

const EMOJI_MAP: Record<'like' | 'love' | 'clap' | 'celebrate' | 'star' | 'fire', { emoji: string; label: string }> = {
  like: { emoji: '👍', label: 'Helpful' },
  love: { emoji: '❤️', label: 'Love' },
  clap: { emoji: '👏', label: 'Applaud' },
  celebrate: { emoji: '🎉', label: 'Celebrate' },
  star: { emoji: '🌟', label: 'Inspiring' },
  fire: { emoji: '🔥', label: 'Excited' },
};

export const CommunityPage: React.FC<CommunityPageProps> = ({
  posts,
  onReactionToggle,
  onAddComment,
  onAddPost,
  loggedInStudent,
}) => {
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Notice');
  const [newCampus, setNewCampus] = useState<Campus | 'All Campuses'>('All Campuses');
  const [newAuthor, setNewAuthor] = useState(
    loggedInStudent ? `Parent of ${loggedInStudent.name} (${loggedInStudent.grade})` : 'AmboTsavo Parent Council'
  );

  const filteredPosts = posts.filter((p) => {
    const campusMatch = selectedCampus === 'All' || p.campus === 'All Campuses' || p.campus === selectedCampus;
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    return campusMatch && categoryMatch;
  });

  const handleCommentSubmit = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    const author = loggedInStudent ? `${loggedInStudent.parentName} (${loggedInStudent.grade} Parent)` : 'AmboTsavo Community Member';
    const role = loggedInStudent ? 'Parent' : 'Community';
    onAddComment(postId, author, role, text);
    setCommentText((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddPost({
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim() || 'School Contributor',
      authorRole: loggedInStudent ? `Parent (${loggedInStudent.grade})` : 'Staff / Community',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      campus: newCampus,
      category: newCategory,
      imageUrl: newCategory === 'Sports' 
        ? '/src/assets/images/community_sports_day_1791538597371.jpg' 
        : newCategory === 'CBC Showcase' 
        ? '/src/assets/images/learning_classroom_art_1791538609308.jpg'
        : '/src/assets/images/kimana_campus_view_1791538619471.jpg',
    });

    setNewTitle('');
    setNewContent('');
    setIsPostModalOpen(false);
  };

  const handleShare = (postId: string) => {
    setCopiedPostId(postId);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              AmboTsavo Community Hub
            </div>
            <h1 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">
              School Announcements &amp; Parent Reactions
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Stay in touch with school milestones across Kajiado and Kimana. React with emojis and leave comments.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Feed:</span>
          </div>

          {/* Campus Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Kajiado Campus', 'Kimana Amboseli Campus'].map((campus) => (
              <button
                key={campus}
                onClick={() => setSelectedCampus(campus)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCampus === campus
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {campus === 'All' ? 'All Campuses' : campus.replace(' Amboseli', '')}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Sports', 'CBC Showcase', 'Academics', 'Notice'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <p className="text-sm">No announcements matching the selected filter.</p>
              <button
                onClick={() => {
                  setSelectedCampus('All');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs font-semibold text-emerald-800 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

              return (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {/* Post Image if present */}
                  {post.imageUrl && (
                    <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-emerald-800">{post.category}</span>
                        {post.targetAudience && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Audience: {post.targetAudience}
                          </span>
                        )}
                        <span aria-hidden="true">&middot;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {post.campus}
                        </span>
                        <span aria-hidden="true">&middot;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {post.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedPostId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 text-[11px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Share</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title & Prose */}
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-3 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                      {post.content}
                    </p>

                    {/* Author Attribution */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100 mb-6">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Posted by <strong className="text-slate-700">{post.author}</strong> ({post.authorRole})</span>
                    </div>

                    {/* INTERACTIVE EMOJI REACTION ZONE */}
                    <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-100 mb-6">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span>Emoji Reactions</span>
                          <span className="text-[11px] font-normal text-slate-500 font-mono">
                            ({totalReactions} total)
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">Tap to react as parent</span>
                      </div>

                      {/* Emoji Buttons Grid */}
                      <div className="flex flex-wrap items-center gap-2">
                        {(Object.keys(EMOJI_MAP) as Array<keyof typeof EMOJI_MAP>).map((type) => {
                          const count = post.reactions[type] || 0;
                          const isReacted = post.userReacted?.includes(type);

                          return (
                            <button
                              key={type}
                              onClick={() => onReactionToggle(post.id, type)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                isReacted
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs scale-105'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                              title={`${EMOJI_MAP[type].label}: ${count} reactions`}
                            >
                              <span className="text-base">{EMOJI_MAP[type].emoji}</span>
                              <span className="font-mono text-xs font-semibold">{count}</span>
                              <span className="text-[10px] text-slate-500 hidden sm:inline">
                                {EMOJI_MAP[type].label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Comments Toggle & Header */}
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                      <button
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className="font-semibold text-emerald-800 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>
                          {post.comments.length} Parent &amp; Teacher {post.comments.length === 1 ? 'Comment' : 'Comments'}
                        </span>
                      </button>
                      <span className="text-[11px] text-slate-500">
                        {loggedInStudent ? `Commenting as ${loggedInStudent.parentName}` : 'Guest Community'}
                      </span>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-slate-50/80 rounded-lg p-3 text-xs border border-slate-100"
                        >
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="font-semibold text-slate-800">
                              {comment.author}{' '}
                              <span className="font-normal text-slate-500 text-[11px]">
                                &middot; {comment.role}
                              </span>
                            </span>
                            <span className="text-[10px]">{comment.timestamp}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{comment.text}</p>
                        </div>
                      ))}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentText[post.id] || ''}
                          onChange={(e) =>
                            setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCommentSubmit(post.id);
                            }
                          }}
                          placeholder={
                            loggedInStudent
                              ? `Add a comment as ${loggedInStudent.parentName}...`
                              : 'Leave a comment for AmboTsavo community...'
                          }
                          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white text-slate-900 placeholder:text-slate-400"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span className="hidden sm:inline">Send</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>

      {/* New Announcement Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Create New School Announcement
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Post notices, CBC updates, or upcoming events for AmboTsavo parents and teachers.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. PP1 & PP2 Nature Excursion to Amboseli Sanctuary"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Campus</label>
                  <select
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-900 text-xs bg-white"
                  >
                    <option value="All Campuses">All Campuses</option>
                    <option value="Kajiado Campus">Kajiado Campus</option>
                    <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-900 text-xs bg-white"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Academics">Academics</option>
                    <option value="CBC Showcase">CBC Showcase</option>
                    <option value="Sports">Sports</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Name / Role</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Tr. Agnes Nkaisserry or Mercy Mutiso"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Details</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide all essential details, timings, guidelines, and instructions for parents..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
