import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="bg-background px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground sm:rounded-[2.5rem] sm:p-14 lg:p-20">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-headline text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Ready to start practicing?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed opacity-90 sm:mt-5 sm:text-xl">
              Create a free account, enroll in a course and take your first quiz
              today.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-ink px-8 text-base text-ink-foreground shadow-float hover:bg-ink/90"
            >
              <Link href="/sign-up">
                Create free account
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-14 rounded-full border border-primary-foreground/40 px-8 text-base text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
