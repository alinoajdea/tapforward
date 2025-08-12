import Link from "next/link";
import { ResetConsentButton } from "@/components/ResetConsentButton";
export default function Footer() {
  return (
    <footer className="py-8 bg-white border-t text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} TapForward. Built for privacy-first
      viral messaging.
      <br />
      <span className="mt-1 block">
        <Link href="/privacy" className="hover:underline mx-2">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline mx-2">
          Terms
        </Link>
        <a href="mailto:hello@tapforward.com" className="hover:underline mx-2">
          Contact
        </a>
        <ResetConsentButton />
      </span>
    </footer>
  );
}
