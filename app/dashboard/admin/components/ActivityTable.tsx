// app/dashboard/admin/components/ActivityTable.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "Jean Dupont",
      email: "jean.d@mail.com",
      avatar: "/placeholder.svg",
      role: "Vendeur"
    },
    action: "Nouveau produit",
    details: "iPhone 15 Pro",
    category: "Produits électroniques",
    time: "Il y a 5 min",
    price: "1299,00 €",
  },
  {
    user: {
      name: "Marie Martin",
      email: "marie.m@mail.com",
      avatar: "/placeholder.svg",
      role: "Vendeur"
    },
    action: "Promotion ajoutée",
    details: "Soldes d'été",
    category: "Mode et Accessoires",
    time: "Il y a 10 min",
    price: "-30%",
  },
  {
    user: {
      name: "Pierre Durand",
      email: "pierre.d@mail.com",
      avatar: "/placeholder.svg",
      role: "Admin"
    },
    action: "Catégorie créée",
    details: "Maison connectée",
    category: "Maison et Décoration",
    time: "Il y a 15 min",
    price: "",
  },
]

export function ActivityTable() {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-blue-200">
            <th className="text-blue-600 font-medium py-3 px-4">Utilisateur</th>
            <th className="text-blue-600 font-medium py-3 px-4">Action</th>
            <th className="text-blue-600 font-medium py-3 px-4">Catégorie</th>
            <th className="text-blue-600 font-medium py-3 px-4">Temps</th>
            <th className="text-blue-600 font-medium py-3 px-4 text-right">Détails</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-200">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-blue-800">
                      {activity.user.name}
                    </div>
                    <div className="text-blue-500">{activity.user.role}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  activity.action === "Nouveau produit"
                    ? "bg-green-100 text-green-800"
                    : activity.action === "Promotion ajoutée"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {activity.action}
                </span>
              </td>
              <td className="py-3 px-4 text-blue-600">{activity.category}</td>
              <td className="py-3 px-4 text-blue-600">{activity.time}</td>
              <td className="py-3 px-4 text-right text-blue-800 font-medium">
                {activity.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}