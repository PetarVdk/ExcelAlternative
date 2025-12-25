import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Instagram, TrendingUp, Users, Heart, MessageCircle, Share2, Eye, Plus, Trash2, Edit, X, Hash, Search, DollarSign, Settings, Image as ImageIcon, Upload, Loader, CalendarDays } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const InstagramAnalytics = ({ switcherProps }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [toasts, setToasts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: '',
    displayName: '',
    followers: '',
    following: '',
    bio: '',
    profileImage: ''
  });
  const [newPost, setNewPost] = useState({
    accountId: '',
    caption: '',
    postDate: new Date().toISOString().split('T')[0],
    postTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    reach: '',
    impressions: '',
    engagement: '',
    hashtags: '',
    postType: 'photo', // photo, video, carousel, reel
    linkClicks: '',
    profileVisits: '',
    websiteClicks: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [processingOCR, setProcessingOCR] = useState(false);
  const [ocrPreview, setOcrPreview] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem('instagram_accounts');
    const savedPosts = localStorage.getItem('instagram_posts');
    
    if (savedAccounts && savedAccounts !== '[]') {
      const parsed = JSON.parse(savedAccounts);
      setAccounts(parsed);
      if (parsed.length > 0 && !selectedAccount) {
        setSelectedAccount(parsed[0].id);
      }
    }
    if (savedPosts && savedPosts !== '[]') {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save accounts to localStorage
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('instagram_accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  // Save posts to localStorage
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('instagram_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const addAccount = () => {
    if (!newAccount.username) {
      showToastMessage('Please enter a username', 'error');
      return;
    }

    if (editingAccount) {
      // Update existing account
      const updatedAccount = {
        ...editingAccount,
        ...newAccount,
        followers: parseInt(newAccount.followers) || 0,
        following: parseInt(newAccount.following) || 0,
        updatedAt: new Date().toISOString()
      };
      setAccounts(accounts.map(a => a.id === editingAccount.id ? updatedAccount : a));
      showToastMessage('Account updated successfully!');
      setEditingAccount(null);
    } else {
      // Add new account
      const account = {
        id: Date.now(),
        ...newAccount,
        followers: parseInt(newAccount.followers) || 0,
        following: parseInt(newAccount.following) || 0,
        createdAt: new Date().toISOString()
      };
      setAccounts([...accounts, account]);
      setSelectedAccount(account.id);
      showToastMessage('Account added successfully!');
    }

    setNewAccount({
      username: '',
      displayName: '',
      followers: '',
      following: '',
      bio: '',
      profileImage: ''
    });
    setShowAccountModal(false);
  };

  const editAccount = (account) => {
    setEditingAccount(account);
    setNewAccount({
      username: account.username,
      displayName: account.displayName || '',
      followers: account.followers || '',
      following: account.following || '',
      bio: account.bio || '',
      profileImage: account.profileImage || ''
    });
    setShowAccountModal(true);
  };

  const addPost = () => {
    if (!newPost.accountId || !newPost.caption) {
      showToastMessage('Please fill in account and caption', 'error');
      return;
    }

    const likes = parseInt(newPost.likes) || 0;
    const comments = parseInt(newPost.comments) || 0;
    const shares = parseInt(newPost.shares) || 0;
    const saves = parseInt(newPost.saves) || 0;
    const reach = parseInt(newPost.reach) || 0;
    const impressions = parseInt(newPost.impressions) || 0;
    const engagement = likes + comments + shares + saves;

    const post = {
      id: editingPost ? editingPost.id : Date.now(),
      ...newPost,
      accountId: newPost.accountId,
      likes,
      comments,
      shares,
      saves,
      reach,
      impressions,
      engagement,
      engagementRate: reach > 0 ? ((engagement / reach) * 100).toFixed(2) : 0,
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? post : p));
      showToastMessage('Post updated successfully!');
    } else {
      setPosts([...posts, post]);
      showToastMessage('Post added successfully!');
    }

    setNewPost({
      accountId: selectedAccount || '',
      caption: '',
      postDate: new Date().toISOString().split('T')[0],
      postTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
      likes: '',
      comments: '',
      shares: '',
      saves: '',
      reach: '',
      impressions: '',
      engagement: '',
      hashtags: '',
      postType: 'photo',
      linkClicks: '',
      profileVisits: '',
      websiteClicks: ''
    });
    setShowPostModal(false);
    setEditingPost(null);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    showToastMessage('Post deleted successfully!');
  };

  const editPost = (post) => {
    setEditingPost(post);
    setNewPost({
      accountId: post.accountId,
      caption: post.caption,
      postDate: post.postDate,
      postTime: post.postTime || '',
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      saves: post.saves,
      reach: post.reach,
      impressions: post.impressions,
      engagement: post.engagement,
      hashtags: post.hashtags || '',
      postType: post.postType || 'photo',
      linkClicks: post.linkClicks || '',
      profileVisits: post.profileVisits || '',
      websiteClicks: post.websiteClicks || ''
    });
    setShowPostModal(true);
  };

  const showToastMessage = (message, type = 'success') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  };

  // OCR Function to extract data from Instagram screenshot
  const processInstagramScreenshot = async (file) => {
    setProcessingOCR(true);
    showToastMessage('Processing screenshot... This may take a moment.', 'info');
    
    try {
      const worker = await createWorker('eng');
      
      // Convert file to image
      const imageUrl = URL.createObjectURL(file);
      const { data: { text } } = await worker.recognize(imageUrl);
      
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);
      
      // Parse the extracted text to find Instagram metrics
      const parsedData = parseInstagramMetrics(text);
      
      // Update the form with extracted data
      setNewPost(prev => ({
        ...prev,
        likes: parsedData.likes || prev.likes,
        comments: parsedData.comments || prev.comments,
        shares: parsedData.shares || prev.shares,
        saves: parsedData.saves || prev.saves,
        reach: parsedData.reach || prev.reach,
        impressions: parsedData.impressions || prev.impressions,
        profileVisits: parsedData.profileVisits || prev.profileVisits,
        websiteClicks: parsedData.websiteClicks || prev.websiteClicks,
        linkClicks: parsedData.linkClicks || prev.linkClicks
      }));
      
      setOcrPreview(text);
      showToastMessage(`Extracted ${Object.keys(parsedData).length} metrics from screenshot! Review and adjust if needed.`, 'success');
    } catch (error) {
      console.error('OCR Error:', error);
      showToastMessage('Failed to process screenshot. Please try again or enter manually.', 'error');
    } finally {
      setProcessingOCR(false);
    }
  };

  // Parse Instagram metrics from OCR text - Tailored for Instagram Insights structure
  const parseInstagramMetrics = (text) => {
    const data = {};
    
    // Enhanced number extraction that handles K/M suffixes (Instagram format: 1.2K, 5.3M)
    const extractNumber = (str) => {
      if (!str) return null;
      
      // Handle Instagram's K/M format (1.2K = 1200, 5.3M = 5300000)
      const kMatch = str.match(/([\d,]+\.?\d*)\s*[kK]/);
      if (kMatch) {
        const num = parseFloat(kMatch[1].replace(/,/g, ''));
        return Math.round(num * 1000);
      }
      
      const mMatch = str.match(/([\d,]+\.?\d*)\s*[mM]/);
      if (mMatch) {
        const num = parseFloat(mMatch[1].replace(/,/g, ''));
        return Math.round(num * 1000000);
      }
      
      // Regular number extraction
      const cleaned = str.replace(/[,\s]/g, '');
      const match = cleaned.match(/(\d+\.?\d*)/);
      return match ? Math.round(parseFloat(match[1])) : null;
    };
    
    // Normalize text for better matching (remove extra spaces, normalize line breaks)
    const normalizedText = text.replace(/\s+/g, ' ').replace(/\n+/g, '\n');
    const lines = normalizedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Instagram Insights specific patterns - ordered by specificity
    const patterns = {
      // Engagement Metrics (most common in post insights)
      likes: [
        // Direct patterns
        /likes?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*likes?/i,
        // Icon patterns (heart emoji or heart icon)
        /[❤️♥️💕]\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*[❤️♥️💕]/i,
        // Instagram UI patterns
        /engagement[\s\S]{0,50}likes?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        // Line-based patterns
        /^likes?$/i,
      ],
      comments: [
        /comments?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*comments?/i,
        /[💬💭]\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*[💬💭]/i,
        /engagement[\s\S]{0,50}comments?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^comments?$/i,
      ],
      shares: [
        /shares?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*shares?/i,
        /sent\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*sent/i,
        /[📤✈️]\s*([\d,\.]+[kKmM]?)/i,
        /engagement[\s\S]{0,50}shares?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^shares?$/i,
      ],
      saves: [
        /saves?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*saves?/i,
        /bookmark[s]?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*bookmark[s]?/i,
        /[🔖📌]\s*([\d,\.]+[kKmM]?)/i,
        /engagement[\s\S]{0,50}saves?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^saves?$/i,
      ],
      
      // Discovery Metrics (Reach & Impressions)
      reach: [
        /reach\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*reach/i,
        /accounts\s*reached\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*accounts\s*reached/i,
        /discovery[\s\S]{0,50}reach[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /discovery[\s\S]{0,50}accounts\s*reached[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^reach$/i,
        /^accounts\s*reached$/i,
      ],
      impressions: [
        /impressions?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*impressions?/i,
        /discovery[\s\S]{0,50}impressions?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^impressions?$/i,
      ],
      
      // Action Metrics
      profileVisits: [
        /profile\s*visits?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*profile\s*visits?/i,
        /actions[\s\S]{0,50}profile\s*visits?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^profile\s*visits?$/i,
      ],
      websiteClicks: [
        /website\s*clicks?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*website\s*clicks?/i,
        /actions[\s\S]{0,50}website\s*clicks?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^website\s*clicks?$/i,
      ],
      linkClicks: [
        /link\s*clicks?\s*:?\s*([\d,\.]+[kKmM]?)/i,
        /([\d,\.]+[kKmM]?)\s*link\s*clicks?/i,
        /actions[\s\S]{0,50}link\s*clicks?[\s\S]{0,20}([\d,\.]+[kKmM]?)/i,
        /^link\s*clicks?$/i,
      ],
    };
    
    // Method 1: Pattern matching (most reliable)
    Object.keys(patterns).forEach(metric => {
      if (data[metric]) return; // Skip if already found
      
      for (const pattern of patterns[metric]) {
        const match = normalizedText.match(pattern);
        if (match) {
          const num = extractNumber(match[1] || match[0]);
          if (num && num > 0) {
            data[metric] = num;
            break;
          }
        }
      }
    });
    
    // Method 2: Context-aware line-by-line parsing (handles Instagram's layout)
    // Instagram Insights typically groups metrics by section
    let currentSection = null;
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      const nextLine = lines[index + 1] || '';
      const prevLine = lines[index - 1] || '';
      
      // Detect Instagram Insights sections
      if (lowerLine.includes('engagement') || lowerLine.includes('interactions')) {
        currentSection = 'engagement';
      } else if (lowerLine.includes('discovery') || lowerLine.includes('accounts reached')) {
        currentSection = 'discovery';
      } else if (lowerLine.includes('actions') || lowerLine.includes('profile visits')) {
        currentSection = 'actions';
      }
      
      // Extract metrics based on context
      const extractMetric = (keyword, metricName, section = null) => {
        if (data[metricName]) return; // Already found
        
        if (lowerLine.includes(keyword)) {
          // Check current line, next line, and previous line for numbers
          const num = extractNumber(line) || extractNumber(nextLine) || extractNumber(prevLine);
          if (num && num > 0) {
            // If section is specified, only extract if in correct section
            if (!section || currentSection === section) {
              data[metricName] = num;
            }
          }
        }
      };
      
      // Engagement section metrics
      extractMetric('like', 'likes', 'engagement');
      extractMetric('comment', 'comments', 'engagement');
      extractMetric('share', 'shares', 'engagement');
      extractMetric('save', 'saves', 'engagement');
      
      // Discovery section metrics
      extractMetric('reach', 'reach', 'discovery');
      extractMetric('impression', 'impressions', 'discovery');
      
      // Actions section metrics
      extractMetric('profile visit', 'profileVisits', 'actions');
      extractMetric('website click', 'websiteClicks', 'actions');
      extractMetric('link click', 'linkClicks', 'actions');
    });
    
    // Method 3: Proximity-based extraction (for cases where label and number are separated)
    // Look for metric labels and find the nearest number
    const metricKeywords = {
      likes: ['like', '❤️', 'heart'],
      comments: ['comment', '💬'],
      shares: ['share', 'sent', '📤'],
      saves: ['save', 'bookmark', '🔖'],
      reach: ['reach', 'accounts reached'],
      impressions: ['impression', 'view'],
      profileVisits: ['profile visit'],
      websiteClicks: ['website click'],
      linkClicks: ['link click']
    };
    
    Object.keys(metricKeywords).forEach(metric => {
      if (data[metric]) return; // Already found
      
      metricKeywords[metric].forEach(keyword => {
        const keywordIndex = normalizedText.toLowerCase().indexOf(keyword.toLowerCase());
        if (keywordIndex !== -1) {
          // Extract text around the keyword (50 chars before and after)
          const start = Math.max(0, keywordIndex - 50);
          const end = Math.min(normalizedText.length, keywordIndex + keyword.length + 50);
          const context = normalizedText.substring(start, end);
          
          // Find numbers in this context
          const numberMatches = context.match(/([\d,\.]+[kKmM]?)/g);
          if (numberMatches && numberMatches.length > 0) {
            // Use the number closest to the keyword
            const num = extractNumber(numberMatches[0]);
            if (num && num > 0) {
              data[metric] = num;
            }
          }
        }
      });
    });
    
    return data;
  };

  const deleteAccount = (id) => {
    if (window.confirm('Are you sure? This will also delete all posts for this account.')) {
      setAccounts(accounts.filter(a => a.id !== id));
      setPosts(posts.filter(p => p.accountId !== id));
      if (selectedAccount === id) {
        setSelectedAccount(accounts.length > 1 ? accounts.find(a => a.id !== id)?.id : null);
      }
      showToastMessage('Account deleted successfully!');
    }
  };

  // Best Posting Times Analysis
  const calculateBestPostingTimes = () => {
    if (currentAccountPosts.length === 0) return null;

    const hourPerformance = {};
    const dayPerformance = {};
    
    // Initialize hours (0-23)
    for (let i = 0; i < 24; i++) {
      hourPerformance[i] = { count: 0, totalEngagement: 0, totalReach: 0, avgEngagementRate: 0 };
    }
    
    // Initialize days (0-6, Sunday-Saturday)
    for (let i = 0; i < 7; i++) {
      dayPerformance[i] = { count: 0, totalEngagement: 0, totalReach: 0, avgEngagementRate: 0 };
    }

    currentAccountPosts.forEach(post => {
      if (post.postDate && post.postTime) {
        const postDateTime = new Date(`${post.postDate}T${post.postTime}`);
        const hour = postDateTime.getHours();
        const day = postDateTime.getDay();
        
        if (hourPerformance[hour]) {
          hourPerformance[hour].count++;
          hourPerformance[hour].totalEngagement += post.engagement || 0;
          hourPerformance[hour].totalReach += post.reach || 0;
        }
        
        if (dayPerformance[day]) {
          dayPerformance[day].count++;
          dayPerformance[day].totalEngagement += post.engagement || 0;
          dayPerformance[day].totalReach += post.reach || 0;
        }
      }
    });

    // Calculate average engagement rates
    Object.keys(hourPerformance).forEach(hour => {
      const data = hourPerformance[hour];
      if (data.totalReach > 0) {
        data.avgEngagementRate = (data.totalEngagement / data.totalReach) * 100;
      }
    });

    Object.keys(dayPerformance).forEach(day => {
      const data = dayPerformance[day];
      if (data.totalReach > 0) {
        data.avgEngagementRate = (data.totalEngagement / data.totalReach) * 100;
      }
    });

    // Find best hours (top 3)
    const bestHours = Object.entries(hourPerformance)
      .filter(([_, data]) => data.count > 0)
      .sort(([_, a], [__, b]) => b.avgEngagementRate - a.avgEngagementRate)
      .slice(0, 3)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        hourFormatted: `${hour}:00`,
        engagementRate: data.avgEngagementRate.toFixed(2),
        count: data.count
      }));

    // Find best days (top 3)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDays = Object.entries(dayPerformance)
      .filter(([_, data]) => data.count > 0)
      .sort(([_, a], [__, b]) => b.avgEngagementRate - a.avgEngagementRate)
      .slice(0, 3)
      .map(([day, data]) => ({
        day: parseInt(day),
        dayName: dayNames[parseInt(day)],
        engagementRate: data.avgEngagementRate.toFixed(2),
        count: data.count
      }));

    return { bestHours, bestDays, hourPerformance, dayPerformance };
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesAccount = !selectedAccount || post.accountId === selectedAccount;
      const matchesSearch = post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.hashtags && post.hashtags.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDate = dateFilter === 'all' || 
                         (dateFilter === 'week' && new Date(post.postDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                         (dateFilter === 'month' && new Date(post.postDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                         (dateFilter === 'year' && new Date(post.postDate) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
      return matchesAccount && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.postDate) - new Date(a.postDate);
        case 'engagement':
          return b.engagement - a.engagement;
        case 'likes':
          return b.likes - a.likes;
        case 'reach':
          return b.reach - a.reach;
        default:
          return 0;
      }
    });

  // Calculate analytics
  const currentAccountPosts = selectedAccount ? posts.filter(p => p.accountId === selectedAccount) : posts;
  const totalPosts = currentAccountPosts.length;
  const totalLikes = currentAccountPosts.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = currentAccountPosts.reduce((sum, p) => sum + p.comments, 0);
  const totalShares = currentAccountPosts.reduce((sum, p) => sum + p.shares, 0);
  const totalSaves = currentAccountPosts.reduce((sum, p) => sum + p.saves, 0);
  const totalReach = currentAccountPosts.reduce((sum, p) => sum + p.reach, 0);
  const totalImpressions = currentAccountPosts.reduce((sum, p) => sum + p.impressions, 0);
  const totalEngagement = currentAccountPosts.reduce((sum, p) => sum + p.engagement, 0);
  const avgEngagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : 0;
  const avgLikes = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(0) : 0;
  const avgComments = totalPosts > 0 ? (totalComments / totalPosts).toFixed(0) : 0;
  const avgReach = totalPosts > 0 ? (totalReach / totalPosts).toFixed(0) : 0;

  // Engagement trends (last 30 days)
  const engagementTrends = {};
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last30Days.push(dateStr);
    engagementTrends[dateStr] = { engagement: 0, likes: 0, comments: 0, reach: 0 };
  }

  currentAccountPosts.forEach(post => {
    if (post.postDate && engagementTrends[post.postDate]) {
      engagementTrends[post.postDate].engagement += post.engagement;
      engagementTrends[post.postDate].likes += post.likes;
      engagementTrends[post.postDate].comments += post.comments;
      engagementTrends[post.postDate].reach += post.reach;
    }
  });

  const engagementChartData = {
    labels: last30Days.map(date => new Date(date).toLocaleDateString()),
    datasets: [{
      label: 'Engagement',
      data: last30Days.map(date => engagementTrends[date].engagement),
      borderColor: 'rgba(225, 48, 108, 1)',
      backgroundColor: 'rgba(225, 48, 108, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Likes',
      data: last30Days.map(date => engagementTrends[date].likes),
      borderColor: 'rgba(255, 255, 255, 0.6)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      tension: 0.4
    }]
  };

  // Post type distribution
  const postTypeData = {};
  currentAccountPosts.forEach(post => {
    postTypeData[post.postType] = (postTypeData[post.postType] || 0) + 1;
  });

  const postTypeChartData = {
    labels: Object.keys(postTypeData),
    datasets: [{
      label: 'Posts by Type',
      data: Object.values(postTypeData),
      backgroundColor: [
        'rgba(225, 48, 108, 0.8)',
        'rgba(255, 255, 255, 0.8)',
        'rgba(150, 150, 150, 0.8)',
        'rgba(100, 100, 100, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1
    }]
  };

  const selectedAccountData = accounts.find(a => a.id === selectedAccount);

  return (
    <div className="instagram-app">
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <div key={toast.id} className={'toast toast-' + toast.type}>
          {toast.message}
        </div>
      ))}

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">
            <Instagram size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Instagram Analytics
          </h1>
        </div>
        <div className="header-actions">
          <button
            className="button"
            onClick={() => {
              setEditingAccount(null);
              setNewAccount({
                username: '',
                displayName: '',
                followers: '',
                following: '',
                bio: '',
                profileImage: ''
              });
              setShowAccountModal(true);
            }}
          >
            <Plus size={16} />
            Add Account
          </button>
          <button
            className="button"
            onClick={() => {
              setEditingPost(null);
              setNewPost({ ...newPost, accountId: selectedAccount || '' });
              setShowPostModal(true);
            }}
          >
            <Plus size={16} />
            Add Post
          </button>
          <button
            className="button secondary"
            onClick={() => setShowSettingsModal(true)}
            title="Settings"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </header>

      {/* Account Selector */}
      {accounts.length > 0 && (
        <div className="account-selector">
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
            className={'nav-button ' + (activeTab === 'overview' ? 'active' : '')}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={20} />
            Overview
          </button>
          <button 
            className={'nav-button ' + (activeTab === 'posts' ? 'active' : '')}
            onClick={() => setActiveTab('posts')}
          >
            <Hash size={20} />
            Posts
          </button>
          <button 
            className={'nav-button ' + (activeTab === 'analytics' ? 'active' : '')}
            onClick={() => setActiveTab('analytics')}
          >
            <Eye size={20} />
            Deep Analytics
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
      </nav>

      {/* Main Content */}
      <main className="main">
        {accounts.length === 0 ? (
          <div className="card empty-state">
            <Instagram size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h2>No Instagram Accounts</h2>
            <p>Add your first Instagram account to start tracking analytics</p>
            <button className="button" onClick={() => setShowAccountModal(true)}>
              <Plus size={16} />
              Add Account
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="tab-content">
                {/* Stats Overview */}
                <div className="stats-grid">
                  <div className="stat">
                    <h3>Total Posts</h3>
                    <p className="stat-value">{totalPosts}</p>
                  </div>
                  <div className="stat">
                    <h3>Total Likes</h3>
                    <p className="stat-value">{totalLikes.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <h3>Total Comments</h3>
                    <p className="stat-value">{totalComments.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <h3>Total Engagement</h3>
                    <p className="stat-value">{totalEngagement.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <h3>Avg Engagement Rate</h3>
                    <p className="stat-value">{avgEngagementRate}%</p>
                  </div>
                  <div className="stat">
                    <h3>Total Reach</h3>
                    <p className="stat-value">{totalReach.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <h3>Total Impressions</h3>
                    <p className="stat-value">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <div className="stat">
                    <h3>Avg Likes/Post</h3>
                    <p className="stat-value">{avgLikes}</p>
                  </div>
                </div>

                {/* Engagement Trends Chart */}
                <div className="card">
                  <h2>Engagement Trends (Last 30 Days)</h2>
                  <div className="chart-container">
                    <Line data={engagementChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' }
                        }
                      },
                      scales: {
                        x: {
                          ticks: { color: '#ffffff', maxTicksLimit: 10 },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                          ticks: { color: '#ffffff' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      }
                    }} />
                  </div>
                </div>

                {/* Post Type Distribution */}
                <div className="card">
                  <h2>Post Type Distribution</h2>
                  <div className="chart-container">
                    <Bar data={postTypeChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' }
                        }
                      },
                      scales: {
                        x: {
                          ticks: { color: '#ffffff' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                          ticks: { color: '#ffffff' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      }
                    }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="tab-content">
                {/* Search and Filters */}
                <div className="card">
                  <div className="search-filter">
                    <div className="search-group">
                      <Search size={20} />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <div className="filter-group">
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="engagement">Sort by Engagement</option>
                        <option value="likes">Sort by Likes</option>
                        <option value="reach">Sort by Reach</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Posts List */}
                <div className="card">
                  <h2>Posts ({filteredPosts.length})</h2>
                  <div className="posts-list">
                    {filteredPosts.map(post => {
                      const account = accounts.find(a => a.id === post.accountId);
                      const engagementRate = post.reach > 0 ? ((post.engagement / post.reach) * 100).toFixed(2) : 0;
                      
                      return (
                        <div key={post.id} className="post-card">
                          <div className="post-header">
                            <div className="post-account">
                              <Instagram size={16} />
                              <span>@{account?.username || 'Unknown'}</span>
                              <span className="post-type-badge">{post.postType}</span>
                            </div>
                            <div className="post-actions">
                              <button onClick={() => editPost(post)} className="icon-button">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => deletePost(post.id)} className="icon-button">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="post-caption">{post.caption}</div>
                          <div className="post-stats">
                            <div className="post-stat">
                              <Heart size={16} />
                              <span>{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="post-stat">
                              <MessageCircle size={16} />
                              <span>{post.comments.toLocaleString()}</span>
                            </div>
                            <div className="post-stat">
                              <Share2 size={16} />
                              <span>{post.shares.toLocaleString()}</span>
                            </div>
                            <div className="post-stat">
                              <Eye size={16} />
                              <span>{post.reach.toLocaleString()} reach</span>
                            </div>
                            <div className="post-stat">
                              <TrendingUp size={16} />
                              <span>{engagementRate}% ER</span>
                            </div>
                          </div>
                          <div className="post-date">{new Date(post.postDate).toLocaleDateString()}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="tab-content">
                {/* Best Posting Times */}
                {(() => {
                  const postingTimes = calculateBestPostingTimes();
                  return postingTimes && postingTimes.bestHours.length > 0 ? (
                    <div className="card">
                      <h2>⏰ Best Posting Times</h2>
                      <div className="posting-times-grid">
                        <div className="posting-times-section">
                          <h3>Best Hours</h3>
                          <div className="best-times-list">
                            {postingTimes.bestHours.map((item, index) => (
                              <div key={index} className="best-time-item">
                                <div className="best-time-hour">{item.hourFormatted}</div>
                                <div className="best-time-stats">
                                  <span className="best-time-rate">{item.engagementRate}% ER</span>
                                  <span className="best-time-count">{item.count} posts</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="posting-times-section">
                          <h3>Best Days</h3>
                          <div className="best-times-list">
                            {postingTimes.bestDays.map((item, index) => (
                              <div key={index} className="best-time-item">
                                <div className="best-time-hour">{item.dayName}</div>
                                <div className="best-time-stats">
                                  <span className="best-time-rate">{item.engagementRate}% ER</span>
                                  <span className="best-time-count">{item.count} posts</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="vat-note" style={{ marginTop: '1.5rem' }}>
                        💡 Based on your historical post performance. Post during these times for optimal engagement!
                      </p>
                    </div>
                  ) : (
                    <div className="card">
                      <h2>⏰ Best Posting Times</h2>
                      <p className="vat-note">
                        Add posts with date and time information to see your best posting times analysis.
                      </p>
                    </div>
                  );
                })()}

                {/* Best Performing Posts */}
                <div className="card">
                  <h2>🏆 Top Performing Posts</h2>
                  <div className="top-posts-list">
                    {[...currentAccountPosts]
                      .sort((a, b) => b.engagement - a.engagement)
                      .slice(0, 10)
                      .map((post, index) => {
                        const account = accounts.find(a => a.id === post.accountId);
                        const engagementRate = post.reach > 0 ? ((post.engagement / post.reach) * 100).toFixed(2) : 0;
                        return (
                          <div key={post.id} className="top-post-item">
                            <div className="top-post-rank">#{index + 1}</div>
                            <div className="top-post-content">
                              <div className="top-post-header">
                                <span className="top-post-caption">{post.caption.substring(0, 100)}...</span>
                                <span className="top-post-type">{post.postType}</span>
                              </div>
                              <div className="top-post-metrics">
                                <div className="metric-item">
                                  <Heart size={14} />
                                  <span>{post.likes.toLocaleString()}</span>
                                </div>
                                <div className="metric-item">
                                  <MessageCircle size={14} />
                                  <span>{post.comments.toLocaleString()}</span>
                                </div>
                                <div className="metric-item">
                                  <Share2 size={14} />
                                  <span>{post.shares.toLocaleString()}</span>
                                </div>
                                <div className="metric-item">
                                  <TrendingUp size={14} />
                                  <span>{post.engagement.toLocaleString()} total</span>
                                </div>
                                <div className="metric-item">
                                  <Eye size={14} />
                                  <span>{engagementRate}% ER</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Engagement Rate Analysis */}
                <div className="card">
                  <h2>Engagement Rate Analysis</h2>
                  <div className="analytics-grid">
                    <div className="analytics-item">
                      <h3>Average Engagement Rate</h3>
                      <p className="analytics-value">{avgEngagementRate}%</p>
                      <p className="analytics-label">Across all posts</p>
                    </div>
                    <div className="analytics-item">
                      <h3>Best Engagement Rate</h3>
                      <p className="analytics-value">
                        {currentAccountPosts.length > 0 
                          ? Math.max(...currentAccountPosts.map(p => p.reach > 0 ? ((p.engagement / p.reach) * 100) : 0)).toFixed(2)
                          : 0}%
                      </p>
                      <p className="analytics-label">Single post peak</p>
                    </div>
                    <div className="analytics-item">
                      <h3>Total Reach</h3>
                      <p className="analytics-value">{totalReach.toLocaleString()}</p>
                      <p className="analytics-label">Unique accounts reached</p>
                    </div>
                    <div className="analytics-item">
                      <h3>Total Impressions</h3>
                      <p className="analytics-value">{totalImpressions.toLocaleString()}</p>
                      <p className="analytics-label">Total views</p>
                    </div>
                  </div>
                </div>

                {/* Post Type Performance */}
                <div className="card">
                  <h2>Post Type Performance</h2>
                  <div className="post-type-performance">
                    {Object.keys(postTypeData).map(type => {
                      const typePosts = currentAccountPosts.filter(p => p.postType === type);
                      const typeEngagement = typePosts.reduce((sum, p) => sum + p.engagement, 0);
                      const typeReach = typePosts.reduce((sum, p) => sum + p.reach, 0);
                      const typeER = typeReach > 0 ? ((typeEngagement / typeReach) * 100).toFixed(2) : 0;
                      const avgEngagement = typePosts.length > 0 ? (typeEngagement / typePosts.length).toFixed(0) : 0;
                      
                      return (
                        <div key={type} className="post-type-card">
                          <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                          <div className="post-type-stats">
                            <div className="post-type-stat">
                              <span>Posts:</span>
                              <span>{typePosts.length}</span>
                            </div>
                            <div className="post-type-stat">
                              <span>Avg Engagement:</span>
                              <span>{avgEngagement}</span>
                            </div>
                            <div className="post-type-stat">
                              <span>Engagement Rate:</span>
                              <span>{typeER}%</span>
                            </div>
                            <div className="post-type-stat">
                              <span>Total Reach:</span>
                              <span>{typeReach.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time-based Performance */}
                <div className="card">
                  <h2>Performance Over Time</h2>
                  <div className="chart-container">
                    <Line data={engagementChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: { color: '#ffffff' }
                        },
                        title: {
                          display: true,
                          text: 'Daily Engagement & Likes (Last 30 Days)',
                          color: '#ffffff'
                        }
                      },
                      scales: {
                        x: {
                          ticks: { color: '#ffffff', maxTicksLimit: 10 },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                          ticks: { color: '#ffffff' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      }
                    }} />
                  </div>
                </div>

                {/* Hashtag Analysis */}
                <div className="card">
                  <h2>Hashtag Performance</h2>
                  {(() => {
                    const hashtagData = {};
                    currentAccountPosts.forEach(post => {
                      if (post.hashtags) {
                        const hashtags = post.hashtags.match(/#\w+/g) || [];
                        hashtags.forEach(tag => {
                          if (!hashtagData[tag]) {
                            hashtagData[tag] = { count: 0, totalEngagement: 0, posts: [] };
                          }
                          hashtagData[tag].count++;
                          hashtagData[tag].totalEngagement += post.engagement;
                          hashtagData[tag].posts.push(post.id);
                        });
                      }
                    });

                    const sortedHashtags = Object.entries(hashtagData)
                      .sort((a, b) => b[1].totalEngagement - a[1].totalEngagement)
                      .slice(0, 20);

                    return sortedHashtags.length > 0 ? (
                      <div className="hashtag-list">
                        {sortedHashtags.map(([tag, data]) => (
                          <div key={tag} className="hashtag-item">
                            <div className="hashtag-name">{tag}</div>
                            <div className="hashtag-stats">
                              <span>{data.count} posts</span>
                              <span>{data.totalEngagement.toLocaleString()} engagement</span>
                              <span>{(data.totalEngagement / data.count).toFixed(0)} avg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="vat-note">No hashtags found in posts</p>
                    );
                  })()}
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingAccount ? 'Edit Instagram Account' : 'Add Instagram Account'}</h2>
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={newAccount.username}
                onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                className="input-field"
                placeholder="@username"
              />
            </div>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={newAccount.displayName}
                onChange={(e) => setNewAccount({...newAccount, displayName: e.target.value})}
                className="input-field"
                placeholder="Display name"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Followers</label>
                <input
                  type="number"
                  value={newAccount.followers}
                  onChange={(e) => setNewAccount({...newAccount, followers: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Following</label>
                <input
                  type="number"
                  value={newAccount.following}
                  onChange={(e) => setNewAccount({...newAccount, following: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={newAccount.bio}
                onChange={(e) => setNewAccount({...newAccount, bio: e.target.value})}
                className="input-field"
                placeholder="Account bio"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={addAccount} className="button">
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
              <button onClick={() => {
                setShowAccountModal(false);
                setEditingAccount(null);
                setNewAccount({
                  username: '',
                  displayName: '',
                  followers: '',
                  following: '',
                  bio: '',
                  profileImage: ''
                });
              }} className="button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingPost ? 'Edit Post' : 'Add Post'}</h2>
            <div className="form-group">
              <label>Account *</label>
              <select
                value={newPost.accountId}
                onChange={(e) => setNewPost({...newPost, accountId: e.target.value})}
                className="input-field"
              >
                <option value="">Select account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>@{acc.username}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Caption *</label>
              <textarea
                value={newPost.caption}
                onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                className="input-field"
                placeholder="Post caption..."
                rows="4"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Post Date *</label>
                <input
                  type="date"
                  value={newPost.postDate}
                  onChange={(e) => setNewPost({...newPost, postDate: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Post Time</label>
                <input
                  type="time"
                  value={newPost.postTime}
                  onChange={(e) => setNewPost({...newPost, postTime: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Post Type</label>
              <select
                value={newPost.postType}
                onChange={(e) => setNewPost({...newPost, postType: e.target.value})}
                className="input-field"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="carousel">Carousel</option>
                <option value="reel">Reel</option>
              </select>
            </div>

            {/* OCR Screenshot Upload */}
            <div className="form-group">
              <label>📸 Upload Instagram Analytics Screenshot (Auto-fill)</label>
              <div className="ocr-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      processInstagramScreenshot(file);
                    }
                  }}
                  className="image-upload-input"
                  id="ocr-screenshot-upload"
                  disabled={processingOCR}
                />
                <label htmlFor="ocr-screenshot-upload" className="ocr-upload-button">
                  {processingOCR ? (
                    <>
                      <Loader size={16} className="spinning" />
                      <span>Processing Screenshot...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={16} />
                      <span>Upload Analytics Screenshot</span>
                    </>
                  )}
                </label>
                <p className="ocr-help-text">
                  💡 Tip: Take a screenshot of your Instagram post insights page and upload it here. The app will automatically extract metrics like likes, comments, reach, impressions, etc.
                </p>
              </div>
              {ocrPreview && (
                <div className="ocr-preview">
                  <details>
                    <summary>View Extracted Text (for debugging)</summary>
                    <pre className="ocr-text-preview">{ocrPreview}</pre>
                  </details>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Likes</label>
                <input
                  type="number"
                  value={newPost.likes}
                  onChange={(e) => setNewPost({...newPost, likes: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Comments</label>
                <input
                  type="number"
                  value={newPost.comments}
                  onChange={(e) => setNewPost({...newPost, comments: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shares</label>
                <input
                  type="number"
                  value={newPost.shares}
                  onChange={(e) => setNewPost({...newPost, shares: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Saves</label>
                <input
                  type="number"
                  value={newPost.saves}
                  onChange={(e) => setNewPost({...newPost, saves: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Reach</label>
                <input
                  type="number"
                  value={newPost.reach}
                  onChange={(e) => setNewPost({...newPost, reach: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Impressions</label>
                <input
                  type="number"
                  value={newPost.impressions}
                  onChange={(e) => setNewPost({...newPost, impressions: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Link Clicks</label>
                <input
                  type="number"
                  value={newPost.linkClicks}
                  onChange={(e) => setNewPost({...newPost, linkClicks: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Profile Visits</label>
                <input
                  type="number"
                  value={newPost.profileVisits}
                  onChange={(e) => setNewPost({...newPost, profileVisits: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Hashtags</label>
              <input
                type="text"
                value={newPost.hashtags}
                onChange={(e) => setNewPost({...newPost, hashtags: e.target.value})}
                className="input-field"
                placeholder="#hashtag1 #hashtag2"
              />
            </div>
            <div className="modal-actions">
              <button onClick={addPost} className="button">
                {editingPost ? 'Update Post' : 'Add Post'}
              </button>
              <button onClick={() => {
                setShowPostModal(false);
                setEditingPost(null);
              }} className="button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Account Settings</h2>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="icon-button"
                style={{ background: 'transparent', border: 'none' }}
              >
                <X size={24} />
              </button>
            </div>
            
            {accounts.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
                <Instagram size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No accounts yet. Add your first account to get started.</p>
              </div>
            ) : (
              <div className="settings-accounts-list">
                {accounts.map(account => {
                  const accountPosts = posts.filter(p => p.accountId === account.id);
                  return (
                    <div key={account.id} className="settings-account-item">
                      <div className="settings-account-info">
                        <div className="settings-account-header">
                          <Instagram size={20} />
                          <div>
                            <h3>@{account.username}</h3>
                            {account.displayName && (
                              <p className="settings-account-display">{account.displayName}</p>
                            )}
                          </div>
                        </div>
                        <div className="settings-account-stats">
                          {account.followers > 0 && (
                            <span className="settings-stat">
                              <Users size={14} />
                              {account.followers.toLocaleString()} followers
                            </span>
                          )}
                          <span className="settings-stat">
                            {accountPosts.length} {accountPosts.length === 1 ? 'post' : 'posts'}
                          </span>
                        </div>
                        {account.bio && (
                          <p className="settings-account-bio">{account.bio}</p>
                        )}
                      </div>
                      <div className="settings-account-actions">
                        <button
                          onClick={() => {
                            editAccount(account);
                            setShowSettingsModal(false);
                          }}
                          className="button"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete @${account.username}? This will also delete all ${accountPosts.length} posts for this account.`)) {
                              deleteAccount(account.id);
                              if (accounts.length === 1) {
                                setShowSettingsModal(false);
                              }
                            }
                          }}
                          className="button secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="modal-actions" style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button onClick={() => setShowSettingsModal(false)} className="button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstagramAnalytics;

