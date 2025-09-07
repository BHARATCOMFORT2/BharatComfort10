"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Building2, FileText, BarChart3 } from "lucide-react";

export default function PartnerDashboardPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();

  i18n.changeLanguage(locale as string);

  const tools = [
    {
      href: `/${locale}/dashboard/partner/listings`,
      label: t("my_listings"),
      desc: t("my_listings_desc"),
      icon: Building2,
    },
    {
      href: `/${locale}/dashboard/partner/stories`,
      label: t("my_stories"),
      desc: t("my_stories_desc"),
      icon: FileText,
    },
    {
      href: `/${locale}/dashboard/partner/analytics`,
      label: t("analytics"),
      desc: t("analytics_desc"),
      icon: BarChart3,
    },
  ];

  return (
    <div className="px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">{t("partner_dashboard")}</h1>
      <p className="text-gray-600">{t("partner_dashboard_intro")}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon size={22} className="text-blue-600" />
                <span className="text-lg font-semibold">{tool.label}</span>
              </div>
              <p className="text-sm text-gray-600">{tool.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
