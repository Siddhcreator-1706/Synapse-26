/**
 * Admin API Client
 * Central utility for making authenticated API calls to admin endpoints
 */

export type ApiResponse<T> = {
    data?: T;
    error?: string;
    message?: string;
};

/**
 * Base fetch wrapper with authentication
 */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.error || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        return { data };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Network error occurred",
        };
    }
}

// ============================================================================
// Events API
// ============================================================================

export type EventFee = {
    type: string;
    price: number;
    min?: number;
    max?: number;
};

export type Event = {
    event_id: number;
    event_name: string;
    category_id: number;
    event_date: string;
    event_picture?: string;
    rulebook?: string;
    description?: string;
    is_registration_open: boolean;
    is_dau_free: boolean;
    event_category?: { category_name: string };
    event_fee?: Array<{
        fee: {
            fee_id: number;
            participation_type: string;
            price: number;
            min_members: number;
            max_members: number;
        };
    }>;
};

export type CreateEventPayload = {
    event_name: string;
    category_id: number;
    event_date: string;
    event_picture?: string;
    rulebook?: string;
    description?: string;
    is_registration_open?: boolean;
    is_dau_free?: boolean;
    fees?: EventFee[];
};

export const eventsApi = {
    getAll: () => apiFetch<{ events: Event[] }>("/api/admin/events"),

    create: (payload: CreateEventPayload) =>
        apiFetch<{ event: Event }>("/api/admin/events", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (eventId: number, payload: Partial<CreateEventPayload> & { event_id: number }) =>
        apiFetch<{ event: Event }>("/api/admin/events", {
            method: "PUT",
            body: JSON.stringify({ ...payload, event_id: eventId }),
        }),

    delete: (eventId: number) =>
        apiFetch<{ success: boolean }>(`/api/admin/events?id=${eventId}`, {
            method: "DELETE",
        }),
};

// ============================================================================
// Categories API
// ============================================================================

export type Category = {
    category_id: number;
    category_name: string;
    category_description?: string;
    category_image?: string;
};

export const categoriesApi = {
    getAll: () => apiFetch<{ categories: Category[] }>("/api/admin/categories"),

    create: (payload: Omit<Category, "category_id">) =>
        apiFetch<Category>("/api/admin/categories", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (categoryId: number, payload: Partial<Category>) =>
        apiFetch<Category>("/api/admin/categories", {
            method: "PUT",
            body: JSON.stringify({ ...payload, category_id: categoryId }),
        }),

    delete: (categoryId: number) =>
        apiFetch<{ success: boolean }>(`/api/admin/categories?id=${categoryId}`, {
            method: "DELETE",
        }),
};

// ============================================================================
// Registrations API
// ============================================================================

export type Registration = {
    registration_id: string;
    transaction_id: string;
    user_name: string;
    college: string;
    event_name: string;
    category: string;
    participation_type: string;
    payment_method: string;
    group_size: number;
    payment_status: string;
    gross_amount: number;
    gateway_charge: number;
    net_amount: number;
};

export type RegistrationsResponse = {
    page: number;
    limit: number;
    total: number;
    summary: {
        total_registrations: number;
        paid: number;
        gross_revenue: number;
        gateway_charges: number;
        net_revenue: number;
    };
    data: Registration[];
};

export type RegistrationFilters = {
    page?: number;
    limit?: number;
    searchParams?: string;
    filter?: string;
    paymentMethod?: string;
    paymentStatus?: string;
};

export const registrationsApi = {
    getAll: (filters: RegistrationFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });
        return apiFetch<RegistrationsResponse>(
            `/api/admin/registrations?${params.toString()}`
        );
    },

    getById: (id: string) =>
        apiFetch<Registration>(`/api/admin/registrations/${id}`),

    getEventList: () =>
        apiFetch<{ events: string[] }>("/api/admin/registrations/eventlist"),

    exportData: (filters: RegistrationFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });
        return apiFetch<{ csv: string }>(
            `/api/admin/registrations/export?${params.toString()}`
        );
    },

    getGatewaySettings: () =>
        apiFetch<{ gateways: unknown[] }>("/api/admin/registrations/gateway"),

    updateGatewaySettings: (payload: unknown) =>
        apiFetch("/api/admin/registrations/gateway", {
            method: "PUT",
            body: JSON.stringify(payload),
        }),
};

// ============================================================================
// Users API
// ============================================================================

export type User = {
    user_id: string;
    user_name: string;
    email: string;
    phone: string;
    college: string;
    registration_date: string;
    event_count: number;
};

export type UsersResponse = {
    total: number;
    page: number;
    limit: number;
    users: User[];
};

export type UserFilters = {
    page?: number;
    limit?: number;
    searchParams?: string;
    filter?: string;
};

export const usersApi = {
    getAll: (filters: UserFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });
        return apiFetch<UsersResponse>(`/api/admin/users?${params.toString()}`);
    },

    getById: (id: string) => apiFetch<User>(`/api/admin/users/${id}`),

    getEventList: () => apiFetch<{ events: string[] }>("/api/admin/users/eventlist"),

    exportData: (filters: UserFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, value.toString());
            }
        });
        return apiFetch<{ csv: string }>(`/api/admin/users/export?${params.toString()}`);
    },
};

// ============================================================================
// Sponsors API
// ============================================================================

export type Sponsor = {
    sponsor_id: number;
    name: string;
    tier: string;
    website_url?: string;
    logo_url?: string;
    description?: string;
};

export const sponsorsApi = {
    getAll: () => apiFetch<{ sponsors: Sponsor[]; count: number }>("/api/admin/sponsors"),

    getById: (id: number) => apiFetch<Sponsor>(`/api/admin/sponsors/${id}`),

    create: (payload: Omit<Sponsor, "sponsor_id">) =>
        apiFetch<{ sponsor: Sponsor }>("/api/admin/sponsors", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (id: number, payload: Partial<Sponsor>) =>
        apiFetch<{ sponsor: Sponsor }>(`/api/admin/sponsors/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        apiFetch<{ success: boolean }>(`/api/admin/sponsors/${id}`, {
            method: "DELETE",
        }),
};

// ============================================================================
// Artists API
// ============================================================================

export type Artist = {
    id: number;
    name: string;
    concert_id: number;
    genre?: string;
    reveal_date: string;
    bio?: string;
    artist_image_url?: string;
    concert?: {
        concert_name: string;
    };
};

export const artistsApi = {
    getAll: () => apiFetch<Artist[]>("/api/admin/artists"),

    create: (payload: Omit<Artist, "id" | "concert">) =>
        apiFetch<{ data: Artist }>("/api/admin/artists", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        apiFetch<{ success: boolean }>("/api/admin/artists", {
            method: "DELETE",
            body: JSON.stringify({ id }),
        }),
};

// ============================================================================
// Concerts API
// ============================================================================

export type Concert = {
    concert_id: number;
    concert_name: string;
    concert_date: string;
    venue?: string;
    description?: string;
    ticket_price?: number;
};

export const concertsApi = {
    getAll: () => apiFetch<Concert[]>("/api/admin/concerts"),

    create: (payload: Omit<Concert, "concert_id">) =>
        apiFetch<Concert>("/api/admin/concerts", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (id: number, payload: Partial<Concert>) =>
        apiFetch<Concert>("/api/admin/concerts", {
            method: "PUT",
            body: JSON.stringify({ ...payload, concert_id: id }),
        }),

    delete: (id: number) =>
        apiFetch<{ success: boolean }>(`/api/admin/concerts?id=${id}`, {
            method: "DELETE",
        }),
};

// ============================================================================
// Merchandise API
// ============================================================================

export type MerchandiseProduct = {
    product_id: number;
    product_name: string;
    price: number;
    available_sizes?: string[];
    product_image?: string;
    description?: string;
    is_available: boolean;
};

export type MerchandiseOrder = {
    order_id: number;
    customer_id: string;
    items: unknown;
    amount: number;
    order_date: string;
    payment_status: string;
    payment_method: string;
};

export const merchandiseApi = {
    products: {
        getAll: () =>
            apiFetch<{ products: MerchandiseProduct[]; count: number }>(
                "/api/admin/merchandise/management"
            ),

        getById: (id: number) =>
            apiFetch<MerchandiseProduct>(`/api/admin/merchandise/management/${id}`),

        create: (payload: Omit<MerchandiseProduct, "product_id">) =>
            apiFetch<{ product: MerchandiseProduct }>("/api/admin/merchandise/management", {
                method: "POST",
                body: JSON.stringify(payload),
            }),

        update: (id: number, payload: Partial<MerchandiseProduct>) =>
            apiFetch<{ product: MerchandiseProduct }>(
                `/api/admin/merchandise/management/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            ),

        delete: (id: number) =>
            apiFetch<{ success: boolean }>(`/api/admin/merchandise/management/${id}`, {
                method: "DELETE",
            }),
    },

    orders: {
        getAll: () =>
            apiFetch<{ orders: MerchandiseOrder[]; count: number }>(
                "/api/admin/merchandise/orders"
            ),

        getById: (id: number) =>
            apiFetch<MerchandiseOrder>(`/api/admin/merchandise/orders/${id}`),

        create: (payload: Omit<MerchandiseOrder, "order_id">) =>
            apiFetch<{ order: MerchandiseOrder }>("/api/admin/merchandise/orders", {
                method: "POST",
                body: JSON.stringify(payload),
            }),

        update: (id: number, payload: Partial<MerchandiseOrder>) =>
            apiFetch<{ order: MerchandiseOrder }>(`/api/admin/merchandise/orders/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            }),
    },
};

// ============================================================================
// Accommodation API
// ============================================================================

export type Accommodation = {
    accommodation_id: number;
    name: string;
    location?: string;
    price_per_night?: number;
    capacity?: number;
    description?: string;
};

export const accommodationApi = {
    getAll: () => apiFetch<Accommodation[]>("/api/admin/accommodation"),

    getById: (id: number) => apiFetch<Accommodation>(`/api/admin/accommodation/${id}`),

    create: (payload: Omit<Accommodation, "accommodation_id">) =>
        apiFetch<Accommodation>("/api/admin/accommodation", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    update: (id: number, payload: Partial<Accommodation>) =>
        apiFetch<Accommodation>(`/api/admin/accommodation/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        apiFetch<{ success: boolean }>(`/api/admin/accommodation/${id}`, {
            method: "DELETE",
        }),
};
