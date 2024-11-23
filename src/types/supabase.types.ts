export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string | null;
          created_at: string;
          education: string | null;
          experience: string | null;
          id: number;
          job: number | null;
          name: string | null;
          resume: string | null;
          skills: string | null;
          status: Database["public"]["Enums"]["status"] | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string;
          education?: string | null;
          experience?: string | null;
          id?: number;
          job?: number | null;
          name?: string | null;
          resume?: string | null;
          skills?: string | null;
          status?: Database["public"]["Enums"]["status"] | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string;
          education?: string | null;
          experience?: string | null;
          id?: number;
          job?: number | null;
          name?: string | null;
          resume?: string | null;
          skills?: string | null;
          status?: Database["public"]["Enums"]["status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_job_fkey";
            columns: ["job"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          created_at: string;
          id: number;
          logo_url: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          logo_url?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          logo_url?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          company: number | null;
          created_at: string;
          description: string | null;
          id: number;
          isOpen: boolean | null;
          location: string | null;
          recuirter_id: string | null;
          requirements: string | null;
          title: string | null;
        };
        Insert: {
          company?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          isOpen?: boolean | null;
          location?: string | null;
          recuirter_id?: string | null;
          requirements?: string | null;
          title?: string | null;
        };
        Update: {
          company?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          isOpen?: boolean | null;
          location?: string | null;
          recuirter_id?: string | null;
          requirements?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_company_fkey";
            columns: ["company"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_jobs: {
        Row: {
          created_at: string;
          id: number;
          job_id: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          job_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          job_id?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      status: "applied" | "interviewing" | "hired" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export type Jobs = Tables<"jobs">;
export type Application = Tables<"applications">;
export type Companies = Tables<"companies">;
export type SavedJobs = Tables<"saved_jobs">;
export type StatusEnum = Enums<"status">;
