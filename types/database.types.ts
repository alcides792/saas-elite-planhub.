export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            families: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    owner_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    owner_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    owner_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "families_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            family_members: {
                Row: {
                    created_at: string
                    email: string
                    family_id: string
                    id: string
                    role: string
                    status: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    email: string
                    family_id: string
                    id?: string
                    role?: string
                    status?: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    email?: string
                    family_id?: string
                    id?: string
                    role?: string
                    status?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "family_members_family_id_fkey"
                        columns: ["family_id"]
                        isOneToOne: false
                        referencedRelation: "families"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "family_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            feedback_posts: {
                Row: {
                    category: string
                    content: string
                    created_at: string
                    id: string
                    title: string
                    user_id: string
                    votes: number
                }
                Insert: {
                    category: string
                    content: string
                    created_at?: string
                    id?: string
                    title: string
                    user_id: string
                    votes?: number
                }
                Update: {
                    category?: string
                    content?: string
                    created_at?: string
                    id?: string
                    title?: string
                    user_id?: string
                    votes?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "feedback_posts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            feedback_votes: {
                Row: {
                    created_at: string
                    id: string
                    post_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "feedback_votes_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "feedback_posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "feedback_votes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    currency: string
                    extension_api_key: string | null
                    full_name: string | null
                    id: string
                    language: string
                    notify_emails: boolean
                    notify_summary: boolean
                    notify_days_before: number
                    updated_at: string | null
                    extension_token: string | null
                    billing_status: string
                    dodo_subscription_id: string | null
                    trial_ends_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    currency?: string
                    extension_api_key?: string | null
                    full_name?: string | null
                    id: string
                    language?: string
                    notify_emails?: boolean
                    notify_summary?: boolean
                    notify_days_before?: number
                    updated_at?: string | null
                    extension_token?: string | null
                    billing_status?: string
                    dodo_subscription_id?: string | null
                    trial_ends_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    currency?: string
                    extension_api_key?: string | null
                    full_name?: string | null
                    id?: string
                    language?: string
                    notify_emails?: boolean
                    notify_summary?: boolean
                    notify_days_before?: number
                    updated_at?: string | null
                    extension_token?: string | null
                    billing_status?: string
                    dodo_subscription_id?: string | null
                    trial_ends_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            subscriptions: {
                Row: {
                    amount: number
                    billing_type: string
                    category: string | null
                    created_at: string
                    currency: string
                    id: string
                    name: string
                    notes: string | null
                    payment_method: string | null
                    renewal_date: string | null
                    status: string
                    updated_at: string
                    user_id: string
                    website: string | null
                    icon: string | null
                    icon_color: string | null
                }
                Insert: {
                    amount?: number
                    billing_type?: string
                    category?: string | null
                    created_at?: string
                    currency?: string
                    id?: string
                    name: string
                    notes?: string | null
                    payment_method?: string | null
                    renewal_date?: string | null
                    status?: string
                    updated_at?: string
                    user_id: string
                    website?: string | null
                    icon?: string | null
                    icon_color?: string | null
                }
                Update: {
                    amount?: number
                    billing_type?: string
                    category?: string | null
                    created_at?: string
                    currency?: string
                    id?: string
                    name?: string
                    notes?: string | null
                    payment_method?: string | null
                    renewal_date?: string | null
                    status?: string
                    updated_at?: string
                    user_id?: string
                    website?: string | null
                    icon?: string | null
                    icon_color?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_extension_api_key: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never