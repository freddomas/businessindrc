import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPublicMediaAssets } from "../lib/seed-data";

export function EditorialMedia() {
  const assets = getPublicMediaAssets().filter((asset) => asset.url).slice(0, 3);
  const [lead, ...supportAssets] = assets;

  if (!lead) {
    return null;
  }

  return (
    <aside className="editorial-media" aria-label="Scenes de qualification et coordination">
      <figure className="editorial-media__lead">
        <Image
          src={lead.url!}
          alt={lead.alt}
          fill
          priority
          sizes="(max-width: 1080px) 100vw, 38vw"
          data-public-media="approved"
          data-review-status={lead.reviewStatus}
          data-license-status={lead.licenseStatus}
          data-source-domain={lead.sourceDomain}
          data-license-url={lead.licenseUrl}
        />
        <figcaption>
          <span>Terrain</span>
          <strong>Operations qualifiees avant engagement</strong>
        </figcaption>
      </figure>
      <div className="editorial-media__stack">
        {supportAssets.map((asset, index) => (
          <figure key={asset.id}>
            <Image
              src={asset.url!}
              alt={asset.alt}
              fill
              sizes="(max-width: 720px) 100vw, 154px"
              data-public-media="approved"
              data-review-status={asset.reviewStatus}
              data-license-status={asset.licenseStatus}
              data-source-domain={asset.sourceDomain}
              data-license-url={asset.licenseUrl}
            />
            <figcaption>
              <span>{index === 0 ? "Expertise" : "Decision"}</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </figcaption>
          </figure>
        ))}
      </div>
    </aside>
  );
}
