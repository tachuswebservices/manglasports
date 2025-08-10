import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Mail, Truck, CheckCircle, XCircle } from 'lucide-react';

interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'shipped' | 'delivered' | 'rejected';
  orderId: number;
  loading?: boolean;
}

const EmailConfirmationDialog: React.FC<EmailConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  status,
  orderId,
  loading = false
}) => {
  const getStatusInfo = () => {
    if (status === 'shipped') {
      return {
        title: 'Send Shipping Confirmation Email',
        description: `Would you like to send a shipping confirmation email to the customer for Order #${orderId}?`,
        icon: Truck,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else if (status === 'delivered') {
      return {
        title: 'Send Delivery Confirmation Email',
        description: `Would you like to send a delivery confirmation email to the customer for Order #${orderId}?`,
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        title: 'Send Order Rejection Email',
        description: `Would you like to send an order rejection notification email to the customer for Order #${orderId}?`,
        icon: XCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const getEmailDescription = () => {
    if (status === 'shipped') {
      return 'Shipping Update Email';
    } else if (status === 'delivered') {
      return 'Delivery Confirmation Email';
    } else {
      return 'Order Rejection Email';
    }
  };

  const getEmailDetails = () => {
    if (status === 'shipped') {
      return 'Customer will receive an email with order status update and tracking information.';
    } else if (status === 'delivered') {
      return 'Customer will receive an email with order status update and tracking information.';
    } else {
      return 'Customer will receive an email notifying them that their order has been rejected.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${statusInfo.iconColor}`} />
            {statusInfo.title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {statusInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">
                {getEmailDescription()}
              </p>
              <p className="text-sm text-gray-600">
                {getEmailDetails()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmationDialog; 