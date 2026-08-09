'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, MoreHorizontal, Image as ImageIcon, Film, Play, Trash2, Pencil, X, Loader2 } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/features/product-management/api/products-queries';
import { useCategories } from '@/features/category-management/api/categories-queries';
import { IProduct } from '@/models/product-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/common/rich-text-editor';
import { toast } from 'sonner';
import axios from '@/lib/axios'; // local custom instance
import axiosDirect from 'axios';  // standard vanilla instance for Cloudinary direct upload

const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number({ message: 'Price is required' }).positive('Price must be greater than zero'),
  stock: z.number({ message: 'Stock is required' }).int().positive('Stock must be greater than zero'),
  description: z.string().min(1, 'Description is required'),
});

type AddProductFormData = z.infer<typeof addProductSchema>;

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL or use defaults
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchStr = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchStr);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Media upload state
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number; status: 'uploading' | 'success' | 'error' }>>({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: productsData, isLoading, isError } = useProducts({
    page,
    limit,
    search: searchStr || undefined,
  });

  const { data: categoriesData } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = (product: IProduct) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('category', (product.category as any)?._id || (product.category as any)?.toString() || '');
    setValue('price', product.price);
    setValue('stock', product.stock);
    setValue('description', product.description);
    setImagesList(product.images || []);
    setVideoUrl(product.video || '');
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingProduct(null);
      reset({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
      });
      setImagesList([]);
      setVideoUrl('');
      setUploadProgress({});
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
    },
  });

  // Manually register custom editor field
  useEffect(() => {
    register('description');
  }, [register]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1 on search
    router.push(`/products?${params.toString()}`);
  };

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  // Client-side Cloudinary Upload for Multiple Images
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    for (const file of files) {
      try {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { name: file.name, progress: 0, status: 'uploading' },
        }));

        // Get signature from upload route API
        const signatureRes = await axios.post('/api/upload');
        const { timestamp, signature, cloudName, apiKey } = signatureRes.data;

        // Post directly to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', 'ecommerce_admin');

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const response = await axiosDirect.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
            );
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: { name: file.name, progress: percent, status: 'uploading' },
            }));
          },
        });

        setImagesList((prev) => [...prev, response.data.secure_url]);
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { name: file.name, progress: 100, status: 'success' },
        }));
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error(`Failed to upload image "${file.name}"`);
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { name: file.name, progress: 0, status: 'error' },
        }));
      }
    }
    setIsUploading(false);
  };

  // Client-side Cloudinary Upload for Video
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsUploading(true);
    try {
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: { name: file.name, progress: 0, status: 'uploading' },
      }));

      // Get signature from upload route API
      const signatureRes = await axios.post('/api/upload');
      const { timestamp, signature, cloudName, apiKey } = signatureRes.data;

      // Post directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', 'ecommerce_admin');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

      const response = await axiosDirect.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          );
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { name: file.name, progress: percent, status: 'uploading' },
          }));
        },
      });

      setVideoUrl(response.data.secure_url);
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: { name: file.name, progress: 100, status: 'success' },
      }));
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Video upload failed:', error);
      toast.error(`Failed to upload video "${file.name}"`);
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: { name: file.name, progress: 0, status: 'error' },
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImageUrl = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddProductFormData) => {
    if (imagesList.length === 0) {
      toast.error('At least one product image is required');
      return;
    }
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: (editingProduct._id as any)?.toString(),
          updatedData: {
            ...data,
            images: imagesList,
            video: videoUrl || undefined,
          },
        });
        toast.success('Product updated successfully');
      } else {
        await createProductMutation.mutateAsync({
          ...data,
          images: imagesList,
          video: videoUrl || undefined,
        });
        toast.success('Product created successfully');
      }
      // Reset form and close dialog
      reset();
      setImagesList([]);
      setVideoUrl('');
      setUploadProgress({});
      setEditingProduct(null);
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-xs text-zinc-500 font-normal">Manage your store's inventory and catalog.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <Button 
            onClick={() => {
              setEditingProduct(null);
              reset({
                name: '',
                category: '',
                price: 0,
                stock: 0,
                description: '',
              });
              setImagesList([]);
              setVideoUrl('');
              setUploadProgress({});
              setDialogOpen(true);
            }} 
            className="shrink-0 text-xs shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add New Product
          </Button>
          <DialogContent
            className="max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            style={{ width: '50vw', maxWidth: '50vw' }}
          >
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modify the product details below.' : 'Create a new product listing with rich media attachments.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="e.g. Premium Wool Coat" {...register('name')} />
                  {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="max-w-xs">
                          {categoriesData?.data?.map((cat) => (
                            <SelectItem key={String(cat._id)} value={String(cat._id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-[10px] text-destructive">{errors.category.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" {...register('price', { valueAsNumber: true })} />
                  {errors.price && <p className="text-[10px] text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock Count</Label>
                  <Input id="stock" type="number" placeholder="0" {...register('stock', { valueAsNumber: true })} />
                  {errors.stock && <p className="text-[10px] text-destructive">{errors.stock.message}</p>}
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  value={watch('description') || ''}
                  onChange={(val) => setValue('description', val, { shouldValidate: true })}
                  placeholder="Provide a detailed product description..."
                />
                {errors.description && <p className="text-[10px] text-destructive">{errors.description.message}</p>}
              </div>

              {/* Media Picker Component */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-zinc-900 dark:text-zinc-55">Product Media</Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Images Upload Button */}
                  <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-zinc-900/10 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <ImageIcon className="h-6 w-6 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-2">Upload Images</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Select multiple images</span>
                  </div>

                  {/* Video Upload Button */}
                  <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-zinc-900/10 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      disabled={isUploading || !!videoUrl}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Film className="h-6 w-6 text-zinc-400 group-hover:text-[#5030E5] transition-colors" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-2">Upload Video</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Select exactly one video file</span>
                  </div>
                </div>

                {/* Upload Progress Section */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-150/60 dark:border-zinc-850">
                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Uploading Files</h5>
                    {Object.values(uploadProgress).map((file) => (
                      <div key={file.name} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="truncate max-w-[200px] text-zinc-650 dark:text-zinc-300 font-medium">{file.name}</span>
                          <span className="font-semibold text-zinc-500">
                            {file.status === 'success' ? (
                              <span className="text-emerald-600 font-bold">Complete</span>
                            ) : file.status === 'error' ? (
                              <span className="text-destructive font-bold">Failed</span>
                            ) : (
                              `${file.progress}%`
                            )}
                          </span>
                        </div>
                        {file.status === 'uploading' && (
                          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#5030E5] transition-all duration-150" style={{ width: `${file.progress}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Previews Grid */}
                {(imagesList.length > 0 || videoUrl) && (
                  <div className="space-y-2 mt-2">
                    <Label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Uploaded Media Previews</Label>
                    <div className="flex flex-wrap gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10">

                      {/* Image Previews */}
                      {imagesList.map((url, index) => (
                        <div key={index} className="relative group h-20 w-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`preview ${index}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="absolute -top-1.5 -right-1.5 p-1 bg-destructive hover:bg-destructive/90 rounded-full text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {/* Video Preview */}
                      {videoUrl && (
                        <div className="relative group h-20 w-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black shrink-0">
                          <video src={videoUrl} className="h-full w-full object-cover" controls={false} />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="h-5 w-5 text-white/80" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setVideoUrl('')}
                            className="absolute -top-1.5 -right-1.5 p-1 bg-destructive hover:bg-destructive/90 rounded-full text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setImagesList([]);
                    setVideoUrl('');
                    setUploadProgress({});
                    setEditingProduct(null);
                    setDialogOpen(false);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending || isUploading}
                  className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createProductMutation.isPending || updateProductMutation.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingProductId(null);
        }}>
          <DialogContent 
            className="max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            style={{ width: '400px', maxWidth: '90vw' }}
          >
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeletingProductId(null);
                  setDeleteDialogOpen(false);
                }}
                disabled={deleteProductMutation.isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deletingProductId) {
                    try {
                      await deleteProductMutation.mutateAsync(deletingProductId);
                      toast.success('Product deleted successfully');
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to delete product');
                    } finally {
                      setDeletingProductId(null);
                      setDeleteDialogOpen(false);
                    }
                  }
                }}
                disabled={deleteProductMutation.isPending}
                className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-semibold">Product List</CardTitle>
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 text-xs py-1.5 rounded-lg focus-visible:ring-1 focus-visible:ring-zinc-400 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
                <TableRow>
                  <TableHead className="text-xs">Product Info</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Price</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Stock</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Created At</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px] rounded-full" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[40px]" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-xs text-destructive">
                      Error loading products. Please try again.
                    </TableCell>
                  </TableRow>
                ) : !productsData?.data || productsData.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-xs text-zinc-400">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  productsData.data.map((product) => (
                    <TableRow key={String(product._id)} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 group">
                      <TableCell className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <div className="relative h-10 w-10 rounded-md overflow-hidden border border-zinc-150 dark:border-zinc-800 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                              {product.video && (
                                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                                  <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
                                    <Play className="h-2 w-2 text-[#5030E5] fill-current ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-100 dark:border-zinc-800">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</span>
                            {product.video && (
                              <span className="text-[9px] text-[#5030E5] dark:text-[#8c74e8] font-bold mt-0.5 flex items-center gap-0.5">
                                📹 Media Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{(product.category as any)?.name || 'General'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={product.inStock ? 'default' : 'secondary'}
                          className={product.inStock ? 'bg-emerald-500/10 text-emerald-600 border-0 text-[10px]' : 'text-[10px]'}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs hidden md:table-cell">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-xs hidden md:table-cell font-mono">{product.stock}</TableCell>
                      <TableCell className="text-xs hidden lg:table-cell text-zinc-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 min-h-7 items-center">
                          {deleteProductMutation.isPending && deleteProductMutation.variables === String(product._id) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-[#5030E5] mr-2" />
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon-xs" 
                                onClick={() => handleEditClick(product as any)} 
                                className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-md"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon-xs" 
                                onClick={() => handleDeleteClick(String(product._id))} 
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {productsData?.meta && productsData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-zinc-500">
                Showing page {productsData.meta.page} of {productsData.meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productsData.meta.page <= 1}
                  onClick={() => changePage(productsData.meta.page - 1)}
                  className="text-xs h-7"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productsData.meta.page >= productsData.meta.totalPages}
                  onClick={() => changePage(productsData.meta.page + 1)}
                  className="text-xs h-7"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60 mt-2" />
          </div>
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-72 rounded-md" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
