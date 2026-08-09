'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/category-management/api/categories-queries';
import { ICategory } from '@/models/category-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const { data: categoriesData, isLoading, isError } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleEditClick = (category: ICategory) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingCategory(null);
      reset({
        name: '',
        description: '',
      });
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: (editingCategory._id as any)?.toString(),
          updatedData: data,
        });
        toast.success('Category updated successfully');
      } else {
        await createCategoryMutation.mutateAsync(data);
        toast.success('Category created successfully');
      }
      reset();
      setEditingCategory(null);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const filteredCategories = categoriesData?.data?.filter((category) =>
    category.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchInput.toLowerCase()))
  ) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-xs text-zinc-500">Manage categories to organize your products.</p>
        </div>
        
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <Button 
            onClick={() => {
              setEditingCategory(null);
              reset({
                name: '',
                description: '',
              });
              setOpen(true);
            }} 
            className="shrink-0 text-xs shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Category
          </Button>
          <DialogContent 
            className="max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            style={{ width: '450px', maxWidth: '90vw' }}
          >
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Modify the category details below.' : 'Create a new category to group related items in your catalog.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. 2 piece, Accessories"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe this category"
                  {...register('description')}
                />
              </div>
              <DialogFooter className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    reset();
                    setEditingCategory(null);
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending ? 'Saving...' : editingCategory ? 'Update Category' : 'Save Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={(isOpen) => {
          setDeleteDialogOpen(isOpen);
          if (!isOpen) setDeletingCategoryId(null);
        }}>
          <DialogContent 
            className="max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            style={{ width: '400px', maxWidth: '90vw' }}
          >
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone and may affect associated products.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeletingCategoryId(null);
                  setDeleteDialogOpen(false);
                }}
                disabled={deleteCategoryMutation.isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deletingCategoryId) {
                    try {
                      await deleteCategoryMutation.mutateAsync(deletingCategoryId);
                      toast.success('Category deleted successfully');
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Failed to delete category');
                    } finally {
                      setDeletingCategoryId(null);
                      setDeleteDialogOpen(false);
                    }
                  }
                }}
                disabled={deleteCategoryMutation.isPending}
                className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-semibold">Category List</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 text-xs py-1.5 rounded-lg focus-visible:ring-1 focus-visible:ring-zinc-400 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Slug</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Created At</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-xs text-destructive">
                      Error loading categories. Please refresh.
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-xs text-zinc-400">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={String(category._id)} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 group">
                      <TableCell className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{category.name}</TableCell>
                      <TableCell className="text-xs text-zinc-500 font-mono">{category.slug}</TableCell>
                      <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 hidden md:table-cell">{category.description || '-'}</TableCell>
                      <TableCell className="text-xs text-zinc-500 hidden lg:table-cell">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 min-h-7 items-center">
                          {deleteCategoryMutation.isPending && deleteCategoryMutation.variables === String(category._id) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-[#5030E5] mr-2" />
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon-xs" 
                                onClick={() => handleEditClick(category)} 
                                className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-md"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon-xs" 
                                onClick={() => handleDeleteClick(String(category._id))} 
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
        </CardContent>
      </Card>
    </div>
  );
}
