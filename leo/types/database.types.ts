export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Categories: {
        Row: {
          description: string | null
          id: number
        }
        Insert: {
          description?: string | null
          id?: number
        }
        Update: {
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      Event_Occurrences: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          event_id: number
          id: number
          latitude: number | null
          longitude: number | null
          start_time: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          event_id: number
          id?: number
          latitude?: number | null
          longitude?: number | null
          start_time: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          event_id?: number
          id?: number
          latitude?: number | null
          longitude?: number | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "Event_Occurences_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      Event_Vendors: {
        Row: {
          booth_number: number
          event_occurence_id: number
          vendor_id: number
        }
        Insert: {
          booth_number: number
          event_occurence_id?: number
          vendor_id: number
        }
        Update: {
          booth_number?: number
          event_occurence_id?: number
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Event_Vendors_event_occurence_id_fkey"
            columns: ["event_occurence_id"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Event_Vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "Vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      Events: {
        Row: {
          admin_id: number
          description: string | null
          id: number
          is_recurring: boolean | null
          name: string | null
          photo_url: string | null
          recurrence_pattern: string | null
        }
        Insert: {
          admin_id: number
          description?: string | null
          id?: number
          is_recurring?: boolean | null
          name?: string | null
          photo_url?: string | null
          recurrence_pattern?: string | null
        }
        Update: {
          admin_id?: number
          description?: string | null
          id?: number
          is_recurring?: boolean | null
          name?: string | null
          photo_url?: string | null
          recurrence_pattern?: string | null
        }
        Relationships: []
      }
      Vendor_Categories: {
        Row: {
          category_id: number
          vendor_id: number
        }
        Insert: {
          category_id: number
          vendor_id: number
        }
        Update: {
          category_id?: number
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Vendor_Categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "Vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      Vendors: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: number
          name: string
          phone_number: number | null
          photo_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          name: string
          phone_number?: number | null
          photo_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          name?: string
          phone_number?: number | null
          photo_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
