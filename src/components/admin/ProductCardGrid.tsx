import { Button } from '../ui/button';
import { Edit, Trash2, Image, Package, Tag, IndianRupee } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ProductCardGridProps {
  products: any[];
  categories: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
  onManageImages?: (product: any) => void;
  removingProductId: string | null;
}

export default function ProductCardGrid({
  products, categories, onEdit, onDelete, onManageImages, removingProductId
}: ProductCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map(product => (
        <div key={product.id} className="group rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          {/* Image Section */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
                alt={product.name} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Image className="w-12 h-12 text-slate-400" />
              </div>
            )}
            {/* Image count badge */}
            {product.images && product.images.length > 0 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {product.images.length}
              </div>
            )}
            {/* Quick action overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 bg-white/90 hover:bg-white text-slate-700"
                        onClick={() => onEdit(product)}
                        disabled={removingProductId === product.id}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Product</TooltipContent>
                  </Tooltip>
                  {onManageImages && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8 bg-white/90 hover:bg-white text-slate-700"
                          onClick={() => onManageImages(product)}
                          disabled={removingProductId === product.id}
                        >
                          <Image className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Manage Images</TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Product Name */}
            <div className="font-semibold text-lg text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
              {product.name}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-mangla-gold" />
              <span className="text-mangla-gold font-bold text-xl">
                {product.numericPrice?.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Tag className="w-4 h-4" />
              <span className="truncate">
                {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-slate-400" />
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="flex-1 h-8"
                      onClick={() => onEdit(product)}
                      disabled={removingProductId === product.id}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Product</TooltipContent>
                </Tooltip>
                
                {onManageImages && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="flex-1 h-8"
                        onClick={() => onManageImages(product)}
                        disabled={removingProductId === product.id}
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Manage Images</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="flex-1 h-8"
                      onClick={() => onDelete(product.id)}
                      disabled={removingProductId === product.id}
                    >
                      {removingProductId === product.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Product</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 