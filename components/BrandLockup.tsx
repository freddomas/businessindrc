import Image from "next/image";
import Link from "next/link";
import { BRAND } from "../lib/brand";

type BrandLockupProps = {
  className?: string;
  href?: string;
  priority?: boolean;
};

export function BrandLockup({ className = "", href = "/", priority = false }: BrandLockupProps) {
  return (
    <Link className={`brand-lockup ${className}`.trim()} href={href} aria-label={BRAND.name}>
      <span className="brand-symbol" aria-hidden="true">
        <Image
          src="/media/octopus-expertise-mark.png"
          alt="Emblème Octopus Expertise"
          data-media-id="octopus-expertise-mark"
          width={1646}
          height={331}
          priority={priority}
          sizes="(max-width: 640px) 150px, 190px"
        />
      </span>
      <span className="brand-word">EXPERTISE</span>
    </Link>
  );
}
