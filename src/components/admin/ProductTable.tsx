import { Button } from '../ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Pencil, Trash, Upload, ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface ProductTableProps {
  products: any[];
  categories: any[];
  brands: any[];
  page: number;
  limit: number;
  totalPages: number;
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
  onManageImages: (product: any) => void;
  onPageChange: (newPage: number) => void;
  removingProductId: string | null;
  removeProductError: string;
}

export default function ProductTable({
  products, categories, brands, page, limit, totalPages,
  onEdit, onDelete, onManageImages, onPageChange,
  removingProductId, removeProductError
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <table className="min-w-full">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th className="px-4 py-2 text-left w-8">#</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={product.id} className="border-b hover:bg-accent/30 transition">
              <td className="px-4 py-2">
                <span className={
                  `inline-block min-w-[2rem] px-2 py-1 text-xs font-bold text-white rounded-md text-center ` +
                  (product.inStock ? 'bg-green-500/90' : 'bg-red-500/90')
                }>
                  {(page - 1) * limit + idx + 1}
                </span>
              </td>
              <td className="px-4 py-2 font-medium">{product.name}</td>
              <td className="px-4 py-2">{categories.find(c => c.id === product.categoryId)?.name || '-'}</td>
              <td className="px-4 py-2">₹{product.numericPrice}</td>
              <td className="px-4 py-2 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={() => onEdit(product)} aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="destructive" onClick={() => onDelete(product)} aria-label="Delete">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={() => onManageImages(product)} aria-label="Manage Images">
                        <Image className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Manage Images</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous Page">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`px-3 py-1 rounded ${p === page ? 'bg-mangla-gold text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >
              {p}
            </button>
          ))}
          <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next Page">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
      {removeProductError && <div className="text-red-500 mt-2 px-4 pb-4">{removeProductError}</div>}
    </div>
  );
} 