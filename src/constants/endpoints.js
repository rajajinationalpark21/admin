const rawBase =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_BASE_URL_API ||
  import.meta.env.VITE_API_URL ||
  "https://backend-hbkg.onrender.com/api";
export const API_BASE = rawBase.replace(/\/+$/, "") + "/";

export const FEEDBACK_ADMIN_ALL = "feedback/admin/all";
export const FEEDBACK_GET_ALL = "feedback/get";
export const FEEDBACK_UPDATE = "feedback/update";
export const FEEDBACK_DELETE = "feedback/delete";

export const ADMIN_USERS_GET = "admin/users";
export const ADMIN_USER_CREATE = "admin/create-user";
export const ADMIN_USER_DELETE = "admin/delete-user";

export const BOOKINGS_GET = "booking/get";
export const BOOKINGS_UPDATE = "booking/update";
export const BOOKINGS_DELETE = "booking/delete";

