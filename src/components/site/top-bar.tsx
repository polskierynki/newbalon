import { MapPin, Phone } from "lucide-react";
import { SocialIcon, type SiteSocialLink } from "@/components/site/social-icon";

type TopBarProps = {
  phone?: string;
  address?: string;
  socialLinks?: SiteSocialLink[];
};

export function TopBar({
  phone = "+48 123 456 789",
  address = "Dzialamy na terenie calej Polski",
  socialLinks = [],
}: TopBarProps) {
  return (
    <div className="bg-primary px-4 py-2 text-[11px] text-white md:text-xs">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center">
          <MapPin className="mr-1.5 h-3 w-3" />
          <span>{address}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="mr-4 hidden items-center space-x-3 border-r border-white/30 pr-4 md:flex">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="transition-colors hover:text-white/80"
              >
                <SocialIcon icon={item.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center transition-colors hover:text-white/80"
          >
            <Phone className="mr-1.5 h-3 w-3" />
            <span>Zadzwon: {phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
