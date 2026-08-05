import Link from "next/link";
import { Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream pb-24 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl text-ink">The Peachy</p>
          <p className="mt-2 max-w-xs text-sm text-ink-muted">
            Seoulful temptations in the heart of Toronto. Everything is just peachy!
          </p>
          <a
            href="https://www.instagram.com/thepeachy_official"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="The Peachy on Instagram"
            data-analytics-id="footer-instagram"
            className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink hover:border-peach hover:text-peach"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>

        <div>
          <p className="font-heading text-base text-ink">Visit Us</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>14B - 5650 Yonge St, North York (Main)</li>
            <li>618 Yonge St, Toronto</li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-base text-ink">Hours</p>
          <ul className="mt-3 space-y-1 text-sm text-ink-muted">
            <li>Mon-Fri: 8:00am - 9:30pm</li>
            <li>Sat: 11:00am - 9:30pm</li>
            <li>Sun: 11:00am - 7:00pm</li>
          </ul>
          <p className="mt-3 text-sm text-ink-muted">
            <a href="tel:4162188828" className="hover:text-peach">416-218-8828</a>
            {" · "}
            <a href="mailto:info@thepeachy.ca" className="hover:text-peach">info@thepeachy.ca</a>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-ink-faint sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} The Peachy. <Link href="/contact" className="hover:text-peach">Contact</Link>
        </p>
      </div>
    </footer>
  );
}
