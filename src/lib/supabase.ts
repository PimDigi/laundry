import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const isBrowser = typeof window !== "undefined";

const readLocal = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore localStorage write failures
  }
};

const safeFetch = async <T>(
  table: string,
  selectQuery: (client: typeof supabase) => Promise<{ data: any; error: any }>,
  localKey: string,
  transform?: (item: any) => T
): Promise<T[]> => {
  if (!HAS_SUPABASE) {
    return readLocal(localKey, [] as T[]);
  }

  try {
    const { data, error } = await selectQuery(supabase);
    if (error) throw error;
    const result = (data ?? []) as any[];
    const normalized = transform ? result.map(transform) : (result as T[]);
    writeLocal(localKey, normalized);
    return normalized;
  } catch {
    return readLocal(localKey, [] as T[]);
  }
};

const safeInsert = async <T>(
  table: string,
  dbRow: unknown,
  localRow: T,
  localKey: string,
  transform?: (item: any) => T
): Promise<T> => {
  if (!HAS_SUPABASE) {
    const current = readLocal(localKey, [] as T[]);
    const next = [localRow, ...current];
    writeLocal(localKey, next);
    return localRow;
  }

  try {
    const { data, error } = await supabase.from(table).insert([dbRow]);
    if (error) throw error;
    const inserted = (data as any[] | null)?.[0] ?? localRow;
    const normalized = transform ? transform(inserted) : (inserted as T);
    const current = readLocal(localKey, [] as T[]);
    const next = [normalized, ...current];
    writeLocal(localKey, next);
    return normalized;
  } catch {
    const current = readLocal(localKey, [] as T[]);
    const next = [localRow, ...current];
    writeLocal(localKey, next);
    return localRow;
  }
};

const safeUpdate = async <T>(
  table: string,
  id: string,
  changes: Partial<T>,
  localKey: string,
  mapItem: (item: any) => T
): Promise<T | null> => {
  if (!HAS_SUPABASE) {
    const current = readLocal(localKey, [] as T[]);
    const updated = current.map(item => (item && (item as any).id === id ? { ...item, ...changes } : item));
    writeLocal(localKey, updated);
    return updated.find(item => (item as any).id === id) ?? null;
  }

  try {
    const { data, error } = await supabase.from(table).update(changes as any).eq("id", id).select().maybeSingle();
    if (error) throw error;
    const updated = data ? mapItem(data) : null;
    if (updated) {
      const current = readLocal(localKey, [] as T[]);
      const next = current.map(item => ((item as any).id === id ? updated : item));
      writeLocal(localKey, next);
    }
    return updated;
  } catch {
    const current = readLocal(localKey, [] as T[]);
    const updated = current.map(item => ((item as any).id === id ? { ...item, ...changes } : item));
    writeLocal(localKey, updated);
    return updated.find(item => (item as any).id === id) ?? null;
  }
};

const mapOrder = (row: any) => {
  if (row.payload) {
    return row.payload;
  }
  return {
    ...row,
    id: row.id,
    date: row.date,
    customerName: row.customer_name,
    status: row.status,
    paymentMethod: row.payment_method,
    subtotal: row.subtotal,
    discount: row.discount,
    total: row.total,
    service: row.service_type,
    unit: row.unit,
    qty: row.weight_qty,
  };
};

const mapMember = (row: any) => {
  if (row.payload) {
    return row.payload;
  }
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    packageName: row.package_name || row.packageName || "Membership",
    totalQuota: Number(row.quota_kg ?? row.totalQuota ?? 0),
    remainingQuota: Number(row.remaining_quota ?? row.remainingQuota ?? row.quota_kg ?? 0),
    joinDate: row.join_date || row.joinDate || new Date().toISOString(),
    expiredDate: row.expired_date || row.expiredDate || new Date().toISOString(),
  };
};

const mapExpense = (row: any) => {
  if (row.payload) {
    return row.payload;
  }
  return {
    ...row,
    id: row.id,
    date: row.date,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
  };
};

const mapUser = (row: any) => ({
  ...row,
  id: row.id,
  name: row.name,
  email_username: row.email_username || row.emailUsername || row.email,
  email: row.email || row.email_username || row.emailUsername,
  password: row.password,
  role: row.role,
});

export const fetchOrders = async () =>
  safeFetch<any>(
    "orders",
    async client => client.from("orders").select("*").order("created_at", { ascending: false }),
    "lavora_orders",
    mapOrder
  );

export const addOrder = async (order: any) => {
  const parsedDate = order.date ? new Date(order.date) : new Date();
  const validDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const weightQtyRaw = order.qty ?? order.weightQty ?? "";
  const weightQtyNumber = typeof weightQtyRaw === "number" ? weightQtyRaw : parseFloat(String(weightQtyRaw).replace(/[^0-9.,-]/g, ""));
  const dbRow = {
    id: order.id,
    date: validDate.toISOString(),
    customer_name: order.name || order.customerName || "",
    status: order.status || order.operationalStatus || "Baru",
    payment_method: order.paymentMethod || "Tunai",
    subtotal: order.subtotal ?? order.price ?? 0,
    discount: order.discount ?? 0,
    total: order.price ?? order.totalPrice ?? 0,
    service_type: order.service || order.serviceType || "",
    unit: order.unit || "",
    weight_qty: Number.isNaN(weightQtyNumber) ? 0 : weightQtyNumber,
  };

  if (!HAS_SUPABASE) {
    const current = readLocal("lavora_orders", [] as any[]);
    const next = [order, ...current];
    writeLocal("lavora_orders", next);
    return order;
  }

  try {
    const { data, error } = await supabase.from("orders").insert([dbRow]);
    if (error) {
      alert("Gagal simpan Supabase: " + error.message);
      const current = readLocal("lavora_orders", [] as any[]);
      const next = [order, ...current];
      writeLocal("lavora_orders", next);
      return order;
    }

    const inserted = (data as any[] | null)?.[0] ?? dbRow;
    const normalized = mapOrder(inserted);
    const current = readLocal("lavora_orders", [] as any[]);
    const next = [normalized, ...current];
    writeLocal("lavora_orders", next);
    return normalized;
  } catch (err: any) {
    alert("Gagal simpan Supabase: " + (err?.message || err));
    const current = readLocal("lavora_orders", [] as any[]);
    const next = [order, ...current];
    writeLocal("lavora_orders", next);
    return order;
  }
};

export const fetchMembers = async () =>
  safeFetch<any>(
    "members",
    async client => client.from("members").select("*").order("join_date", { ascending: false }),
    "lavora_memberships",
    mapMember
  );

export const addMember = async (member: any) => {
  const dbMember = {
    id: member.id,
    name: member.name,
    phone: member.phone,
    package_name: member.packageName,
    quota_kg: member.totalQuota,
    remaining_quota: member.remainingQuota,
    join_date: member.joinDate,
    expired_date: member.expiredDate,
    payload: member,
  };
  return safeInsert("members", dbMember, member, "lavora_memberships", mapMember);
};

export const updateMember = async (memberId: string, changes: any) => {
  const dbChanges = {
    ...(changes.packageName ? { package_name: changes.packageName } : {}),
    ...(changes.totalQuota !== undefined ? { quota_kg: changes.totalQuota } : {}),
    ...(changes.remainingQuota !== undefined ? { remaining_quota: changes.remainingQuota } : {}),
    ...(changes.joinDate ? { join_date: changes.joinDate } : {}),
    ...(changes.expiredDate ? { expired_date: changes.expiredDate } : {}),
    ...(changes.name ? { name: changes.name } : {}),
    ...(changes.phone ? { phone: changes.phone } : {}),
    payload: changes,
  };
  return safeUpdate("members", memberId, dbChanges, "lavora_memberships", mapMember);
};

export const fetchExpenses = async () =>
  safeFetch<any>(
    "expenses",
    async client => client.from("expenses").select("*").order("date", { ascending: false }),
    "lavora_expenses",
    mapExpense
  );

export const addExpense = async (expense: any) => {
  const dbExpense = {
    id: expense.id,
    date: expense.date || new Date().toISOString().split("T")[0],
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
    payload: expense,
  };
  return safeInsert("expenses", dbExpense, expense, "lavora_expenses", mapExpense);
};

export const fetchEmployees = async () =>
  safeFetch<any>(
    "users",
    async client => client.from("users").select("*").order("name", { ascending: true }),
    "lavora_employees",
    mapUser
  );

export const createEmployee = async (employee: any) => {
  const dbEmployee = {
    id: employee.id,
    name: employee.name,
    email_username: employee.email_username || employee.email.toLowerCase(),
    password: employee.password,
    role: employee.role || "employee",
    payload: employee,
  };
  return safeInsert("users", dbEmployee, employee, "lavora_employees", mapUser);
};

export const deleteEmployee = async (id: string) => {
  if (!HAS_SUPABASE) {
    const current = readLocal("lavora_employees", [] as any[]);
    const next = current.filter(emp => emp.id !== id);
    writeLocal("lavora_employees", next);
    return true;
  }

  try {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    const current = readLocal("lavora_employees", [] as any[]);
    const next = current.filter(emp => emp.id !== id);
    writeLocal("lavora_employees", next);
    return true;
  } catch {
    const current = readLocal("lavora_employees", [] as any[]);
    const next = current.filter(emp => emp.id !== id);
    writeLocal("lavora_employees", next);
    return true;
  }
};

export const loginEmployee = async (email_username: string, password: string) => {
  const normalizedEmail = email_username.toLowerCase();
  const fallbackEmployees = readLocal("lavora_employees", [] as any[]);

  if (!HAS_SUPABASE) {
    const employee = fallbackEmployees.find(
      emp => emp.email_username?.toLowerCase?.() === normalizedEmail || emp.email?.toLowerCase?.() === normalizedEmail
    );
    return employee && employee.password === password ? { ...employee, role: employee.role || "employee" } : null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`email_username.eq.${normalizedEmail},email.eq.${normalizedEmail}`)
      .eq("password", password)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      const normalized = mapUser(data);
      writeLocal("lavora_employees", [normalized, ...fallbackEmployees]);
      return { ...normalized, role: normalized.role || "employee" };
    }

    const fallback = fallbackEmployees.find(
      emp => emp.email_username?.toLowerCase?.() === normalizedEmail || emp.email?.toLowerCase?.() === normalizedEmail
    );
    return fallback ? { ...fallback, role: fallback.role || "employee" } : null;
  } catch {
    const fallback = fallbackEmployees.find(
      emp => emp.email_username?.toLowerCase?.() === normalizedEmail || emp.email?.toLowerCase?.() === normalizedEmail
    );
    return fallback ? { ...fallback, role: fallback.role || "employee" } : null;
  }
};
