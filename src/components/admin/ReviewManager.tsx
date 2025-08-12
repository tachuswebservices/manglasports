import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildApiUrl, API_CONFIG } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Edit, Trash2, Search } from 'lucide-react';

type AdminReview = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string | null; email: string };
  product: { id: string; name: string; images: any };
};

const ReviewManager: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = async (opts?: { page?: number; limit?: number; search?: string }) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const url = new URL(buildApiUrl(API_CONFIG.REVIEWS.ADMIN_ALL));
      const p = opts?.page ?? page;
      const l = opts?.limit ?? limit;
      const s = opts?.search ?? search;
      url.searchParams.set('page', String(p));
      url.searchParams.set('limit', String(l));
      url.searchParams.set('search', s);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch reviews (${res.status})`);
      }
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalReviews(data.pagination?.totalReviews || 0);
      setPage(data.pagination?.currentPage || p);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
      setReviews([]);
      setTotalPages(1);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openEdit = (rev: AdminReview) => {
    setEditing(rev);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!token || !editing) return;
    if (editRating < 1 || editRating > 5 || editComment.trim().length < 10) return;
    setSaving(true);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.REVIEWS.ADMIN_BY_ID(editing.id)), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: editRating, comment: editComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update review');
      setEditOpen(false);
      setEditing(null);
      await fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id: number) => {
    if (!token) return;
    setDeletingId(id);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.REVIEWS.ADMIN_BY_ID(id)), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete review');
      }
      await fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews({ page: 1, search });
  };

  const renderStars = (n: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= n ? 'fill-mangla-gold text-mangla-gold' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  const pageStats = useMemo(() => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalReviews);
    return totalReviews > 0 ? `${start}-${end} of ${totalReviews}` : '0 of 0';
  }, [page, limit, totalReviews]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by comment, user or product"
              className="pl-8"
            />
          </div>
          <Button type="submit" className="bg-mangla-gold hover:bg-mangla-blue text-white">Search</Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm text-gray-600">{pageStats}</div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Per page</label>
            <select
              value={limit}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLimit(val);
                fetchReviews({ page: 1, limit: val });
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No reviews found</TableCell>
                </TableRow>
              ) : (
                reviews.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell className="min-w-[180px]">
                      <div className="font-medium">{rev.product?.name || rev.product?.id}</div>
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <div className="text-sm">{rev.user?.name || 'User'} </div>
                      <div className="text-xs text-gray-500">{rev.user?.email}</div>
                    </TableCell>
                    <TableCell>{renderStars(rev.rating)}</TableCell>
                    <TableCell className="max-w-[400px]"><div className="truncate" title={rev.comment}>{rev.comment}</div></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-600">{new Date(rev.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => openEdit(rev)} className="border-mangla-gold text-mangla-gold">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteReview(rev.id)} disabled={deletingId === rev.id} className="border-red-500 text-red-500">
                          <Trash2 className="w-4 h-4 mr-1" /> {deletingId === rev.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => fetchReviews({ page: page - 1 })}>Prev</Button>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => fetchReviews({ page: page + 1 })}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEditRating(n)}
                    className={`p-1 rounded ${editRating >= n ? 'text-mangla-gold' : 'text-gray-300'}`}
                  >
                    <Star className={`w-6 h-6 ${editRating >= n ? 'fill-mangla-gold text-mangla-gold' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment</label>
              <Textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} className="min-h-[100px]" />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} disabled={saving || editRating < 1 || editComment.trim().length < 10} className="flex-1 bg-mangla-gold hover:bg-mangla-blue text-white">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManager;

