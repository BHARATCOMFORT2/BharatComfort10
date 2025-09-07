"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function UsersDashboardPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale as string);

    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchUsers();
  }, [locale, i18n]);

  const handleRoleChange = async (id: string, newRole: string) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">{t("user_management")}</h1>
      <p className="text-gray-600">{t("manage_users_intro")}</p>

      {loading && <p className="text-gray-500">{t("loading")}...</p>}
      {!loading && users.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">{t("name")}</th>
                <th className="px-4 py-2">{t("email")}</th>
                <th className="px-4 py-2">{t("role")}</th>
                <th className="px-4 py-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.name || "-"}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role || "user"}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role || "user"}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    >
                      <option value="user">{t("user")}</option>
                      <option value="partner">{t("partner")}</option>
                      <option value="admin">{t("admin")}</option>
                      <option value="superadmin">{t("superadmin")}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-gray-500">{t("no_users")}</p>
      )}
    </div>
  );
}
