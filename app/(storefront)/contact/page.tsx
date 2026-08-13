import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container-x py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-parrot-600">Get in Touch</p>
        <h1 className="section-title mt-2">Contact Us</h1>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
        <InfoCard icon={<MapPin size={20} />} title="Visit Us">
          Main Fountain, C Block Citi Housing Society, Sialkot, 51040, Pakistan
        </InfoCard>
        <InfoCard icon={<Phone size={20} />} title="Call Us">
          0330 3111222
        </InfoCard>
        <InfoCard icon={<Clock size={20} />} title="Hours">
          9 AM – 8 PM, Monday – Sunday
        </InfoCard>
      </div>

      <div className="mt-12 flex justify-center">
        <a href="https://wa.me/923303111222" target="_blank" rel="noopener noreferrer" className="btn-primary">
          <MessageCircle size={16} /> Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-parrot-100 bg-white p-6 text-center shadow-soft">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-parrot-50 text-parrot-600">
        {icon}
      </div>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{children}</p>
    </div>
  );
}