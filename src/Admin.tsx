import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  UploadCloud, 
  Globe, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  FolderMinus,
  Loader2
} from 'lucide-react';

interface InspirationItem {
  id: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface AdminProps {
  onBackToApp: () => void;
}

export default function Admin({ onBackToApp }: AdminProps) {
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Inspirations data
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [dbLoading, setDbLoading] = useState(false);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addCategory, setAddCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingItem, setEditingItem] = useState<InspirationItem | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Confirmation modals
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState<string | null>(null);

  // Load Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch items if logged in
  useEffect(() => {
    if (session) {
      fetchItems();
    }
  }, [session]);

  const fetchItems = async () => {
    try {
      setDbLoading(true);
      const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setItems(data);
        const uniqueCats = Array.from(new Set(data.map(item => item.category))).sort();
        setCategories(uniqueCats);
        if (uniqueCats.length > 0 && !activeCategory) {
          setActiveCategory(uniqueCats[0]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err.message);
    } finally {
      setDbLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Failed to authenticate');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Image Upload Logic
  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    setUploadProgress(10);
    const { error: uploadError } = await supabase.storage
      .from('inspirations')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    setUploadProgress(60);

    const { data } = supabase.storage
      .from('inspirations')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to get public URL');
    }
    setUploadProgress(100);
    return data.publicUrl;
  };

  const handleAddInspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(false);

    // Form Validation
    const categoryToSave = addCategory === '__new__' ? newCategoryName.trim() : addCategory;
    if (!categoryToSave) {
      setFormError('Please select or specify a category');
      return;
    }

    let finalImageUrl = '';
    setIsSubmitting(true);

    try {
      if (imageSource === 'url') {
        if (!imageUrlInput.trim()) {
          throw new Error('Please enter an image URL');
        }
        finalImageUrl = imageUrlInput.trim();
      } else {
        if (!uploadFile) {
          throw new Error('Please select an image file to upload');
        }
        finalImageUrl = await handleFileUpload(uploadFile);
      }

      // Insert record
      const { error } = await supabase
        .from('inspirations')
        .insert({
          category: categoryToSave,
          image_url: finalImageUrl
        });

      if (error) throw error;

      setFormSuccess('Inspiration added successfully!');
      
      // Reset form fields
      setImageUrlInput('');
      setUploadFile(null);
      setNewCategoryName('');
      setUploadProgress(0);
      
      // Reload database items
      await fetchItems();
      
      // Update active category
      setActiveCategory(categoryToSave);

      // Close form drawer after brief delay
      setTimeout(() => {
        setShowAddForm(false);
        setFormSuccess('');
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || 'Failed to add inspiration');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inspirations')
        .update({
          category: editCategory,
          image_url: editUrl
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setFormSuccess('Inspiration updated successfully!');
      await fetchItems();
      
      if (activeCategory !== editCategory) {
        setActiveCategory(editCategory);
      }

      setTimeout(() => {
        setEditingItem(null);
        setFormSuccess('');
      }, 1000);

    } catch (err: any) {
      setFormError(err.message || 'Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      // Find item details to delete from storage if needed
      const itemToDelete = items.find(item => item.id === deleteItemId);
      
      const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', deleteItemId);

      if (error) throw error;

      // Try to clean up storage if it was uploaded
      if (itemToDelete && itemToDelete.image_url.includes('/storage/v1/object/public/inspirations/')) {
        const filePath = itemToDelete.image_url.split('/inspirations/')[1];
        if (filePath) {
          await supabase.storage.from('inspirations').remove([filePath]);
        }
      }

      setItems(prev => prev.filter(item => item.id !== deleteItemId));
      
      // Re-evaluate categories
      const remainingItems = items.filter(item => item.id !== deleteItemId);
      const uniqueCats = Array.from(new Set(remainingItems.map(i => i.category))).sort();
      setCategories(uniqueCats);
      if (uniqueCats.length > 0 && !uniqueCats.includes(activeCategory)) {
        setActiveCategory(uniqueCats[0]);
      }
    } catch (err: any) {
      alert('Error deleting item: ' + err.message);
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryName) return;
    try {
      const itemsInCat = items.filter(item => item.category === deleteCategoryName);
      
      const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('category', deleteCategoryName);

      if (error) throw error;

      // Clean up uploads from storage
      const storageFilesToDelete = itemsInCat
        .filter(item => item.image_url.includes('/storage/v1/object/public/inspirations/'))
        .map(item => item.image_url.split('/inspirations/')[1])
        .filter(Boolean);

      if (storageFilesToDelete.length > 0) {
        await supabase.storage.from('inspirations').remove(storageFilesToDelete);
      }

      await fetchItems();
      
      // Reset active category
      const nextCats = categories.filter(c => c !== deleteCategoryName);
      if (nextCats.length > 0) {
        setActiveCategory(nextCats[0]);
      } else {
        setActiveCategory('');
      }
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    } finally {
      setDeleteCategoryName(null);
    }
  };

  // Filter items based on active category
  const filteredItems = items.filter(item => item.category === activeCategory);

  // Authentication Screen
  if (!session) {
    return (
      <div className="admin-portal-login">
        <style>{`
          .admin-portal-login {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 30% 30%, #111, #000);
            color: #fff;
            font-family: 'Inter', sans-serif;
            padding: 20px;
          }
          .login-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
          }
          .login-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .login-title {
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #fff, #ffd100);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .login-subtitle {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-label {
            display: block;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
          }
          .form-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px 16px;
            color: #fff;
            font-size: 0.95rem;
            transition: all 0.3s ease;
          }
          .form-input:focus {
            outline: none;
            border-color: #ffd100;
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 4px rgba(255, 209, 0, 0.15);
          }
          .btn-login {
            width: 100%;
            background: #ffd100;
            color: #000;
            font-weight: 700;
            border: none;
            border-radius: 8px;
            padding: 14px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }
          .btn-login:hover {
            background: #fff;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
          }
          .btn-back-home {
            width: 100%;
            background: transparent;
            color: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 10px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 15px;
          }
          .btn-back-home:hover {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.3);
          }
          .error-box {
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.2);
            border-radius: 8px;
            color: #ff3b30;
            padding: 12px 16px;
            font-size: 0.85rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        `}</style>
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-header">
            <h1 className="login-title">Admin Access</h1>
            <p className="login-subtitle">Sign in to manage inspiration galleries</p>
          </div>

          {authError && (
            <div className="error-box">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inbox.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="btn-login" type="submit" disabled={authLoading}>
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <button className="btn-back-home" onClick={onBackToApp}>
            <ChevronLeft size={14} />
            <span>Back to Public Site</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #0d0d0d;
          color: #fff;
          font-family: 'Inter', sans-serif;
          padding: 30px;
          position: relative;
          overflow-x: hidden;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 20px 30px;
          margin-bottom: 30px;
        }
        .brand-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .admin-badge {
          background: rgba(255, 209, 0, 0.1);
          color: #ffd100;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255, 209, 0, 0.2);
          text-transform: uppercase;
        }
        .admin-user {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-view-site {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-view-site:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
        .btn-logout {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.2);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #ff3b30;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-logout:hover {
          background: #ff3b30;
          color: #fff;
        }
        .dashboard-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
        }
        .admin-sidebar {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 24px;
          height: fit-content;
        }
        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 15px;
          display: block;
        }
        .sidebar-cats-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cat-item-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cat-item-btn:hover {
          background: rgba(255,255,255,0.03);
          color: #fff;
        }
        .cat-item-btn.active {
          background: rgba(255, 209, 0, 0.1);
          color: #ffd100;
          font-weight: 600;
        }
        .cat-count {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
        }
        .cat-item-btn.active .cat-count {
          background: rgba(255, 209, 0, 0.2);
          color: #ffd100;
        }
        .btn-action-primary {
          width: 100%;
          background: #ffd100;
          color: #000;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-action-primary:hover {
          background: #fff;
          transform: translateY(-2px);
        }
        .btn-delete-cat {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 59, 48, 0.2);
          color: #ff3b30;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
          transition: all 0.2s ease;
        }
        .btn-delete-cat:hover {
          background: rgba(255, 59, 48, 0.1);
          border-color: #ff3b30;
        }
        .main-dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .content-panel {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 30px;
        }
        .panel-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .panel-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
        .admin-gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          group-hover: shadow;
        }
        .admin-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-action-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-gallery-item:hover .item-action-overlay {
          opacity: 1;
        }
        .overlay-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .overlay-icon-btn.edit-btn {
          background: #fff;
          color: #000;
        }
        .overlay-icon-btn.edit-btn:hover {
          background: #ffd100;
          transform: scale(1.1);
        }
        .overlay-icon-btn.delete-btn {
          background: rgba(255, 59, 48, 0.9);
          color: #fff;
        }
        .overlay-icon-btn.delete-btn:hover {
          background: #ff3b30;
          transform: scale(1.1);
        }
        .no-data-panel {
          padding: 60px 0;
          text-align: center;
          color: rgba(255,255,255,0.4);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Add Form Drawer style */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .drawer-sheet {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: #121212;
          border-left: 1px solid rgba(255,255,255,0.08);
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .drawer-title {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .drawer-close {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 1.5rem;
          padding: 5px;
        }
        .drawer-close:hover {
          color: #fff;
        }
        .source-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.05);
          padding: 4px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .source-tab-btn {
          padding: 8px;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          background: transparent;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .source-tab-btn.active {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .dropzone {
          border: 2px dashed rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          background: rgba(255,255,255,0.01);
          transition: all 0.3s ease;
        }
        .dropzone:hover {
          border-color: #ffd100;
          background: rgba(255,209,0,0.02);
        }
        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }
        .dropzone-icon {
          color: rgba(255,255,255,0.3);
        }
        .file-preview {
          margin-top: 15px;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/9;
          position: relative;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .file-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .progress-bar-container {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 15px;
        }
        .progress-bar-fill {
          height: 100%;
          background: #ffd100;
          transition: width 0.3s ease;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          padding: 12px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }
        .btn-cancel:hover {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        .form-actions {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 12px;
          margin-top: 30px;
        }
        .success-box {
          background: rgba(52, 199, 89, 0.1);
          border: 1px solid rgba(52, 199, 89, 0.2);
          border-radius: 8px;
          color: #34c759;
          padding: 12px 16px;
          font-size: 0.85rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-box {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          width: 100%;
          max-width: 440px;
          padding: 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .modal-desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-modal-delete {
          background: #ff3b30;
          color: #fff;
          border: none;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-modal-delete:hover {
          background: #e02b20;
        }
      `}</style>

      {/* Admin Panel Header */}
      <header className="admin-header">
        <div className="brand-section">
          <h1 className="panel-title" style={{ margin: 0 }}>INBOX</h1>
          <span className="admin-badge">Admin Portal</span>
          <span className="admin-user">{session.user.email}</span>
        </div>
        <div className="header-actions">
          <button className="btn-view-site" onClick={onBackToApp}>
            <ChevronLeft size={16} />
            <span>Public Site</span>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="dashboard-layout">
        {/* Left Sidebar - Categories */}
        <aside className="admin-sidebar">
          <span className="section-label">Categories</span>
          <ul className="sidebar-cats-list">
            {categories.map(cat => (
              <li key={cat}>
                <button 
                  className={`cat-item-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="cat-count">
                    {items.filter(i => i.category === cat).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button className="btn-action-primary" onClick={() => {
            setAddCategory('');
            setShowAddForm(true);
          }}>
            <Plus size={16} />
            <span>Add Inspiration</span>
          </button>

          {activeCategory && (
            <button className="btn-delete-cat" onClick={() => setDeleteCategoryName(activeCategory)}>
              <FolderMinus size={14} />
              <span>Delete Category</span>
            </button>
          )}
        </aside>

        {/* Right Area - Selected Category View */}
        <main className="main-dashboard-content">
          <div className="content-panel">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title" style={{ marginBottom: '4px' }}>
                  {activeCategory || 'No Category Selected'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
                  Showing {filteredItems.length} design items
                </p>
              </div>
            </div>

            {dbLoading ? (
              <div className="no-data-panel">
                <Loader2 size={36} className="animate-spin" style={{ color: '#ffd100', margin: '0 auto 15px auto' }} />
                <p>Loading database items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="admin-gallery-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="admin-gallery-item">
                    <img src={item.image_url} alt="Inspiration preview" loading="lazy" />
                    <div className="item-action-overlay">
                      <button 
                        className="overlay-icon-btn edit-btn" 
                        onClick={() => {
                          setEditingItem(item);
                          setEditCategory(item.category);
                          setEditUrl(item.image_url);
                        }}
                        title="Edit Item"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="overlay-icon-btn delete-btn" 
                        onClick={() => setDeleteItemId(item.id)}
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-panel">
                <p>No images in this category yet. Click "Add Inspiration" to add your first image!</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Drawer Overlay for Add Inspiration */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div 
              className="drawer-sheet"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <h2 className="drawer-title">Add New Inspiration</h2>
                <button className="drawer-close" onClick={() => setShowAddForm(false)}>&times;</button>
              </div>

              {formSuccess && (
                <div className="success-box">
                  <Check size={16} />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="error-box">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddInspiration} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input"
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__new__">+ Create New Category</option>
                  </select>
                </div>

                {addCategory === '__new__' && (
                  <div className="form-group">
                    <label className="form-label">New Category Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Cosmetics"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label className="form-label">Image Source</label>
                  <div className="source-tabs">
                    <button 
                      type="button"
                      className={`source-tab-btn ${imageSource === 'upload' ? 'active' : ''}`}
                      onClick={() => setImageSource('upload')}
                    >
                      <UploadCloud size={14} />
                      <span>Upload File</span>
                    </button>
                    <button 
                      type="button"
                      className={`source-tab-btn ${imageSource === 'url' ? 'active' : ''}`}
                      onClick={() => setImageSource('url')}
                    >
                      <Globe size={14} />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {imageSource === 'url' ? (
                  <div className="form-group">
                    <label className="form-label">Image Address URL</label>
                    <input 
                      type="url" 
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Upload File</label>
                    <label className="dropzone">
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadFile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="dropzone-label">
                        <UploadCloud size={30} className="dropzone-icon" />
                        {uploadFile ? (
                          <div style={{ wordBreak: 'break-all' }}>
                            <span style={{ fontWeight: 600, color: '#fff' }}>Selected:</span> {uploadFile.name}
                          </div>
                        ) : (
                          <div>
                            <span style={{ color: '#ffd100', fontWeight: 600 }}>Click to browse</span> or drop file here
                            <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>Accepts JPG, PNG, WEBP (Max 5MB)</div>
                          </div>
                        )}
                      </div>
                    </label>

                    {uploadFile && (
                      <div className="file-preview">
                        <img src={URL.createObjectURL(uploadFile)} alt="Upload preview" />
                      </div>
                    )}

                    {uploadProgress > 0 && (
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: 'auto' }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
                  <button type="submit" className="btn-action-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Inspiration</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal Dialog */}
      <AnimatePresence>
        {editingItem && (
          <div className="modal-overlay" onClick={() => setEditingItem(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Edit Inspiration Image</h2>
              
              {formSuccess && (
                <div className="success-box">
                  <Check size={16} />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="error-box">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateInspiration}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL Address</label>
                  <input 
                    type="url" 
                    className="form-input"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    required
                  />
                </div>

                <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', background: '#000' }}>
                  <img src={editUrl} alt="Inspiration edit preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { (e.target as any).src = 'placeholder'; }} />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setEditingItem(null)}>Cancel</button>
                  <button type="submit" className="btn-action-primary" style={{ width: 'auto', padding: '10px 20px' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Item Confirmation Modal */}
      <AnimatePresence>
        {deleteItemId && (
          <div className="modal-overlay" onClick={() => setDeleteItemId(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Delete Inspiration?</h2>
              <p className="modal-desc">
                Are you sure you want to delete this inspiration image? This action will permanently remove it from the database and storage.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteItemId(null)}>Cancel</button>
                <button className="btn-modal-delete" onClick={handleDeleteItem}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {deleteCategoryName && (
          <div className="modal-overlay" onClick={() => setDeleteCategoryName(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title" style={{ color: '#ff3b30' }}>Delete Entire Category?</h2>
              <p className="modal-desc">
                Are you sure you want to delete the category <strong>"{deleteCategoryName}"</strong>? This will permanently delete <strong>all</strong> images belonging to this category from both the database and storage. This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteCategoryName(null)}>Cancel</button>
                <button className="btn-modal-delete" onClick={handleDeleteCategory}>Delete Category</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
