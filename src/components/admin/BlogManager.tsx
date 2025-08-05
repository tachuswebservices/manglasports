import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../ui/use-toast';
import { Plus, Edit, Trash2, Eye, Calendar, User, Clock, MessageSquare, Upload, X } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  views: number;
  isFeatured: boolean;
  createdAt: string;
  authorName?: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    featuredImage: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    readTime: 5,
    isFeatured: false
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  // Fetch blog posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/blog/posts?status=all');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:4000/api/blog/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, featuredImage: data.url }));
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleImageUpload(file);
    }
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: '' }));
  };

  // Create blog post
  const handleCreatePost = async () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:4000/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog post');
      }

      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setShowAddModal(false);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        featuredImage: '',
        status: 'draft',
        readTime: 5,
        isFeatured: false
      });
      toast({
        title: 'Success',
        description: 'Blog post created successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Edit blog post
  const handleEditPost = async () => {
    if (!editingPost || !formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:4000/api/blog/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }

      const updatedPost = await response.json();
      setPosts(prev => prev.map(post => post.id === editingPost.id ? updatedPost : post));
      setShowEditModal(false);
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        featuredImage: '',
        status: 'draft',
        readTime: 5,
        isFeatured: false
      });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.authorName || '',
      featuredImage: post.featuredImage || '',
      status: post.status,
      readTime: post.readTime,
      isFeatured: post.isFeatured
    });
    setShowEditModal(true);
  };

  // Delete blog post
  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog post');
      }

      setPosts(prev => prev.filter(post => post.id !== id));
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Blog Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your blog posts and content</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-mangla-gold hover:bg-mangla-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog post title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Air Guns">Air Guns</SelectItem>
                      <SelectItem value="Shooting Sports">Shooting Sports</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Ballistics">Ballistics</SelectItem>
                      <SelectItem value="Guides">Guides</SelectItem>
                      <SelectItem value="Reviews">Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter author name (optional)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>
              
              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                {formData.featuredImage ? (
                  <div className="relative">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeFeaturedImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                                 ) : (
                   <div 
                     className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-mangla-gold transition-colors"
                     onDragOver={handleDragOver}
                     onDrop={handleDrop}
                   >
                     <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                     <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                       {uploadingImage ? 'Uploading...' : 'Drag and drop an image here, or click to browse'}
                     </p>
                     <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                       PNG, JPG, GIF up to 5MB
                     </p>
                     <div className="flex flex-col sm:flex-row gap-2">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleFileChange}
                         disabled={uploadingImage}
                         className="hidden"
                         id="featured-image-upload"
                       />
                       <label htmlFor="featured-image-upload" className="cursor-pointer">
                         <Button 
                           type="button" 
                           variant="outline" 
                           disabled={uploadingImage}
                           className="w-full sm:w-auto"
                         >
                           {uploadingImage ? 'Uploading...' : 'Choose Image'}
                         </Button>
                       </label>
                       <Button 
                         type="button" 
                         variant="outline" 
                         disabled={uploadingImage}
                         onClick={() => document.getElementById('featured-image-upload')?.click()}
                         className="w-full sm:w-auto"
                       >
                         {uploadingImage ? 'Uploading...' : 'Browse Files'}
                       </Button>
                     </div>
                   </div>
                 )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
                  <Input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Feature this post
                </label>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} disabled={saving} className="bg-mangla-gold hover:bg-mangla-gold/90 w-full sm:w-auto">
                  {saving ? 'Saving...' : 'Save Post'}
                </Button>
              </div>
            </div>
                     </DialogContent>
         </Dialog>

         {/* Edit Blog Post Modal */}
         <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
           <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>Edit Blog Post</DialogTitle>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-2">Title *</label>
                 <Input
                   value={formData.title}
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   placeholder="Enter blog post title"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-2">Category *</label>
                   <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                     <SelectTrigger>
                       <SelectValue placeholder="Select category" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Air Guns">Air Guns</SelectItem>
                       <SelectItem value="Shooting Sports">Shooting Sports</SelectItem>
                       <SelectItem value="Maintenance">Maintenance</SelectItem>
                       <SelectItem value="Training">Training</SelectItem>
                       <SelectItem value="Ballistics">Ballistics</SelectItem>
                       <SelectItem value="Guides">Guides</SelectItem>
                       <SelectItem value="Reviews">Reviews</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Author</label>
                   <Input
                     value={formData.author}
                     onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                     placeholder="Enter author name (optional)"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2">Excerpt *</label>
                 <Textarea
                   value={formData.excerpt}
                   onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                   placeholder="Brief description of the blog post"
                   rows={3}
                 />
               </div>
               
               {/* Featured Image Upload */}
               <div>
                 <label className="block text-sm font-medium mb-2">Featured Image</label>
                 {formData.featuredImage ? (
                   <div className="relative">
                     <img 
                       src={formData.featuredImage} 
                       alt="Featured" 
                       className="w-full h-48 object-cover rounded-lg border"
                     />
                     <Button
                       type="button"
                       variant="destructive"
                       size="sm"
                       onClick={removeFeaturedImage}
                       className="absolute top-2 right-2"
                     >
                       <X className="w-4 h-4" />
                     </Button>
                   </div>
                 ) : (
                   <div 
                     className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-mangla-gold transition-colors"
                     onDragOver={handleDragOver}
                     onDrop={handleDrop}
                   >
                     <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                     <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                       {uploadingImage ? 'Uploading...' : 'Drag and drop an image here, or click to browse'}
                     </p>
                     <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                       PNG, JPG, GIF up to 5MB
                     </p>
                     <div className="flex flex-col sm:flex-row gap-2">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleFileChange}
                         disabled={uploadingImage}
                         className="hidden"
                         id="edit-featured-image-upload"
                       />
                       <label htmlFor="edit-featured-image-upload" className="cursor-pointer">
                         <Button 
                           type="button" 
                           variant="outline" 
                           disabled={uploadingImage}
                           className="w-full sm:w-auto"
                         >
                           {uploadingImage ? 'Uploading...' : 'Choose Image'}
                         </Button>
                       </label>
                       <Button 
                         type="button" 
                         variant="outline" 
                         disabled={uploadingImage}
                         onClick={() => document.getElementById('edit-featured-image-upload')?.click()}
                         className="w-full sm:w-auto"
                       >
                         {uploadingImage ? 'Uploading...' : 'Browse Files'}
                       </Button>
                     </div>
                   </div>
                 )}
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-2">Content *</label>
                 <Textarea
                   value={formData.content}
                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                   placeholder="Write your blog post content here..."
                   rows={8}
                 />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
                   <Input
                     type="number"
                     value={formData.readTime}
                     onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                     min="1"
                     max="60"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Status</label>
                   <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="draft">Draft</SelectItem>
                       <SelectItem value="published">Published</SelectItem>
                       <SelectItem value="archived">Archived</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div className="flex items-center space-x-2">
                 <input
                   type="checkbox"
                   id="edit-isFeatured"
                   checked={formData.isFeatured}
                   onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                   className="rounded"
                 />
                 <label htmlFor="edit-isFeatured" className="text-sm font-medium">
                   Feature this post
                 </label>
               </div>
               <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                 <Button variant="outline" onClick={() => setShowEditModal(false)} className="w-full sm:w-auto">
                   Cancel
                 </Button>
                 <Button onClick={handleEditPost} disabled={saving} className="bg-mangla-gold hover:bg-mangla-gold/90 w-full sm:w-auto">
                   {saving ? 'Updating...' : 'Update Post'}
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>
       </div>

      {/* Blog Posts List */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mangla-gold mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            <p>No blog posts found</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-2 bg-mangla-gold hover:bg-mangla-gold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {posts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {post.featuredImage && (
                        <div className="flex-shrink-0">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                                                 <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                           <div className="flex items-center gap-1">
                             <User className="w-4 h-4" />
                             {post.authorName || 'Unknown Author'}
                           </div>
                           <div className="flex items-center gap-1">
                             <Calendar className="w-4 h-4" />
                             {formatDate(post.createdAt)}
                           </div>
                           <div className="flex items-center gap-1">
                             <Clock className="w-4 h-4" />
                             {post.readTime} min read
                           </div>
                           <div className="flex items-center gap-1">
                             <Eye className="w-4 h-4" />
                             {post.views} views
                           </div>
                         </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                          <Badge variant="outline">{post.category}</Badge>
                          {post.isFeatured && (
                            <Badge className="bg-mangla-gold text-white">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                                     <div className="flex items-center gap-2 ml-4">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                     >
                       <Eye className="w-4 h-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => openEditModal(post)}
                     >
                       <Edit className="w-4 h-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleDeletePost(post.id)}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BlogManager; 