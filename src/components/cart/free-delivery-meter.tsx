import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const { freeOver } = siteConfig.fulfillment.delivery;
  const remaining = Math.max(0, freeOver - subtotal);
  const progress = Math.min(100, (subtotal / freeOver) * 100);

  return (
    <div>
      <p className="text-xs text-mist">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="text-gold-200">{formatPrice(remaining)}</span> away from free local delivery.
          </>
        ) : (
          <span className="text-gold-200">You&apos;ve unlocked free local delivery.</span>
        )}
      </p>
      <div className="mt-2.5 h-px w-full bg-ink-600">
        <div className="bg-gold-gradient h-px transition-[width] duration-700 ease-luxe" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
