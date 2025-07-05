'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { QuickView } from '@/components/QuickView';
import { ComparisonCart } from '@/components/ComparisonCart';
import { useComparison } from '@/contexts/ComparisonContext';
import arGlassesData from '@/data/products';

export default function TestOverlaysPage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem, clearComparison } = useComparison();

  // Add some items to comparison cart for testing
  const setupTestData = () => {
    clearComparison();
    addItem(arGlassesData[0].id);
    addItem(arGlassesData[1].id);
    addItem(arGlassesData[2].id);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Z-Index Testing Page</h1>
        
        <div className="space-y-8">
          {/* Test Setup */}
          <section className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Test Setup</h2>
            <Button onClick={setupTestData}>Add Items to Comparison Cart</Button>
          </section>

          {/* Basic Components */}
          <section className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Basic Overlay Components</h2>
            <div className="flex gap-4 flex-wrap">
              {/* Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Test</DialogTitle>
                  </DialogHeader>
                  <p>This is a dialog. Z-index: var(--z-modal)</p>
                  
                  {/* Nested Tooltip inside Dialog */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover for Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltip inside Dialog</p>
                    </TooltipContent>
                  </Tooltip>
                </DialogContent>
              </Dialog>

              {/* Alert Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Open Alert</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alert Dialog</AlertDialogTitle>
                    <AlertDialogDescription>
                      This is an alert dialog. Should appear above regular dialogs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>This is a popover. Z-index: var(--z-popover)</p>
                </PopoverContent>
              </Popover>

              {/* Select */}
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>

              {/* Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Basic Tooltip</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </section>

          {/* Quick View Test */}
          <section className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Quick View Modal</h2>
            <Button 
              onClick={() => {
                setQuickViewProduct(arGlassesData[0]);
                setShowQuickView(true);
              }}
            >
              Open Quick View
            </Button>
          </section>

          {/* Complex Nesting Tests */}
          <section className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Complex Overlay Combinations</h2>
            
            {/* Dialog with nested components */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Dialog with Nested Components</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Complex Dialog</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>This dialog contains multiple nested overlay components:</p>
                  
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">Popover in Dialog</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p>This popover is inside a dialog</p>
                      </PopoverContent>
                    </Popover>

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select in Dialog" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nested1">Nested Option 1</SelectItem>
                        <SelectItem value="nested2">Nested Option 2</SelectItem>
                      </SelectContent>
                    </Select>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">Tooltip in Dialog</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tooltip inside Dialog</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          {/* Z-Index Hierarchy Display */}
          <section className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Z-Index Hierarchy</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>--z-base: 0</div>
              <div>--z-dropdown: 50</div>
              <div>--z-sticky: 100 (Navigation)</div>
              <div>--z-fixed: 150</div>
              <div>--z-cart: 200 (Comparison Cart)</div>
              <div>--z-modal-backdrop: 250</div>
              <div>--z-modal: 300 (Dialogs, Quick View)</div>
              <div>--z-popover: 350</div>
              <div>--z-tooltip: 400</div>
              <div>--z-notification: 450</div>
              <div>--z-max: 500</div>
            </div>
          </section>
        </div>

        {/* Quick View Modal */}
        <QuickView 
          product={quickViewProduct}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setQuickViewProduct(null);
          }}
        />

        {/* Comparison Cart (should be visible) */}
        <ComparisonCart onQuickView={(product) => {
          setQuickViewProduct(product);
          setShowQuickView(true);
        }} />
      </div>
    </TooltipProvider>
  );
}