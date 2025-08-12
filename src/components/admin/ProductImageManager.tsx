import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Upload, Plus, Check, ShieldAlert, Trash, Trash2 } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface ProductImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: any[];
  loading: boolean;
  error: string;
  onUpload: (files: FileList) => void;
  onDelete: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onDragEnd: (event: any) => void;
  onAddImages: () => void;
  onRemoveImage: (img: { url: string, publicId: string }) => void;
  imageManagerFiles: File[];
  imageManagerPreviews: string[];
  imageManagerProgress: number[];
  imageManagerDeleting: string | null;
  imageManagerSaving: boolean;
  imageManagerError: string;
  setImageManagerFiles: (files: File[]) => void;
  setImageManagerPreviews: (previews: string[]) => void;
  setImageManagerProgress: (progress: number[]) => void;
  setImageManagerError: (error: string) => void;
}

// Sortable image item component
function SortableImage({ 
  img, 
  idx, 
  onRemove, 
  deleteMode, 
  deleting 
}: { 
  img: { url: string, publicId: string }, 
  idx: number, 
  onRemove: (img: { url: string, publicId: string }) => void, 
  deleteMode: boolean,
  deleting: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.publicId || img.url });
  
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="relative cursor-move"
      {...attributes}
      {...listeners}
    >
      <img 
        src={img.url} 
        alt={`Image ${idx + 1}`} 
        className={`max-h-32 rounded border ${deleteMode ? 'border-red-500' : ''}`} 
      />
      {deleteMode && (
        <button
          type="button"
          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
          onClick={e => { e.stopPropagation(); onRemove(img); }}
          aria-label="Remove image"
          disabled={deleting}
        >
          {deleting ? (
            <span className="animate-spin">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/>
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
        </button>
      )}
    </div>
  );
}

export default function ProductImageManager({
  open, 
  onOpenChange, 
  images, 
  loading, 
  error, 
  onUpload, 
  onDelete, 
  onSave, 
  onCancel,
  onDragEnd,
  onAddImages,
  onRemoveImage,
  imageManagerFiles,
  imageManagerPreviews,
  imageManagerProgress,
  imageManagerDeleting,
  imageManagerSaving,
  imageManagerError,
  setImageManagerFiles,
  setImageManagerPreviews,
  setImageManagerProgress,
  setImageManagerError
}: ProductImageManagerProps) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [confirmDeleteImg, setConfirmDeleteImg] = useState<{ url: string, publicId: string } | null>(null);
  
  const sensors = useSensors(useSensor(PointerSensor));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        file => file.type === 'image/jpeg' || file.type === 'image/png'
      );
      setImageManagerFiles(files);
      setImageManagerPreviews(files.map(file => URL.createObjectURL(file)));
      setImageManagerProgress(Array(files.length).fill(0));
    }
  };

  const handleRemoveImage = (img: { url: string, publicId: string }) => {
    setConfirmDeleteImg(img);
  };

  const confirmDelete = async () => {
    if (confirmDeleteImg) {
      await onRemoveImage(confirmDeleteImg);
      setConfirmDeleteImg(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-mangla-gold">
          <DialogHeader>
            <DialogTitle className="text-mangla-gold">Manage Product Images</DialogTitle>
          </DialogHeader>
          
          <div className="mb-2 text-sm text-muted-foreground">
            Drag to reorder. Add or remove images as needed.
          </div>

          {/* Image Display */}
          {deleteMode ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {images.map((img, idx) => (
                <SortableImage
                  key={img.publicId || img.url}
                  img={img}
                  idx={idx}
                  deleteMode={deleteMode}
                  onRemove={handleRemoveImage}
                  deleting={imageManagerDeleting === img.publicId}
                />
              ))}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={images.map(img => img.publicId || img.url)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {images.map((img, idx) => (
                    <SortableImage
                      key={img.publicId || img.url}
                      img={img}
                      idx={idx}
                      deleteMode={deleteMode}
                      onRemove={handleRemoveImage}
                      deleting={imageManagerDeleting === img.publicId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Add new images */}
          <div className="mb-2">
            <input
              id="image-manager-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={() => document.getElementById('image-manager-upload')?.click()} 
                    disabled={imageManagerFiles.length > 0 || imageManagerProgress.some(p => p > 0 && p < 100)} 
                    aria-label="Add Images"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Images</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Show previews and upload progress for new images */}
          {imageManagerPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {imageManagerPreviews.map((preview, idx) => (
                <div key={preview} className="relative">
                  <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border opacity-60" />
                  {imageManagerProgress[idx] !== undefined && (
                    <div className="absolute left-1 bottom-1 right-1 bg-white/80 rounded px-1 py-0.5 text-xs text-blue-700 font-semibold flex items-center">
                      {imageManagerProgress[idx] < 100 ? (
                        <>
                          <span>Uploading: {imageManagerProgress[idx]}%</span>
                          <span className="ml-1 animate-spin">
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/>
                              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                          </span>
                        </>
                      ) : (
                        <span>Uploaded</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {imageManagerFiles.length > 0 && (
            <Button 
              type="button" 
              onClick={onAddImages} 
              disabled={imageManagerProgress.some(p => p > 0 && p < 100)}
            >
              Upload Selected Images
            </Button>
          )}

          {imageManagerError && (
            <div className="text-red-500 text-sm mt-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {imageManagerError}
            </div>
          )}

          {/* Delete Mode Toggle */}
          <div className="flex items-center justify-between mb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={deleteMode ? 'destructive' : 'outline'}
                    onClick={() => setDeleteMode(v => !v)}
                    aria-label={deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {deleteMode && (
              <span className="flex items-center text-xs text-red-600 font-semibold ml-2">
                <ShieldAlert className="w-4 h-4 mr-1" />
                Delete Mode is active. Click the cross to delete images.
              </span>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button 
              variant="secondary" 
              onClick={onCancel} 
              disabled={imageManagerSaving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSave} 
              disabled={imageManagerSaving}
              className="w-full sm:w-auto bg-mangla-gold hover:bg-mangla-gold/90"
            >
              {imageManagerSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete dialog */}
      {confirmDeleteImg && (
        <AlertDialog open={true} onOpenChange={(open) => { if (!open) setConfirmDeleteImg(null); }}>
          <AlertDialogContent className="max-w-xs w-full">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="mb-2 text-sm text-red-600">
              Are you sure you want to delete this image? This cannot be undone.
            </div>
            <img src={confirmDeleteImg.url} alt="To delete" className="max-h-32 rounded border mb-2" />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmDeleteImg(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
} 