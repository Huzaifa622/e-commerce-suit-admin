'use client';
import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOrders } from '../api/use-orders';
import { OrderDetailsDialog } from './order-details-dialog';
import { UpdateStatusDialog } from './update-status-dialog';
import { Order } from '../types';
import { useDebounce } from '@/hooks/use-debounce';

interface OrderTableProps {
  searchQuery: string;
}

export function OrderTable({ searchQuery }: OrderTableProps) {
  const debouncedSearch = useDebounce(searchQuery, 600);
  const [page, setPage] = useState(1);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);
  const [updateOrder, setUpdateOrder] = useState<Order | null>(null);

  const { data: response, isLoading, isError } = useOrders({ search: debouncedSearch, page, limit: 10 });
  const orders = response?.data || [];
  const meta = response?.meta;

  // Debug: useEffect is needed because React Compiler (reactCompiler: true in next.config.ts)
  // skips re-executing side effects like bare console.log
  useEffect(() => {
    console.log('debouncedSearch:', debouncedSearch);
  }, [debouncedSearch]);

  // Determine what to show in the table body — never early-return above,
  // as that unmounts the component and resets all hooks (including useDebounce).
  const renderBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            Loading orders...
          </TableCell>
        </TableRow>
      );
    }
    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Failed to load orders.
          </TableCell>
        </TableRow>
      );
    }
    if (orders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No orders found.
          </TableCell>
        </TableRow>
      );
    }
    return orders.map((order) => (
      <TableRow key={order._id} className="group transition-colors hover:bg-muted/50">
        <TableCell className="font-medium text-xs">
          {order._id.substring(0, 8).toUpperCase()}...
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{order.customerName}</span>
            <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant={order.status === 'delivered' ? 'default' : 'secondary'}
            className={
              order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-200' :
                order.status === 'shipped' ? 'bg-blue-500/15 text-blue-600 border-blue-200' :
                  order.status === 'cancelled' ? 'bg-red-500/15 text-red-600 border-red-200' :
                    'bg-amber-500/15 text-amber-600 border-amber-200'
            }
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {order.currency} {order.totalAmount.toFixed(2)}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          {new Date(order.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDetailsOrderId(order._id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUpdateOrder(order)}>
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderBody()}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.page - 1)}
              disabled={meta.page <= 1}
            >
              Previous
            </Button>
            <div className="text-sm font-medium mx-2">
              Page {meta.page} of {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <OrderDetailsDialog
        orderId={detailsOrderId}
        onClose={() => setDetailsOrderId(null)}
      />
      <UpdateStatusDialog
        order={updateOrder}
        onClose={() => setUpdateOrder(null)}
      />
    </>
  );
}
