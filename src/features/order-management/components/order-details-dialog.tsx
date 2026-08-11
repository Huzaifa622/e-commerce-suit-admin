import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOrder } from '../api/use-order';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderDetailsDialogProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailsDialog({ orderId, onClose }: OrderDetailsDialogProps) {
  const { data: orderResponse, isLoading, isError } = useOrder(orderId || '');

  const order = orderResponse?.data;

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            {order ? `Viewing details for Order ${order._id}` : 'Loading order details...'}
          </DialogDescription>
        </DialogHeader>

        {isLoading && <div className="p-4 text-center">Loading...</div>}
        {isError && <div className="p-4 text-center text-destructive">Failed to load order details.</div>}
        
        {order && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Customer Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Shipping Address</p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Order Items</h4>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.product?.name || item.product?.title || 'Unknown Product'}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.currency} {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {order.currency} {(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Total Amount</p>
                  <p className="text-xl font-bold">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
