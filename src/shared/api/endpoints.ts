export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  users: {
    me: "/users/me",
    update: "/users/me/update",
    byId: (id: string) => `/users/${id}`,
    listings: (id: string) => `/users/${id}/listings`,
  },
  listings: {
    list: "/listings/",
    byId: (id: string) => `/listings/${id}`,
    create: "/listings/create",
    update: (id: string) => `/listings/${id}/edit`,
    delete: (id: string) => `/listings/${id}/delete`,
    view: (id: string) => `/listings/${id}/view`,
    my: "/listings/my",
  },
  categories: {
    list: "/categories/",
  },
  favorites: {
    list: "/favorites/",
    add: (id: string) => `/favorites/${id}`,
    remove: (id: string) => `/favorites/${id}/remove`,
    count: "/favorites/count",
  },
  search: {
    query: "/search",
  },
  payments: {
    create: "/payments",
    byId: (id: string) => `/payments/${id}`,
    history: "/payments/history",
  },
  plans: {
    list: "/plans",
  },
  admin: {
    listings: "/admin/listings",
    approve: (id: string) => `/admin/listings/${id}/approve`,
    reject: (id: string) => `/admin/listings/${id}/reject`,
    users: "/admin/users",
  },
} as const;
