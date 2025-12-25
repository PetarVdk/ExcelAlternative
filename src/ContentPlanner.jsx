import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Trash2, Edit, X, Clock, CheckCircle, Lightbulb, FileText, Hash, Image as ImageIcon, Video, Film, Grid, Sparkles, BookOpen, Tag, DollarSign, Instagram, Calendar } from 'lucide-react';
import './App.css';

const ContentPlanner = ({ switcherProps }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [toasts, setToasts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [plannedPosts, setPlannedPosts] = useState([]);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [editingPlannedPost, setEditingPlannedPost] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [newPlannedPost, setNewPlannedPost] = useState({
    accountId: '',
    caption: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    hashtags: '',
    postType: 'photo',
    notes: '',
    imagePreview: ''
  });
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    status: 'idea', // idea, planned, in-progress, completed
    priority: 'medium', // low, medium, high
    relatedAccount: ''
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [ideaFilter, setIdeaFilter] = useState('all');

  // Load data from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem('instagram_accounts');
    const savedPlannedPosts = localStorage.getItem('instagram_planned_posts');
    const savedContentIdeas = localStorage.getItem('content_ideas');
    
    if (savedAccounts && savedAccounts !== '[]') {
      const parsed = JSON.parse(savedAccounts);
      setAccounts(parsed);
      if (parsed.length > 0 && !selectedAccount) {
        setSelectedAccount(parsed[0].id);
      }
    }
    if (savedPlannedPosts && savedPlannedPosts !== '[]') {
      setPlannedPosts(JSON.parse(savedPlannedPosts));
    }
    if (savedContentIdeas && savedContentIdeas !== '[]') {
      setContentIdeas(JSON.parse(savedContentIdeas));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('instagram_planned_posts', JSON.stringify(plannedPosts));
  }, [plannedPosts]);

  useEffect(() => {
    localStorage.setItem('content_ideas', JSON.stringify(contentIdeas));
  }, [contentIdeas]);

  const showToastMessage = (message, type = 'success') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  };

  // Planned Posts Functions
  const addPlannedPost = () => {
    if (!newPlannedPost.accountId) {
      showToastMessage('Please select an account', 'error');
      return;
    }
    if (!newPlannedPost.caption && !newPlannedPost.hashtags) {
      showToastMessage('Please enter a caption or hashtags', 'error');
      return;
    }

    const plannedPost = {
      id: editingPlannedPost ? editingPlannedPost.id : Date.now().toString(),
      ...newPlannedPost,
      accountId: newPlannedPost.accountId,
      createdAt: editingPlannedPost ? editingPlannedPost.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingPlannedPost) {
      setPlannedPosts(plannedPosts.map(p => p.id === editingPlannedPost.id ? plannedPost : p));
      showToastMessage('Planned post updated successfully!');
    } else {
      setPlannedPosts([...plannedPosts, plannedPost]);
      showToastMessage('Post added to content planner!');
    }

    setNewPlannedPost({
      accountId: selectedAccount || '',
      caption: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
      hashtags: '',
      postType: 'photo',
      notes: '',
      imagePreview: ''
    });
    setEditingPlannedPost(null);
    setShowPlannerModal(false);
  };

  const editPlannedPost = (post) => {
    setEditingPlannedPost(post);
    setNewPlannedPost({
      accountId: post.accountId,
      caption: post.caption || '',
      scheduledDate: post.scheduledDate,
      scheduledTime: post.scheduledTime || new Date().toTimeString().split(' ')[0].slice(0, 5),
      hashtags: post.hashtags || '',
      postType: post.postType || 'photo',
      notes: post.notes || '',
      imagePreview: post.imagePreview || ''
    });
    setShowPlannerModal(true);
  };

  const deletePlannedPost = (id) => {
    if (window.confirm('Are you sure you want to delete this planned post?')) {
      setPlannedPosts(plannedPosts.filter(p => p.id !== id));
      showToastMessage('Planned post deleted successfully!');
    }
  };

  // Content Ideas Functions
  const addContentIdea = () => {
    if (!newIdea.title) {
      showToastMessage('Please enter a title for your idea', 'error');
      return;
    }

    const idea = {
      id: editingIdea ? editingIdea.id : Date.now().toString(),
      ...newIdea,
      createdAt: editingIdea ? editingIdea.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingIdea) {
      setContentIdeas(contentIdeas.map(i => i.id === editingIdea.id ? idea : i));
      showToastMessage('Idea updated successfully!');
    } else {
      setContentIdeas([...contentIdeas, idea]);
      showToastMessage('Idea saved successfully!');
    }

    setNewIdea({
      title: '',
      description: '',
      category: 'general',
      tags: '',
      status: 'idea',
      priority: 'medium',
      relatedAccount: ''
    });
    setEditingIdea(null);
    setShowIdeaModal(false);
  };

  const editIdea = (idea) => {
    setEditingIdea(idea);
    setNewIdea({
      title: idea.title || '',
      description: idea.description || '',
      category: idea.category || 'general',
      tags: idea.tags || '',
      status: idea.status || 'idea',
      priority: idea.priority || 'medium',
      relatedAccount: idea.relatedAccount || ''
    });
    setShowIdeaModal(true);
  };

  const deleteIdea = (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      setContentIdeas(contentIdeas.filter(i => i.id !== id));
      showToastMessage('Idea deleted successfully!');
    }
  };

  const convertIdeaToPost = (idea) => {
    setNewPlannedPost({
      accountId: idea.relatedAccount || selectedAccount || '',
      caption: idea.description || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
      hashtags: idea.tags || '',
      postType: 'photo',
      notes: `Converted from idea: ${idea.title}`,
      imagePreview: ''
    });
    setEditingIdea(null);
    setShowIdeaModal(false);
    setShowPlannerModal(true);
    showToastMessage('Idea converted to planned post!');
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getPlannedPostsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return plannedPosts.filter(p => {
      const matchesAccount = !selectedAccount || p.accountId === selectedAccount;
      return matchesAccount && p.scheduledDate === dateStr;
    });
  };

  // Filter ideas
  const filteredIdeas = contentIdeas.filter(idea => {
    if (ideaFilter === 'all') return true;
    return idea.status === ideaFilter;
  });

  const getPostTypeIcon = (type) => {
    switch(type) {
      case 'photo': return <ImageIcon size={16} />;
      case 'video': return <Video size={16} />;
      case 'carousel': return <Grid size={16} />;
      case 'reel': return <Film size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="content-planner-app">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      <header className="header">
        <div className="header-left">
          <h1 className="header-title">
            <CalendarDays size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Content Planner
          </h1>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button
              className="button"
              onClick={() => {
                setEditingPlannedPost(null);
                setNewPlannedPost({
                  accountId: selectedAccount || '',
                  caption: '',
                  scheduledDate: new Date().toISOString().split('T')[0],
                  scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
                  hashtags: '',
                  postType: 'photo',
                  notes: '',
                  imagePreview: ''
                });
                setShowPlannerModal(true);
              }}
            >
              <Plus size={16} />
              Plan Post
            </button>
            <button
              className="button"
              onClick={() => {
                setEditingIdea(null);
                setNewIdea({
                  title: '',
                  description: '',
                  category: 'general',
                  tags: '',
                  status: 'idea',
                  priority: 'medium',
                  relatedAccount: selectedAccount || ''
                });
                setShowIdeaModal(true);
              }}
            >
              <Lightbulb size={16} />
              New Idea
            </button>
          </div>
          {switcherProps && (
            <div className="nav-switcher">
              <button
                className={`nav-switcher-button ${switcherProps.currentApp === 'profit' ? 'active' : ''}`}
                onClick={() => switcherProps.switchApp('profit')}
                disabled={switcherProps.isAnimating}
                title="Profit Tracker"
              >
                <DollarSign size={18} />
              </button>
              <button
                className={`nav-switcher-button ${switcherProps.currentApp === 'instagram' ? 'active' : ''}`}
                onClick={() => switcherProps.switchApp('instagram')}
                disabled={switcherProps.isAnimating}
                title="Instagram Analytics"
              >
                <Instagram size={18} />
              </button>
              <button
                className={`nav-switcher-button ${switcherProps.currentApp === 'content' ? 'active' : ''}`}
                onClick={() => switcherProps.switchApp('content')}
                disabled={switcherProps.isAnimating}
                title="Content Planner"
              >
                <CalendarDays size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Account Selector */}
      {accounts.length > 0 && (
        <div className="account-selector">
          <button
            className={`account-button ${!selectedAccount ? 'active' : ''}`}
            onClick={() => setSelectedAccount(null)}
          >
            All Accounts
          </button>
          {accounts.map(account => (
            <button
              key={account.id}
              className={`account-button ${selectedAccount === account.id ? 'active' : ''}`}
              onClick={() => setSelectedAccount(account.id)}
            >
              <Instagram size={16} />
              <span>@{account.username}</span>
              {account.followers > 0 && (
                <span className="account-followers">{account.followers.toLocaleString()} followers</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <button 
            className={'nav-button ' + (activeTab === 'calendar' ? 'active' : '')}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarDays size={20} />
            Calendar
          </button>
          <button 
            className={'nav-button ' + (activeTab === 'posts' ? 'active' : '')}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={20} />
            Planned Posts
          </button>
          <button 
            className={'nav-button ' + (activeTab === 'ideas' ? 'active' : '')}
            onClick={() => setActiveTab('ideas')}
          >
            <Lightbulb size={20} />
            Ideas
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'calendar' && (
          <div className="tab-content">
            <div className="card">
              <div className="planner-calendar">
                <div className="calendar-header">
                  <button
                    className="button small"
                    onClick={() => {
                      const newDate = new Date(selectedCalendarDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedCalendarDate(newDate);
                    }}
                  >
                    ←
                  </button>
                  <h3>
                    {selectedCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    className="button small"
                    onClick={() => {
                      const newDate = new Date(selectedCalendarDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedCalendarDate(newDate);
                    }}
                  >
                    →
                  </button>
                </div>

                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  {getDaysInMonth(selectedCalendarDate).map((date, index) => {
                    const dayPosts = date ? getPlannedPostsForDate(date) : [];
                    const isToday = date && date.toDateString() === new Date().toDateString();
                    const isPast = date && date < new Date() && !isToday;
                    
                    return (
                      <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayPosts.length > 0 ? 'has-posts' : ''}`}
                        onClick={() => {
                          if (date) {
                            setNewPlannedPost(prev => ({
                              ...prev,
                              scheduledDate: date.toISOString().split('T')[0],
                              accountId: selectedAccount || ''
                            }));
                            setShowPlannerModal(true);
                          }
                        }}
                      >
                        {date && (
                          <>
                            <span className="calendar-day-number">{date.getDate()}</span>
                            {dayPosts.length > 0 && (
                              <div className="calendar-day-posts">
                                {dayPosts.slice(0, 3).map(post => (
                                  <div
                                    key={post.id}
                                    className="calendar-post-dot"
                                    title={post.caption ? post.caption.substring(0, 50) : 'Planned post'}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      editPlannedPost(post);
                                    }}
                                  />
                                ))}
                                {dayPosts.length > 3 && (
                                  <span className="calendar-post-more">+{dayPosts.length - 3}</span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="tab-content">
            <div className="card">
              <h2>Planned Posts ({plannedPosts.filter(p => !selectedAccount || p.accountId === selectedAccount).length})</h2>
              {plannedPosts.filter(p => !selectedAccount || p.accountId === selectedAccount).length === 0 ? (
                <p className="vat-note">No planned posts yet. Click "Plan Post" to schedule your content!</p>
              ) : (
                <div className="planned-posts-list">
                  {[...plannedPosts]
                    .filter(p => !selectedAccount || p.accountId === selectedAccount)
                    .sort((a, b) => {
                      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`);
                      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`);
                      return dateA - dateB;
                    })
                    .map(plannedPost => {
                      const account = accounts.find(a => a.id === plannedPost.accountId);
                      const scheduledDateTime = new Date(`${plannedPost.scheduledDate}T${plannedPost.scheduledTime || '00:00'}`);
                      const isPast = scheduledDateTime < new Date();
                      
                      return (
                        <div key={plannedPost.id} className={`planned-post-item ${isPast ? 'past' : ''}`}>
                          <div className="planned-post-header">
                            <div className="planned-post-info">
                              <div className="planned-post-account">
                                {account && <span>@{account.username}</span>}
                                <span className="planned-post-type">
                                  {getPostTypeIcon(plannedPost.postType)}
                                  {plannedPost.postType}
                                </span>
                              </div>
                              <div className="planned-post-date">
                                <Calendar size={14} />
                                <span>{new Date(plannedPost.scheduledDate).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                                {plannedPost.scheduledTime && (
                                  <>
                                    <Clock size={14} style={{ marginLeft: '0.5rem' }} />
                                    <span>{plannedPost.scheduledTime}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="planned-post-actions">
                              <button
                                className="button small"
                                onClick={() => editPlannedPost(plannedPost)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="button small delete-btn"
                                onClick={() => deletePlannedPost(plannedPost.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          {plannedPost.caption && (
                            <div className="planned-post-caption">
                              {plannedPost.caption.length > 150 
                                ? `${plannedPost.caption.substring(0, 150)}...` 
                                : plannedPost.caption}
                            </div>
                          )}
                          {plannedPost.hashtags && (
                            <div className="planned-post-hashtags">
                              {plannedPost.hashtags.split(' ').slice(0, 5).map((tag, idx) => (
                                <span key={idx} className="hashtag-tag">{tag}</span>
                              ))}
                              {plannedPost.hashtags.split(' ').length > 5 && (
                                <span className="hashtag-more">+{plannedPost.hashtags.split(' ').length - 5} more</span>
                              )}
                            </div>
                          )}
                          {plannedPost.notes && (
                            <div className="planned-post-notes">
                              <strong>Notes:</strong> {plannedPost.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="tab-content">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Content Ideas ({filteredIdeas.length})</h2>
                <select
                  value={ideaFilter}
                  onChange={(e) => setIdeaFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  <option value="all">All Ideas</option>
                  <option value="idea">Ideas</option>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {filteredIdeas.length === 0 ? (
                <p className="vat-note">No content ideas yet. Click "New Idea" to capture your creative thoughts!</p>
              ) : (
                <div className="ideas-grid">
                  {filteredIdeas.map(idea => {
                    const account = accounts.find(a => a.id === idea.relatedAccount);
                    return (
                      <div key={idea.id} className={`idea-card idea-${idea.status} idea-priority-${idea.priority}`}>
                        <div className="idea-header">
                          <div className="idea-title-section">
                            <h3>{idea.title}</h3>
                            <div className="idea-badges">
                              <span className={`idea-badge idea-badge-${idea.status}`}>
                                {idea.status.replace('-', ' ')}
                              </span>
                              <span className={`idea-badge idea-badge-priority-${idea.priority}`}>
                                {idea.priority}
                              </span>
                              {idea.category && (
                                <span className="idea-badge">{idea.category}</span>
                              )}
                            </div>
                          </div>
                          <div className="idea-actions">
                            <button
                              className="button small"
                              onClick={() => convertIdeaToPost(idea)}
                              title="Convert to Post"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              className="button small"
                              onClick={() => editIdea(idea)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="button small delete-btn"
                              onClick={() => deleteIdea(idea.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {idea.description && (
                          <p className="idea-description">{idea.description}</p>
                        )}
                        {account && (
                          <div className="idea-account">
                            <Instagram size={14} />
                            <span>@{account.username}</span>
                          </div>
                        )}
                        {idea.tags && (
                          <div className="idea-tags">
                            {idea.tags.split(',').map((tag, idx) => (
                              <span key={idx} className="idea-tag">
                                <Tag size={12} />
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="idea-footer">
                          <span className="idea-date">
                            Created: {new Date(idea.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Planned Post Modal */}
      {showPlannerModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingPlannedPost ? 'Edit Planned Post' : 'Plan New Post'}</h2>
            
            <div className="form-group">
              <label>Account *</label>
              <select
                value={newPlannedPost.accountId}
                onChange={(e) => setNewPlannedPost({...newPlannedPost, accountId: e.target.value})}
                className="input-field"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>@{account.username}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Scheduled Date *</label>
                <input
                  type="date"
                  value={newPlannedPost.scheduledDate}
                  onChange={(e) => setNewPlannedPost({...newPlannedPost, scheduledDate: e.target.value})}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Scheduled Time</label>
                <input
                  type="time"
                  value={newPlannedPost.scheduledTime}
                  onChange={(e) => setNewPlannedPost({...newPlannedPost, scheduledTime: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Post Type</label>
              <select
                value={newPlannedPost.postType}
                onChange={(e) => setNewPlannedPost({...newPlannedPost, postType: e.target.value})}
                className="input-field"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="carousel">Carousel</option>
                <option value="reel">Reel</option>
              </select>
            </div>

            <div className="form-group">
              <label>Caption</label>
              <textarea
                value={newPlannedPost.caption}
                onChange={(e) => setNewPlannedPost({...newPlannedPost, caption: e.target.value})}
                className="input-field"
                rows="4"
                placeholder="Write your post caption here..."
              />
            </div>

            <div className="form-group">
              <label>Hashtags</label>
              <input
                type="text"
                value={newPlannedPost.hashtags}
                onChange={(e) => setNewPlannedPost({...newPlannedPost, hashtags: e.target.value})}
                className="input-field"
                placeholder="#hashtag1 #hashtag2 #hashtag3"
              />
            </div>

            <div className="form-group">
              <label>Notes (Internal)</label>
              <textarea
                value={newPlannedPost.notes}
                onChange={(e) => setNewPlannedPost({...newPlannedPost, notes: e.target.value})}
                className="input-field"
                rows="3"
                placeholder="Add any internal notes or reminders about this post..."
              />
            </div>

            <div className="modal-actions">
              <button onClick={addPlannedPost} className="button">
                {editingPlannedPost ? 'Update Planned Post' : 'Add to Planner'}
              </button>
              <button
                onClick={() => {
                  setShowPlannerModal(false);
                  setEditingPlannedPost(null);
                  setNewPlannedPost({
                    accountId: selectedAccount || '',
                    caption: '',
                    scheduledDate: new Date().toISOString().split('T')[0],
                    scheduledTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
                    hashtags: '',
                    postType: 'photo',
                    notes: '',
                    imagePreview: ''
                  });
                }}
                className="button secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Idea Modal */}
      {showIdeaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingIdea ? 'Edit Content Idea' : 'New Content Idea'}</h2>
            
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newIdea.title}
                onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                className="input-field"
                placeholder="e.g., Product Launch Video"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newIdea.description}
                onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                className="input-field"
                rows="4"
                placeholder="Describe your content idea in detail..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
                  className="input-field"
                >
                  <option value="general">General</option>
                  <option value="product">Product</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="behind-scenes">Behind the Scenes</option>
                  <option value="promotion">Promotion</option>
                  <option value="story">Story</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newIdea.priority}
                  onChange={(e) => setNewIdea({...newIdea, priority: e.target.value})}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newIdea.status}
                  onChange={(e) => setNewIdea({...newIdea, status: e.target.value})}
                  className="input-field"
                >
                  <option value="idea">Idea</option>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Related Account</label>
                <select
                  value={newIdea.relatedAccount}
                  onChange={(e) => setNewIdea({...newIdea, relatedAccount: e.target.value})}
                  className="input-field"
                >
                  <option value="">None</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>@{account.username}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={newIdea.tags}
                onChange={(e) => setNewIdea({...newIdea, tags: e.target.value})}
                className="input-field"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="modal-actions">
              <button onClick={addContentIdea} className="button">
                {editingIdea ? 'Update Idea' : 'Save Idea'}
              </button>
              <button
                onClick={() => {
                  setShowIdeaModal(false);
                  setEditingIdea(null);
                  setNewIdea({
                    title: '',
                    description: '',
                    category: 'general',
                    tags: '',
                    status: 'idea',
                    priority: 'medium',
                    relatedAccount: selectedAccount || ''
                  });
                }}
                className="button secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPlanner;

