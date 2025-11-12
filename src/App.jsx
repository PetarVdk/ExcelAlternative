import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { DollarSign, Package, Plus, Trash2, Search, Filter, Download, Upload, ArrowUpDown, X } from 'lucide-react';
import './App.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FinanceInventoryApp = () => {
  const [activeTab, setActiveTab] = useState('finances');
  const [finances, setFinances] = useState([]);
  const [inventory, setInventory] = useState([
    {
      id: 1,
      brand: 'Nike',
      item: 'Air Jordan 1',
      purchasePrice: 120.00,
      estimatedValue: 180.00,
      sellPrice: 180.00,
      profit: 60.00,
      size: '10',
      condition: 'Like New',
      status: 'sold',
      sellDate: '2024-01-15',
      notes: 'Great condition, sold quickly',
      images: []
    },
    {
      id: 2,
      brand: 'Adidas',
      item: 'Yeezy Boost 350',
      purchasePrice: 200.00,
      estimatedValue: 250.00,
      sellPrice: 250.00,
      profit: 50.00,
      size: '9.5',
      condition: 'New',
      status: 'sold',
      sellDate: '2024-01-20',
      notes: 'Brand new with tags',
      images: []
    },
    {
      id: 3,
      brand: 'Supreme',
      item: 'Box Logo Hoodie',
      purchasePrice: 150.00,
      estimatedValue: 300.00,
      sellPrice: 300.00,
      profit: 150.00,
      size: 'L',
      condition: 'Good',
      status: 'sold',
      sellDate: '2024-01-25',
      notes: 'Classic piece, high demand',
      images: []
    }
  ]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newItem, setNewItem] = useState({
    brand: '',
    item: '',
    purchasePrice: '',
    estimatedValue: '',
    size: '',
    condition: '',
    notes: '',
    images: []
  });
  const [showSellModal, setShowSellModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeValue, setTradeValue] = useState('');
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [tradeDetails, setTradeDetails] = useState({ cashReceived: '', itemsReceived: '' });
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showHistoricalSaleModal, setShowHistoricalSaleModal] = useState(false);
  const [historicalSale, setHistoricalSale] = useState({
    brand: '',
    item: '',
    purchasePrice: '',
    estimatedValue: '',
    sellPrice: '',
    sellDate: '',
    size: '',
    condition: '',
    notes: '',
    images: []
  });

  const ultraSimpleCompress = (file) => {
    return new Promise((resolve, reject) => {
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const timeout = setTimeout(() => {
          reject(new Error('Ultra-simple compression timeout'));
        }, 5000); // 5 second timeout
        
        img.onload = () => {
          try {
            clearTimeout(timeout);
            
            // Fixed small size
            canvas.width = 100;
            canvas.height = 100;
            
            ctx.drawImage(img, 0, 0, 100, 100);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.1);
            
            
            resolve(compressedDataUrl);
          } catch (error) {
            clearTimeout(timeout);
            reject(error);
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeout);
          reject(new Error('Failed to load image in ultra-simple fallback'));
        };
        
        // Use FileReader instead of blob URL to avoid CSP issues
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = (error) => {
          clearTimeout(timeout);
          reject(new Error('Failed to read file in ultra-simple fallback'));
        };
        reader.readAsDataURL(file);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const simpleCompress = (file) => {
    return new Promise((resolve, reject) => {
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const timeout = setTimeout(() => {
          reject(new Error('Simple compression timeout'));
        }, 10000); // 10 second timeout
        
        img.onload = () => {
          try {
            clearTimeout(timeout);
            
            // Very small dimensions for fallback
            const maxSize = 150;
            let { width, height } = img;
            
            
            if (width > height) {
              if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.2);
            
            
            resolve(compressedDataUrl);
          } catch (error) {
            clearTimeout(timeout);
            reject(error);
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeout);
          reject(new Error('Failed to load image in fallback'));
        };
        
        // Use FileReader instead of blob URL to avoid CSP issues
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = (error) => {
          clearTimeout(timeout);
          reject(new Error('Failed to read file in simple compression'));
        };
        reader.readAsDataURL(file);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const compressImage = (file, maxWidth = 1600, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Image compression timeout'));
      }, 30000); // 30 second timeout
      
      img.onload = () => {
        try {
          clearTimeout(timeout);
          
          // Calculate new dimensions - more aggressive resizing for large images
          let { width, height } = img;
          
          // Adaptive compression based on file size
          if (file.size > 100 * 1024 * 1024) { // 100MB+
            maxWidth = 800;
            quality = 0.6;
          } else if (file.size > 50 * 1024 * 1024) { // 50MB+
            maxWidth = 1000;
            quality = 0.7;
          } else if (file.size > 20 * 1024 * 1024) { // 20MB+
            maxWidth = 1200;
            quality = 0.8;
          }
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Use the calculated quality without aggressive compression
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          
          
          resolve(compressedDataUrl);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };
      
      // Use FileReader instead of blob URL to avoid CSP issues
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error('Failed to read file in main compression'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.type.startsWith('image/')) {
          // Basic file validation
          if (!file || file.size === 0) {
            showToastMessage(`Image ${i + 1} is empty or corrupted. Skipping...`, 'error');
            continue;
          }
          
          // Show progress for large files
          if (file.size > 20 * 1024 * 1024) {
            showToastMessage(`Processing image ${i + 1}/${files.length}: ${(file.size / (1024 * 1024)).toFixed(1)}MB...`, 'info');
          }
          
          console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
          
          try {
            // Compress the image with adaptive settings
            const compressedImage = await compressImage(file);
            
            // Check if compression was successful
            if (compressedImage && compressedImage.length > 0) {
              setNewItem(prev => ({
                ...prev,
                images: [...prev.images, compressedImage]
              }));
              
              const originalSize = (file.size / (1024 * 1024)).toFixed(1);
              const compressedSize = (compressedImage.length / (1024 * 1024)).toFixed(1);
              showToastMessage(`Image ${i + 1} compressed: ${originalSize}MB → ${compressedSize}MB`);
            } else {
              showToastMessage(`Failed to compress image ${i + 1}. Skipping...`, 'error');
            }
          } catch (compressionError) {
            console.error('Compression error for file:', file.name, compressionError);
            
            // Try a simple fallback compression
            try {
              showToastMessage(`Trying fallback compression for image ${i + 1}...`, 'info');
              const fallbackImage = await simpleCompress(file);
              
              if (fallbackImage && fallbackImage.length > 0) {
                setNewItem(prev => ({
                  ...prev,
                  images: [...prev.images, fallbackImage]
                }));
                
                const originalSize = (file.size / (1024 * 1024)).toFixed(1);
                const compressedSize = (fallbackImage.length / (1024 * 1024)).toFixed(1);
                showToastMessage(`Image ${i + 1} compressed (fallback): ${originalSize}MB → ${compressedSize}MB`);
              } else {
                showToastMessage(`Failed to process image ${i + 1} even with fallback. Skipping...`, 'error');
              }
            } catch (fallbackError) {
              console.error('Fallback compression also failed:', fallbackError);
              
              // Try ultra-simple compression as last resort
              try {
                showToastMessage(`Trying ultra-simple compression for image ${i + 1}...`, 'info');
                const ultraSimpleImage = await ultraSimpleCompress(file);
                
                if (ultraSimpleImage && ultraSimpleImage.length > 0) {
                  setNewItem(prev => ({
                    ...prev,
                    images: [...prev.images, ultraSimpleImage]
                  }));
                  
                  const originalSize = (file.size / (1024 * 1024)).toFixed(1);
                  const compressedSize = (ultraSimpleImage.length / (1024 * 1024)).toFixed(1);
                  showToastMessage(`Image ${i + 1} compressed (ultra-simple): ${originalSize}MB → ${compressedSize}MB`);
                } else {
                  showToastMessage(`Failed to process image ${i + 1} with all methods. Skipping...`, 'error');
                }
              } catch (ultraError) {
                console.error('Ultra-simple compression also failed:', ultraError);
                if (compressionError.message.includes('timeout')) {
                  showToastMessage(`Image ${i + 1} too large or complex. Please try a smaller image.`, 'error');
                } else {
                  showToastMessage(`Failed to process image ${i + 1}. Skipping...`, 'error');
                }
              }
            }
          }
        } else {
          showToastMessage(`File ${i + 1} is not an image. Skipping...`, 'error');
        }
      }
    } catch (error) {
      showToastMessage('Error processing images. Please try again.', 'error');
      console.error('Image processing error:', error);
    }
    
    setUploadingImages(false);
  };

  const removeImage = (index) => {
    setNewItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleHistoricalImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.type.startsWith('image/')) {
          // Basic file validation
          if (!file || file.size === 0) {
            showToastMessage(`Image ${i + 1} is empty or corrupted. Skipping...`, 'error');
            continue;
          }
          
          // Show progress for large files
          if (file.size > 20 * 1024 * 1024) {
            showToastMessage(`Processing image ${i + 1}/${files.length}: ${(file.size / (1024 * 1024)).toFixed(1)}MB...`, 'info');
          }
          
          console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
          
          try {
            // Compress the image with adaptive settings
            const compressedImage = await compressImage(file);
            
            // Check if compression was successful
            if (compressedImage && compressedImage.length > 0) {
              setHistoricalSale(prev => ({
                ...prev,
                images: [...prev.images, compressedImage]
              }));
              
              const originalSize = (file.size / (1024 * 1024)).toFixed(1);
              const compressedSize = (compressedImage.length / (1024 * 1024)).toFixed(1);
              showToastMessage(`Image ${i + 1} compressed: ${originalSize}MB → ${compressedSize}MB`);
            } else {
              showToastMessage(`Failed to compress image ${i + 1}. Skipping...`, 'error');
            }
          } catch (compressionError) {
            console.error('Compression error for file:', file.name, compressionError);
            
            // Try a simple fallback compression
            try {
              showToastMessage(`Trying fallback compression for image ${i + 1}...`, 'info');
              const fallbackImage = await ultraSimpleCompress(file);
              
              if (fallbackImage && fallbackImage.length > 0) {
                setHistoricalSale(prev => ({
                  ...prev,
                  images: [...prev.images, fallbackImage]
                }));
                showToastMessage(`Image ${i + 1} processed with fallback compression`);
              } else {
                showToastMessage(`Failed to process image ${i + 1}. Skipping...`, 'error');
              }
            } catch (fallbackError) {
              console.error('Fallback compression failed for file:', file.name, fallbackError);
              showToastMessage(`Could not process image ${i + 1}. Skipping...`, 'error');
            }
          }
        } else {
          showToastMessage(`File ${i + 1} is not an image. Skipping...`, 'error');
        }
      }
    } catch (error) {
      showToastMessage('Error processing images. Please try again.', 'error');
      console.error('Image processing error:', error);
    }
    
    setUploadingImages(false);
  };

  const removeHistoricalImage = (index) => {
    setHistoricalSale(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Update existing sold/traded items with correct profit calculation
  const updateExistingItemsProfit = () => {
    const updatedInventory = inventory.map(item => {
      if (item.status === 'sold' && item.sellPrice && item.purchasePrice) {
        return {
          ...item,
          profit: item.sellPrice - item.purchasePrice
        };
      }
      if (item.status === 'traded' && item.tradeValue && item.purchasePrice) {
        return {
          ...item,
          profit: item.tradeValue - item.purchasePrice
        };
      }
      return item;
    });
    
    if (JSON.stringify(updatedInventory) !== JSON.stringify(inventory)) {
      setInventory(updatedInventory);
      showToastMessage('Updated existing items with correct profit calculations!');
    }
  };

  const resetToSampleData = () => {
    const sampleFinances = [];

    const sampleInventory = [
      {
        id: 1,
        brand: 'Nike',
        item: 'Air Jordan 1',
        purchasePrice: 120.00,
        estimatedValue: 180.00,
        sellPrice: 180.00,
        profit: 60.00,
        size: '10',
        condition: 'Like New',
        status: 'sold',
        sellDate: '2024-01-15',
        notes: 'Great condition, sold quickly',
        images: []
      },
      {
        id: 2,
        brand: 'Adidas',
        item: 'Yeezy Boost 350',
        purchasePrice: 200.00,
        estimatedValue: 250.00,
        sellPrice: 250.00,
        profit: 50.00,
        size: '9.5',
        condition: 'New',
        status: 'sold',
        sellDate: '2024-01-20',
        notes: 'Brand new with tags',
        images: []
      },
      {
        id: 3,
        brand: 'Supreme',
        item: 'Box Logo Hoodie',
        purchasePrice: 150.00,
        estimatedValue: 300.00,
        sellPrice: 300.00,
        profit: 150.00,
        size: 'L',
        condition: 'Good',
        status: 'sold',
        sellDate: '2024-01-25',
        notes: 'Classic piece, high demand',
        images: []
      }
    ];

    // Create income transactions for the sold items
    const incomeTransactions = sampleInventory
      .filter(item => item.status === 'sold')
      .map(item => ({
        id: Date.now() + Math.random(),
        type: 'income',
        amount: item.sellPrice,
        description: 'Sold: ' + item.brand + ' ' + item.item,
        date: item.sellDate
      }));

    setFinances(incomeTransactions);
    setInventory(sampleInventory);
    showToastMessage('Reset to sample data!');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      localStorage.clear();
      setFinances([]);
      setInventory([]);
      showToastMessage('All data cleared!');
    }
  };

  const formatStorageSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFinances = localStorage.getItem('finances');
    const savedInventory = localStorage.getItem('inventory');
    
    // Only load from localStorage if it exists, otherwise use initial state
    if (savedFinances && savedFinances !== '[]') {
      setFinances(JSON.parse(savedFinances));
    }
    if (savedInventory && savedInventory !== '[]') {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Storage management
  const getStorageUsage = () => {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  };

  const checkStorageLimit = () => {
    // No storage limit - use available local storage
    return true;
  };

  // Save data to localStorage whenever finances or inventory changes
  useEffect(() => {
    localStorage.setItem('finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  const showToastMessage = (message, type = 'success') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  };


  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };

    setFinances([...finances, transaction]);
    setNewTransaction({
      type: 'income',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    showToastMessage(newTransaction.type + ' transaction added successfully!');
  };

  const addInventoryItem = () => {
    if (!newItem.brand || !newItem.item || !newItem.purchasePrice || !newItem.estimatedValue) {
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    const item = {
      id: Date.now(),
      ...newItem,
      purchasePrice: parseFloat(newItem.purchasePrice),
      estimatedValue: parseFloat(newItem.estimatedValue),
      status: 'in-stock',
      images: newItem.images || []
    };

    setInventory([...inventory, item]);
    setNewItem({
      brand: '',
      item: '',
      purchasePrice: '',
      estimatedValue: '',
      size: '',
      condition: '',
      notes: '',
      images: []
    });
    showToastMessage('Inventory item added successfully!');
  };

  const markAsSold = () => {
    if (!sellPrice) {
      showToastMessage('Please enter a sell price', 'error');
      return;
    }

    const sellPriceNum = parseFloat(sellPrice);
    const profit = sellPriceNum - selectedItem.purchasePrice;

    const updatedItem = {
      ...selectedItem,
      status: 'sold',
      sellPrice: sellPriceNum,
      profit: profit,
      sellDate: sellDate
    };

    setInventory(inventory.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    ));

    // Add sale transaction
    const saleTransaction = {
      id: Date.now(),
      type: 'income',
      amount: sellPriceNum,
      description: 'Sold: ' + selectedItem.brand + ' ' + selectedItem.item,
      date: sellDate
    };

    setFinances([...finances, saleTransaction]);
    setShowSellModal(false);
    setSellPrice('');
    setSellDate(new Date().toISOString().split('T')[0]);
    setSelectedItem(null);
    showToastMessage('Item marked as sold!');
  };

  const processTrade = () => {
    if (!tradeValue) {
      showToastMessage('Please enter trade value', 'error');
      return;
    }

    const tradeValueNum = parseFloat(tradeValue);
    const profit = tradeValueNum - selectedItem.purchasePrice;

    const updatedItem = {
      ...selectedItem,
      status: 'traded',
      tradeValue: tradeValueNum,
      profit: profit,
      tradeDetails: tradeDetails,
      tradeDate: tradeDate
    };

    setInventory(inventory.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    ));

    // Add trade transaction
    const tradeTransaction = {
      id: Date.now(),
      type: 'income',
      amount: tradeValueNum,
      description: 'Traded: ' + selectedItem.brand + ' ' + selectedItem.item,
      date: tradeDate
    };

    setFinances([...finances, tradeTransaction]);
    setShowTradeModal(false);
    setTradeValue('');
    setTradeDate(new Date().toISOString().split('T')[0]);
    setTradeDetails({ cashReceived: '', itemsReceived: '' });
    setSelectedItem(null);
    showToastMessage('Item marked as traded!');
  };

  const addHistoricalSale = () => {
    if (!historicalSale.brand || !historicalSale.item || !historicalSale.purchasePrice || 
        !historicalSale.sellPrice || !historicalSale.sellDate) {
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    const purchasePriceNum = parseFloat(historicalSale.purchasePrice);
    const sellPriceNum = parseFloat(historicalSale.sellPrice);
    const profit = sellPriceNum - purchasePriceNum;

    const item = {
      id: Date.now(),
      brand: historicalSale.brand,
      item: historicalSale.item,
      purchasePrice: purchasePriceNum,
      estimatedValue: parseFloat(historicalSale.estimatedValue) || 0,
      sellPrice: sellPriceNum,
      profit: profit,
      size: historicalSale.size,
      condition: historicalSale.condition,
      notes: historicalSale.notes,
      status: 'sold',
      sellDate: historicalSale.sellDate,
      images: historicalSale.images || []
    };

    setInventory([...inventory, item]);

    // Add sale transaction
    const saleTransaction = {
      id: Date.now(),
      type: 'income',
      amount: sellPriceNum,
      description: 'Sold: ' + historicalSale.brand + ' ' + historicalSale.item,
      date: historicalSale.sellDate
    };

    setFinances([...finances, saleTransaction]);

    // Reset form
    setHistoricalSale({
      brand: '',
      item: '',
      purchasePrice: '',
      estimatedValue: '',
      sellPrice: '',
      sellDate: '',
      size: '',
      condition: '',
      notes: '',
      images: []
    });

    setShowHistoricalSaleModal(false);
    showToastMessage('Historical sale added successfully!');
  };

  const deleteTransaction = (id) => {
    setFinances(finances.filter(t => t.id !== id));
    showToastMessage('Transaction deleted successfully!');
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    showToastMessage('Inventory item deleted successfully!');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const exportToCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Type,Amount,Description,Date\n" +
      finances.map(t => t.type + "," + t.amount + "," + t.description + "," + t.date).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finances.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMessage('Financial data exported to CSV!');
  };

  const exportToJson = () => {
    const data = { finances, inventory };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-inventory-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToastMessage('Data exported to JSON!');
  };

  const importFromJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.finances) setFinances(data.finances);
        if (data.inventory) setInventory(data.inventory);
        showToastMessage('Data imported successfully!');
      } catch (error) {
        showToastMessage('Error importing file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const openItemDetail = (item) => {
    setSelectedItemDetail(item);
    setCurrentImageIndex(0);
    setShowItemDetail(true);
  };

  const nextImage = () => {
    if (selectedItemDetail && selectedItemDetail.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedItemDetail.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedItemDetail && selectedItemDetail.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItemDetail.images.length - 1 : prev - 1
      );
    }
  };

  // Filter and sort inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'brand':
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
        break;
      case 'price':
        aValue = a.purchasePrice;
        bValue = b.purchasePrice;
        break;
      case 'date':
        aValue = new Date(a.id);
        bValue = new Date(b.id);
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Separate inventory by status
  const inStockItems = filteredInventory.filter(item => item.status === 'in-stock');
  const soldItems = filteredInventory.filter(item => item.status === 'sold');
  const tradedItems = filteredInventory.filter(item => item.status === 'traded');

  // Calculate totals
  const totalIncome = finances.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = finances.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate net profit as sum of all individual item profits (sale price - purchase price)
  const totalItemProfit = [...soldItems, ...tradedItems].reduce((sum, item) => {
    if (item.status === 'sold' && item.sellPrice && item.purchasePrice) {
      return sum + (item.sellPrice - item.purchasePrice);
    }
    if (item.status === 'traded' && item.tradeValue && item.purchasePrice) {
      return sum + (item.tradeValue - item.purchasePrice);
    }
    return sum;
  }, 0);
  
  const netProfit = totalItemProfit;
  
  // Calculate current stock worth (using estimated values)
  const currentStockWorth = inStockItems.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  
  // Calculate current money invested (using purchase prices)
  const currentMoneyInvested = inStockItems.reduce((sum, item) => sum + item.purchasePrice, 0);

  // Advanced Analytics Calculations
  const brandProfitAnalysis = {};
  const brandROIAnalysis = {};
  const brandItemCount = {};
  
  [...soldItems, ...tradedItems].forEach(item => {
    const brand = item.brand;
    const profit = item.profit || 0;
    const purchasePrice = item.purchasePrice || 0;
    const roi = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0;
    
    if (!brandProfitAnalysis[brand]) {
      brandProfitAnalysis[brand] = 0;
      brandROIAnalysis[brand] = [];
      brandItemCount[brand] = 0;
    }
    
    brandProfitAnalysis[brand] += profit;
    brandROIAnalysis[brand].push(roi);
    brandItemCount[brand]++;
  });

  // Calculate average ROI per brand
  const brandAverageROI = {};
  Object.keys(brandROIAnalysis).forEach(brand => {
    const rois = brandROIAnalysis[brand];
    brandAverageROI[brand] = rois.reduce((sum, roi) => sum + roi, 0) / rois.length;
  });

  // Best and worst performing items
  const allSoldTradedItems = [...soldItems, ...tradedItems].filter(item => item.profit !== null);
  const bestPerformers = [...allSoldTradedItems]
    .sort((a, b) => (b.profit || 0) - (a.profit || 0))
    .slice(0, 5);
  
  const worstPerformers = [...allSoldTradedItems]
    .sort((a, b) => (a.profit || 0) - (b.profit || 0))
    .slice(0, 5);

  // Profit trends (last 30 days)
  const profitTrends = {};
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last30Days.push(dateStr);
    profitTrends[dateStr] = 0;
  }

  allSoldTradedItems.forEach(item => {
    if (item.sellDate && profitTrends.hasOwnProperty(item.sellDate)) {
      profitTrends[item.sellDate] += item.profit || 0;
    }
    if (item.tradeDate && profitTrends.hasOwnProperty(item.tradeDate)) {
      profitTrends[item.tradeDate] += item.profit || 0;
    }
  });

  // Chart data
  const brandSales = {};
  soldItems.forEach(item => {
    brandSales[item.brand] = (brandSales[item.brand] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(brandSales),
    datasets: [{
      data: Object.values(brandSales),
      backgroundColor: [
        'rgba(255, 255, 255, 0.8)',
        'rgba(200, 200, 200, 0.8)',
        'rgba(150, 150, 150, 0.8)',
        'rgba(100, 100, 100, 0.8)',
        'rgba(50, 50, 50, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1
    }]
  };

  // Brand Profit Chart
  const brandProfitChartData = {
    labels: Object.keys(brandProfitAnalysis),
    datasets: [{
      label: 'Total Profit by Brand',
      data: Object.values(brandProfitAnalysis),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2
    }]
  };

  // Profit Trends Chart
  const profitTrendsData = {
    labels: last30Days.map(date => new Date(date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Profit',
      data: last30Days.map(date => profitTrends[date] || 0),
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const lineData = {
    labels: finances.map(t => t.date).slice(-7),
    datasets: [{
      label: 'Daily Income',
      data: finances.filter(t => t.type === 'income').map(t => t.amount).slice(-7),
      borderColor: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div className="app">
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <div key={toast.id} className={'toast toast-' + toast.type}>
          {toast.message}
        </div>
      ))}

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">ProfitTracker Pro</h1>
          <div className="storage-info">
            Storage: {formatStorageSize(getStorageUsage())} (Unlimited)
          </div>
        </div>
        <div className="header-actions">
          <button
            className="button"
            onClick={resetToSampleData}
          >
            Reset Data
          </button>
          <button
            className="button"
            onClick={updateExistingItemsProfit}
          >
            Update Profits
          </button>
          <button
            className="button secondary"
            onClick={clearAllData}
          >
            Clear All
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button 
          className={'nav-button ' + (activeTab === 'finances' ? 'active' : '')}
          onClick={() => setActiveTab('finances')}
        >
          <DollarSign size={20} />
          Finances
        </button>
        <button 
          className={'nav-button ' + (activeTab === 'inventory' ? 'active' : '')}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={20} />
          Inventory
        </button>
        <button 
          className={'nav-button ' + (activeTab === 'analytics' ? 'active' : '')}
          onClick={() => setActiveTab('analytics')}
        >
          <Filter size={20} />
          Analytics
        </button>
      </nav>


      {/* Main Content */}
      <main className="main">
        {activeTab === 'finances' && (
          <div className="tab-content">
            <div className="card">
              <h2>Add Transaction</h2>
              <div className="form-group">
                <label>Type</label>
                <select 
                  value={newTransaction.type} 
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="input-field"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="input-field"
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="input-field"
                  placeholder="Enter description"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="input-field"
                />
              </div>
              <button onClick={addTransaction} className="button">
                <Plus size={16} />
                Add Transaction
              </button>
            </div>

            <div className="card">
              <h2>Financial Overview</h2>
              <div className="stats-grid">
                <div className="stat">
                  <h3>Total Income</h3>
                  <p className="stat-value income">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="stat">
                  <h3>Total Expenses</h3>
                  <p className="stat-value expense">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="stat">
                  <h3>Net Profit</h3>
                  <p className={'stat-value ' + (netProfit >= 0 ? 'income' : 'expense')}>
                    ${netProfit.toFixed(2)}
                  </p>
                </div>
                <div className="stat">
                  <h3>Current Stock Worth</h3>
                  <p className="stat-value">${currentStockWorth.toFixed(2)}</p>
                </div>
                <div className="stat">
                  <h3>Money Invested</h3>
                  <p className="stat-value">${currentMoneyInvested.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Recent Transactions</h2>
              <div className="transaction-list">
                {finances.slice(-10).reverse().map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <span className={'transaction-type ' + transaction.type}>
                        {transaction.type}
                      </span>
                      <span className="transaction-description">{transaction.description}</span>
                      <span className="transaction-date">{transaction.date}</span>
                    </div>
                    <div className="transaction-amount">
                      <span className={'amount ' + transaction.type}>
                        {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(transaction.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="tab-content">
            <div className="card">
              <h2>Add Inventory Item</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={newItem.brand}
                    onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                    className="input-field"
                    placeholder="Enter brand"
                  />
                </div>
                <div className="form-group">
                  <label>Item</label>
                  <input
                    type="text"
                    value={newItem.item}
                    onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                    className="input-field"
                    placeholder="Enter item name"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    value={newItem.purchasePrice}
                    onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                    className="input-field"
                    placeholder="Enter price"
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Value</label>
                  <input
                    type="number"
                    value={newItem.estimatedValue}
                    onChange={(e) => setNewItem({...newItem, estimatedValue: e.target.value})}
                    className="input-field"
                    placeholder="Enter estimated value"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={newItem.size}
                    onChange={(e) => setNewItem({...newItem, size: e.target.value})}
                    className="input-field"
                    placeholder="Enter size"
                  />
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({...newItem, condition: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    className="input-field"
                    placeholder="Enter notes"
                    rows="3"
                  />
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className="form-group">
                <label>Images</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="image-upload-button">
                    <Upload size={16} />
                    <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                  </label>
                  
                  {newItem.images.length > 0 && (
                    <div className="image-preview-container">
                      {newItem.images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={image} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image-btn"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-actions">
                <button onClick={addInventoryItem} className="button">
                  <Plus size={16} />
                  Add Item
                </button>
                <button onClick={() => setShowHistoricalSaleModal(true)} className="button secondary">
                  <Plus size={16} />
                  Add Old Sale
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card">
              <div className="search-filter">
                <div className="search-group">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-group">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="sold">Sold</option>
                    <option value="traded">Traded</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="brand">Sort by Brand</option>
                    <option value="price">Sort by Price</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                  <button onClick={clearFilters} className="button">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* In Stock Items */}
            <div className="card">
              <h2>In Stock ({inStockItems.length})</h2>
              <div className="fashion-grid">
                {inStockItems.map(item => (
                  <div key={item.id} className="fashion-item-card" onClick={() => openItemDetail(item)}>
                    <div className="item-image-container">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={`${item.brand} ${item.item}`}
                          className="item-main-image"
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <Package size={32} />
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="item-status-overlay">
                        <span className="status-badge in-stock">In Stock</span>
                      </div>
                      {item.images && item.images.length > 1 && (
                        <div className="image-count-badge">
                          +{item.images.length - 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <div className="item-header">
                        <h3 className="item-title">{item.brand}</h3>
                        <p className="item-name">{item.item}</p>
                      </div>
                      
                      <div className="item-specs">
                        <div className="spec-item">
                          <span className="spec-label">Size</span>
                          <span className="spec-value">{item.size || 'N/A'}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Condition</span>
                          <span className={`spec-value condition-${(item.condition || '').toLowerCase().replace(' ', '-')}`}>
                            {item.condition || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="item-pricing">
                        <div className="price-item">
                          <span className="price-label">Paid</span>
                          <span className="price-value">${item.purchasePrice.toFixed(2)}</span>
                        </div>
                        <div className="price-item">
                          <span className="price-label">Est. Value</span>
                          <span className="price-value estimated">${(item.estimatedValue || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="item-notes">
                          <span className="notes-text">{item.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setShowSellModal(true);
                        }}
                        className="action-button sell-button"
                        title="Mark as Sold"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setShowTradeModal(true);
                        }}
                        className="action-button trade-button"
                        title="Mark as Traded"
                      >
                        <ArrowUpDown size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInventoryItem(item.id);
                        }}
                        className="action-button delete-button"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sold Items */}
            <div className="card">
              <h2>Sold Items ({soldItems.length})</h2>
              <div className="inventory-list">
                {soldItems.map(item => (
                  <div key={item.id} className="inventory-item clickable-row" onClick={() => openItemDetail(item)}>
                    <div className="item-info">
                      <h3>{item.brand} {item.item}</h3>
                      <p>Size: {item.size || 'N/A'} | Condition: {item.condition || 'N/A'}</p>
                      <p>Purchase Price: ${item.purchasePrice.toFixed(2)} | Sell Price: ${item.sellPrice.toFixed(2)}</p>
                      <p className="profit">Profit: ${item.profit.toFixed(2)}</p>
                      {item.notes && <p>Notes: {item.notes}</p>}
                    </div>
                    <div className="item-actions">
                      <span className="status-badge sold">Sold</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInventoryItem(item.id);
                        }}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traded Items */}
            <div className="card">
              <h2>Traded Items ({tradedItems.length})</h2>
              <div className="inventory-list">
                {tradedItems.map(item => (
                  <div key={item.id} className="inventory-item clickable-row" onClick={() => openItemDetail(item)}>
                    <div className="item-info">
                      <h3>{item.brand} {item.item}</h3>
                      <p>Size: {item.size || 'N/A'} | Condition: {item.condition || 'N/A'}</p>
                      <p>Purchase Price: ${item.purchasePrice.toFixed(2)} | Trade Value: ${item.tradeValue.toFixed(2)}</p>
                      <p className="profit">Profit: ${item.profit.toFixed(2)}</p>
                      {item.tradeDetails && (
                        <p>Trade Details: Cash: ${item.tradeDetails.cashReceived || '0'}, Items: {item.tradeDetails.itemsReceived || 'N/A'}</p>
                      )}
                      {item.notes && <p>Notes: {item.notes}</p>}
                    </div>
                    <div className="item-actions">
                      <span className="status-badge traded">Traded</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInventoryItem(item.id);
                        }}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            {/* Profit Overview Cards */}
            <div className="analytics-overview">
              <div className="card">
                <h3>Total Items Sold</h3>
                <p className="stat-value income">{allSoldTradedItems.length}</p>
              </div>
              <div className="card">
                <h3>Average ROI</h3>
                <p className="stat-value income">
                  {allSoldTradedItems.length > 0 
                    ? (allSoldTradedItems.reduce((sum, item) => {
                        const roi = item.purchasePrice > 0 ? (item.profit / item.purchasePrice) * 100 : 0;
                        return sum + roi;
                      }, 0) / allSoldTradedItems.length).toFixed(1) + '%'
                    : '0%'
                  }
                </p>
              </div>
              <div className="card">
                <h3>Best Brand</h3>
                <p className="stat-value">
                  {Object.keys(brandProfitAnalysis).length > 0 
                    ? Object.keys(brandProfitAnalysis).reduce((a, b) => 
                        brandProfitAnalysis[a] > brandProfitAnalysis[b] ? a : b
                      )
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Brand Profit Analysis */}
            <div className="card">
              <h2>Profit by Brand</h2>
              <div className="chart-container">
                <Pie data={brandProfitChartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#ffffff',
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }} />
              </div>
            </div>

            {/* Brand Performance Table */}
            <div className="card">
              <h2>Brand Performance Analysis</h2>
              <div className="brand-analysis-table">
                <table>
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>Items Sold</th>
                      <th>Total Profit</th>
                      <th>Avg ROI</th>
                      <th>Avg Profit/Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(brandProfitAnalysis).map(brand => (
                      <tr key={brand}>
                        <td><strong>{brand}</strong></td>
                        <td>{brandItemCount[brand]}</td>
                        <td className="profit">${brandProfitAnalysis[brand].toFixed(2)}</td>
                        <td className={brandAverageROI[brand] >= 0 ? 'profit' : 'loss'}>
                          {brandAverageROI[brand].toFixed(1)}%
                        </td>
                        <td className="profit">
                          ${(brandProfitAnalysis[brand] / brandItemCount[brand]).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best & Worst Performers */}
            <div className="performers-grid">
              <div className="card">
                <h2>🏆 Best Performers</h2>
                <div className="performers-list">
                  {bestPerformers.map((item, index) => (
                    <div key={item.id} className="performer-item">
                      <div className="performer-rank">#{index + 1}</div>
                      <div className="performer-info">
                        <h4>{item.brand} {item.item}</h4>
                        <p>Size: {item.size} | Condition: {item.condition}</p>
                      </div>
                      <div className="performer-profit">
                        <span className="profit">+${item.profit.toFixed(2)}</span>
                        <span className="roi">
                          {item.purchasePrice > 0 
                            ? ((item.profit / item.purchasePrice) * 100).toFixed(1) + '%'
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>📉 Worst Performers</h2>
                <div className="performers-list">
                  {worstPerformers.map((item, index) => (
                    <div key={item.id} className="performer-item">
                      <div className="performer-rank">#{index + 1}</div>
                      <div className="performer-info">
                        <h4>{item.brand} {item.item}</h4>
                        <p>Size: {item.size} | Condition: {item.condition}</p>
                      </div>
                      <div className="performer-profit">
                        <span className={item.profit >= 0 ? 'profit' : 'loss'}>
                          {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(2)}
                        </span>
                        <span className={item.purchasePrice > 0 && (item.profit / item.purchasePrice) >= 0 ? 'profit' : 'loss'}>
                          {item.purchasePrice > 0 
                            ? ((item.profit / item.purchasePrice) * 100).toFixed(1) + '%'
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profit Trends */}
            <div className="card">
              <h2>Profit Trends (Last 30 Days)</h2>
              <div className="chart-container">
                <Line data={profitTrendsData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#ffffff'
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: '#ffffff',
                        maxTicksLimit: 10
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    y: {
                      ticks: {
                        color: '#ffffff'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }
                }} />
              </div>
            </div>

            {/* Export/Import Data */}
            <div className="card">
              <h2>Export/Import Data</h2>
              <div className="export-import">
                <button onClick={exportToCsv} className="button">
                  <Download size={16} />
                  Export to CSV
                </button>
                <button onClick={exportToJson} className="button">
                  <Download size={16} />
                  Export to JSON
                </button>
                <label className="button">
                  <Upload size={16} />
                  Import from JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={importFromJson}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sell Modal */}
      {showSellModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sell Item</h2>
            <p>{selectedItem.brand} {selectedItem.item}</p>
            <div className="form-group">
              <label>Sell Price</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="input-field"
                placeholder="Enter sell price"
              />
            </div>
            <div className="form-group">
              <label>Sell Date</label>
              <input
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="modal-actions">
              <button onClick={markAsSold} className="button">
                Confirm Sale
              </button>
              <button onClick={() => setShowSellModal(false)} className="button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Trade Item</h2>
            <p>{selectedItem.brand} {selectedItem.item}</p>
            <div className="form-group">
              <label>Trade Value</label>
              <input
                type="number"
                value={tradeValue}
                onChange={(e) => setTradeValue(e.target.value)}
                className="input-field"
                placeholder="Enter trade value"
              />
            </div>
            <div className="form-group">
              <label>Cash Received</label>
              <input
                type="number"
                value={tradeDetails.cashReceived}
                onChange={(e) => setTradeDetails({...tradeDetails, cashReceived: e.target.value})}
                className="input-field"
                placeholder="Enter cash received"
              />
            </div>
            <div className="form-group">
              <label>Items Received</label>
              <input
                type="text"
                value={tradeDetails.itemsReceived}
                onChange={(e) => setTradeDetails({...tradeDetails, itemsReceived: e.target.value})}
                className="input-field"
                placeholder="Describe items received"
              />
            </div>
            <div className="form-group">
              <label>Trade Date</label>
              <input
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="modal-actions">
              <button onClick={processTrade} className="button">
                Confirm Trade
              </button>
              <button onClick={() => setShowTradeModal(false)} className="button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Item View Modal */}
      {showItemDetail && selectedItemDetail && (
        <div className="modal-overlay item-detail-overlay">
          <div className="modal-content item-detail-modal">
            <div className="item-detail-header">
              <h2 className="modal-title">{selectedItemDetail.brand} {selectedItemDetail.item}</h2>
              <button className="close-btn" onClick={() => setShowItemDetail(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="item-detail-content">
              {/* Image Gallery */}
              {selectedItemDetail.images && selectedItemDetail.images.length > 0 ? (
                <div className="image-gallery">
                  <div className="main-image-container">
                    <img
                      src={selectedItemDetail.images[currentImageIndex]}
                      alt="Item Image"
                      className="main-image"
                    />
                    {selectedItemDetail.images.length > 1 && (
                      <>
                        <button className="image-nav prev" onClick={prevImage}>
                          <ArrowUpDown size={20} />
                        </button>
                        <button className="image-nav next" onClick={nextImage}>
                          <ArrowUpDown size={20} />
                        </button>
                      </>
                    )}
                    <div className="image-counter">
                      {currentImageIndex + 1} / {selectedItemDetail.images.length}
                    </div>
                  </div>

                  {selectedItemDetail.images.length > 1 && (
                    <div className="thumbnail-container">
                      {selectedItemDetail.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Thumbnail Image"
                          className={'thumbnail ' + (index === currentImageIndex ? 'active' : '')}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-images">
                  <Package size={64} />
                  <p>No images available</p>
                </div>
              )}

              {/* Item Details */}
              <div className="item-details">
                <div className="detail-section">
                  <h3>Item Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Brand:</label>
                      <span>{selectedItemDetail.brand}</span>
                    </div>
                    <div className="detail-item">
                      <label>Item:</label>
                      <span>{selectedItemDetail.item}</span>
                    </div>
                    <div className="detail-item">
                      <label>Size:</label>
                      <span>{selectedItemDetail.size || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Condition:</label>
                      <span>{selectedItemDetail.condition || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Purchase Price:</label>
                      <span>${selectedItemDetail.purchasePrice.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Estimated Value:</label>
                      <span>${(selectedItemDetail.estimatedValue || 0).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={'status-badge ' + selectedItemDetail.status}>
                        {selectedItemDetail.status === 'in-stock' ? 'In Stock' :
                         selectedItemDetail.status === 'sold' ? 'Sold' : 'Traded'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedItemDetail.notes && (
                  <div className="detail-section">
                    <h3>Notes</h3>
                    <p>{selectedItemDetail.notes}</p>
                  </div>
                )}

                {selectedItemDetail.status === 'sold' && (
                  <div className="detail-section">
                    <h3>Sale Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Sell Price:</label>
                        <span>${selectedItemDetail.sellPrice.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Profit:</label>
                        <span className="profit">${selectedItemDetail.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedItemDetail.status === 'traded' && (
                  <div className="detail-section">
                    <h3>Trade Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Trade Value:</label>
                        <span>${selectedItemDetail.tradeValue.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Profit:</label>
                        <span className="profit">${selectedItemDetail.profit.toFixed(2)}</span>
                      </div>
                      {selectedItemDetail.tradeDetails && (
                        <>
                          <div className="detail-item">
                            <label>Cash Received:</label>
                            <span>${selectedItemDetail.tradeDetails.cashReceived || '0'}</span>
                          </div>
                          <div className="detail-item">
                            <label>Items Received:</label>
                            <span>{selectedItemDetail.tradeDetails.itemsReceived || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="item-detail-actions">
              <button className="button" onClick={() => setShowItemDetail(false)}>
                Close
              </button>
              {selectedItemDetail.status === 'in-stock' && (
                <>
                  <button
                    className="button"
                    onClick={() => {
                      setShowItemDetail(false);
                      setSelectedItem(selectedItemDetail);
                      setShowSellModal(true);
                    }}
                  >
                    <DollarSign size={16} />
                    Sell Item
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      setShowItemDetail(false);
                      setSelectedItem(selectedItemDetail);
                      setShowTradeModal(true);
                    }}
                  >
                    <ArrowUpDown size={16} />
                    Trade Item
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historical Sale Modal */}
      {showHistoricalSaleModal && (
        <div className="modal-overlay">
          <div className="modal-content historical-sale-modal">
            <h2>Add Old Sale</h2>
            <p>Add a past sale to improve your analytics</p>
            
            <div className="form-row">
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  value={historicalSale.brand}
                  onChange={(e) => setHistoricalSale({...historicalSale, brand: e.target.value})}
                  className="input-field"
                  placeholder="Enter brand"
                />
              </div>
              <div className="form-group">
                <label>Item *</label>
                <input
                  type="text"
                  value={historicalSale.item}
                  onChange={(e) => setHistoricalSale({...historicalSale, item: e.target.value})}
                  className="input-field"
                  placeholder="Enter item name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input
                  type="number"
                  value={historicalSale.purchasePrice}
                  onChange={(e) => setHistoricalSale({...historicalSale, purchasePrice: e.target.value})}
                  className="input-field"
                  placeholder="Enter purchase price"
                />
              </div>
              <div className="form-group">
                <label>Estimated Value</label>
                <input
                  type="number"
                  value={historicalSale.estimatedValue}
                  onChange={(e) => setHistoricalSale({...historicalSale, estimatedValue: e.target.value})}
                  className="input-field"
                  placeholder="Enter estimated value"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sell Price *</label>
                <input
                  type="number"
                  value={historicalSale.sellPrice}
                  onChange={(e) => setHistoricalSale({...historicalSale, sellPrice: e.target.value})}
                  className="input-field"
                  placeholder="Enter sell price"
                />
              </div>
              <div className="form-group">
                <label>Sell Date *</label>
                <input
                  type="date"
                  value={historicalSale.sellDate}
                  onChange={(e) => setHistoricalSale({...historicalSale, sellDate: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Size</label>
                <input
                  type="text"
                  value={historicalSale.size}
                  onChange={(e) => setHistoricalSale({...historicalSale, size: e.target.value})}
                  className="input-field"
                  placeholder="Enter size"
                />
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={historicalSale.condition}
                  onChange={(e) => setHistoricalSale({...historicalSale, condition: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={historicalSale.notes}
                onChange={(e) => setHistoricalSale({...historicalSale, notes: e.target.value})}
                className="input-field"
                placeholder="Enter notes"
                rows="3"
              />
            </div>

            {/* Image Upload Section */}
            <div className="form-group">
              <label>Images</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleHistoricalImageUpload(e)}
                  className="file-input"
                  id="historical-image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="historical-image-upload" className="file-upload-button">
                  <Plus size={16} />
                  <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                </label>
                {historicalSale.images && historicalSale.images.length > 0 && (
                  <div className="image-preview-grid">
                    {historicalSale.images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={image} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeHistoricalImage(index)}
                          className="remove-image-btn"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={addHistoricalSale} className="button">
                Add Old Sale
              </button>
              <button onClick={() => setShowHistoricalSaleModal(false)} className="button secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceInventoryApp;
