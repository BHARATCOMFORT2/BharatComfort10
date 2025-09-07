"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Users, Building2, FileText, Shield } from "lucide-react";

export default function AdminDashboardPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();

  i18n.changeLanguage(locale as string);

  const sections = [
    {
      href: `/${locale}/dashboard/users`,
      label: t("manage_users"),
      desc: t("manage_users_desc"),
      icon: Users,
    },
    {
      href: `/${locale}/dashboard/listings`,
      label: t("manage_listings"),
      desc: t("manage_listings_desc"),
      icon: Building2,
    },
    {
      href: `/${locale}/dashboard/stories`,
      label: t("manage_stories"),
      desc: t("manage_stories_desc"),
      icon: FileText,
    },
    {
      href: `/${locale}/dashboard/settings`,
      label: t("admin_settings"),
      desc: t("admin_settings_desc"),
      icon: Shield,
    },
  ];

  return (
    <div className="px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">{t("admin_dashboard")}</h1>
      <p className="text-gray-600">{t("admin_dashboard_intro")}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon size={22} className="text-blue-600" />
                <span className="text-lg font-semibold">{section.label}</span>
              </div>
              <p className="text-sm text-gray-600">{section.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
