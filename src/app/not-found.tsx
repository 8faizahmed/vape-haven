import { ButtonLink } from "@/components/ui/button";
import { Accent, Ornament } from "@/components/ui/section-heading";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-display text-[8rem] leading-none text-gold-gradient sm:text-[11rem]">404</p>
      <Ornament className="mt-4" />
      <h1 className="mt-8 font-display text-4xl font-medium sm:text-5xl">
        This page has <Accent>drifted off.</Accent>
      </h1>
      <p className="mt-4 max-w-md text-sm text-mist">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Shop the collection
        </ButtonLink>
      </div>
    </section>
  );
}
