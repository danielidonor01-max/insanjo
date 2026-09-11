import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { X, Phone, Store, ArrowUpRight } from "lucide-react";
import { formatPrice } from "../../utils/currency";

function getStockLabel(availableStock) {
  if (availableStock == null) return null;
  if (availableStock === 0) return { label: "Out of stock", cls: "text-store-destructive" };
  if (availableStock <= 5) return { label: `Low stock · ${availableStock} left`, cls: "text-amber-600 dark:text-amber-400" };
  return { label: `In stock · ${availableStock} available`, cls: "text-emerald-600 dark:text-emerald-400" };
}

export default function ProductQuickView({ product, storeId, vendorName, vendorPhone, open, onOpenChange }) {
  if (!product) return null;
  const stock = getStockLabel(product.availableStock);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 animate-overlay-in bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-95 flex max-h-[92vh] animate-rise-in flex-col overflow-y-auto rounded-t-store-section border border-store-border bg-store-surface outline-none sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85vh] sm:w-full sm:max-w-2xl sm:flex-row sm:overflow-hidden sm:rounded-store-section"
        >
          <Dialog.Title className="sr-only">{product.name || "Product details"}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Product details for {product.name || "this item"}
          </Dialog.Description>

          <Dialog.Close
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-store-surface/90 text-store-fg shadow-sm backdrop-blur-sm transition-colors hover:bg-store-surface-hover"
          >
            <X size={16} />
          </Dialog.Close>

          <div className="aspect-square w-full shrink-0 bg-store-bg sm:aspect-auto sm:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:w-1/2 sm:overflow-y-auto sm:p-6">
            <div>
              <h2 className="font-serif text-xl font-semibold leading-tight text-store-fg sm:text-2xl">
                {product.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                {product.price != null && (
                  <span className="text-lg font-bold text-store-fg">
                    {formatPrice(product.price, product.currency)}
                  </span>
                )}
                {stock && <span className={`text-xs font-medium ${stock.cls}`}>{stock.label}</span>}
              </div>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-store-muted-fg">{product.description}</p>
            )}

            <div className="mt-2 flex flex-col gap-3 border-t border-store-border pt-4">
              {vendorName && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-store-fg">
                    <Store size={15} className="text-store-muted" />
                    <span className="truncate font-medium">{vendorName}</span>
                  </div>
                  {storeId && (
                    <Link
                      to={`/store/${storeId}`}
                      onClick={() => onOpenChange(false)}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-store-primary hover:opacity-80"
                    >
                      Visit store
                      <ArrowUpRight size={12} />
                    </Link>
                  )}
                </div>
              )}

              <div className="flex gap-2.5">
                {vendorPhone && (
                  <a
                    href={`tel:${vendorPhone}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-store-button bg-store-primary px-4 py-2.5 text-sm font-semibold text-store-primary-fg transition-opacity hover:opacity-90"
                  >
                    <Phone size={14} />
                    Call Vendor
                  </a>
                )}
                <Link
                  to={`/product/${product.id}`}
                  className="inline-flex items-center justify-center gap-1 rounded-store-button border border-store-border px-4 py-2.5 text-sm font-semibold text-store-fg transition-colors hover:bg-store-surface-hover"
                >
                  Full details
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
