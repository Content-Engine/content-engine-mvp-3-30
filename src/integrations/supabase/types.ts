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
      boost_history: {
        Row: {
          amount: number
          boost_date: string
          boost_tier: string | null
          campaign_id: string | null
          content_id: string
          created_at: string
          id: string
          reach: number | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          boost_date?: string
          boost_tier?: string | null
          campaign_id?: string | null
          content_id: string
          created_at?: string
          id?: string
          reach?: number | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          boost_date?: string
          boost_tier?: string | null
          campaign_id?: string | null
          content_id?: string
          created_at?: string
          id?: string
          reach?: number | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boost_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      boosts: {
        Row: {
          boost_type: string
          campaign_id: string | null
          configuration: Json | null
          cost: number | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
        }
        Insert: {
          boost_type: string
          campaign_id?: string | null
          configuration?: Json | null
          cost?: number | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
        }
        Update: {
          boost_type?: string
          campaign_id?: string | null
          configuration?: Json | null
          cost?: number | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "boosts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          assigned_editor_id: string | null
          auto_fill_lookalike: boolean | null
          boost_settings: Json | null
          budget_allocated: number | null
          budget_spent: number | null
          clips_count: number | null
          created_at: string
          created_by: string | null
          cta_type: string | null
          description: string | null
          echo_boost_enabled: boolean | null
          echo_boost_platforms: number | null
          end_date: string | null
          goal: string | null
          hashtags_caption: string | null
          id: string
          name: string
          notes: string | null
          platform_targets: Json | null
          platforms: Json | null
          posting_end_date: string | null
          posting_start_date: string | null
          requires_approval: boolean | null
          start_date: string | null
          status: string | null
          syndication_tier: string | null
          total_boost_spend: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_editor_id?: string | null
          auto_fill_lookalike?: boolean | null
          boost_settings?: Json | null
          budget_allocated?: number | null
          budget_spent?: number | null
          clips_count?: number | null
          created_at?: string
          created_by?: string | null
          cta_type?: string | null
          description?: string | null
          echo_boost_enabled?: boolean | null
          echo_boost_platforms?: number | null
          end_date?: string | null
          goal?: string | null
          hashtags_caption?: string | null
          id?: string
          name: string
          notes?: string | null
          platform_targets?: Json | null
          platforms?: Json | null
          posting_end_date?: string | null
          posting_start_date?: string | null
          requires_approval?: boolean | null
          start_date?: string | null
          status?: string | null
          syndication_tier?: string | null
          total_boost_spend?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_editor_id?: string | null
          auto_fill_lookalike?: boolean | null
          boost_settings?: Json | null
          budget_allocated?: number | null
          budget_spent?: number | null
          clips_count?: number | null
          created_at?: string
          created_by?: string | null
          cta_type?: string | null
          description?: string | null
          echo_boost_enabled?: boolean | null
          echo_boost_platforms?: number | null
          end_date?: string | null
          goal?: string | null
          hashtags_caption?: string | null
          id?: string
          name?: string
          notes?: string | null
          platform_targets?: Json | null
          platforms?: Json | null
          posting_end_date?: string | null
          posting_start_date?: string | null
          requires_approval?: boolean | null
          start_date?: string | null
          status?: string | null
          syndication_tier?: string | null
          total_boost_spend?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_assigned_editor_id_fkey"
            columns: ["assigned_editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tokens: {
        Row: {
          ayrshare_api_key: string
          ayrshare_user_id: string
          client_name: string | null
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ayrshare_api_key: string
          ayrshare_user_id: string
          client_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ayrshare_api_key?: string
          ayrshare_user_id?: string
          client_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_seedings: {
        Row: {
          actual_count: number | null
          boost_id: string | null
          content_item_id: string | null
          created_at: string | null
          id: string
          seed_comments: Json | null
          status: string | null
          target_count: number | null
          updated_at: string | null
        }
        Insert: {
          actual_count?: number | null
          boost_id?: string | null
          content_item_id?: string | null
          created_at?: string | null
          id?: string
          seed_comments?: Json | null
          status?: string | null
          target_count?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_count?: number | null
          boost_id?: string | null
          content_item_id?: string | null
          created_at?: string | null
          id?: string
          seed_comments?: Json | null
          status?: string | null
          target_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_seedings_boost_id_fkey"
            columns: ["boost_id"]
            isOneToOne: false
            referencedRelation: "boosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_seedings_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_templates: {
        Row: {
          campaign_id: string | null
          comment_text: string
          content_item_id: string | null
          created_at: string
          id: string
          tone_type: string | null
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          comment_text: string
          content_item_id?: string | null
          created_at?: string
          id?: string
          tone_type?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          comment_text?: string
          content_item_id?: string | null
          created_at?: string
          id?: string
          tone_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_templates_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_templates_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          comment_text: string
          content_item_id: string | null
          created_at: string | null
          id: string
          is_seeded: boolean | null
          tone_type: string | null
        }
        Insert: {
          comment_text: string
          content_item_id?: string | null
          created_at?: string | null
          id?: string
          is_seeded?: boolean | null
          tone_type?: string | null
        }
        Update: {
          comment_text?: string
          content_item_id?: string | null
          created_at?: string | null
          id?: string
          is_seeded?: boolean | null
          tone_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          song_id: string | null
          status: string | null
          thumbnail_url: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          song_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          song_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_assignments: {
        Row: {
          assigned_at: string | null
          campaign_id: string | null
          completed_at: string | null
          content_item_id: string | null
          created_at: string | null
          editor_id: string | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          campaign_id?: string | null
          completed_at?: string | null
          content_item_id?: string | null
          created_at?: string | null
          editor_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          campaign_id?: string | null
          completed_at?: string | null
          content_item_id?: string | null
          created_at?: string | null
          editor_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "editor_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editor_assignments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editor_assignments_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      editors: {
        Row: {
          created_at: string
          current_task_count: number | null
          email: string
          id: string
          name: string
          status: string | null
          updated_at: string
          upload_speed_per_day: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_task_count?: number | null
          email: string
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          upload_speed_per_day?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_task_count?: number | null
          email?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          upload_speed_per_day?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          comments: number | null
          content_item_id: string | null
          created_at: string | null
          ctr: number | null
          id: string
          impressions: number | null
          platform: string
          recorded_at: string | null
          saves: number | null
          shares: number | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          comments?: number | null
          content_item_id?: string | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          platform: string
          recorded_at?: string | null
          saves?: number | null
          shares?: number | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          comments?: number | null
          content_item_id?: string | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          platform?: string
          recorded_at?: string | null
          saves?: number | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metrics_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      post_status_logs: {
        Row: {
          created_at: string
          id: string
          message: string | null
          response_data: Json | null
          scheduled_post_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          response_data?: Json | null
          scheduled_post_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          response_data?: Json | null
          scheduled_post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_status_logs_scheduled_post_id_fkey"
            columns: ["scheduled_post_id"]
            isOneToOne: false
            referencedRelation: "scheduled_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qc_submissions: {
        Row: {
          content_item_id: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
        }
        Insert: {
          content_item_id?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
        }
        Update: {
          content_item_id?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qc_submissions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_posts: {
        Row: {
          ayrshare_post_id: string | null
          boost_enabled: boolean | null
          campaign_id: string | null
          caption: string
          content_item_id: string | null
          created_at: string
          id: string
          media_urls: Json | null
          platforms: Json
          schedule_time: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ayrshare_post_id?: string | null
          boost_enabled?: boolean | null
          campaign_id?: string | null
          caption: string
          content_item_id?: string | null
          created_at?: string
          id?: string
          media_urls?: Json | null
          platforms?: Json
          schedule_time: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ayrshare_post_id?: string | null
          boost_enabled?: boolean | null
          campaign_id?: string | null
          caption?: string
          content_item_id?: string | null
          created_at?: string
          id?: string
          media_urls?: Json | null
          platforms?: Json
          schedule_time?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          artist: string | null
          bpm: number | null
          created_at: string | null
          duration: number | null
          energy_level: string | null
          file_url: string | null
          genre: string | null
          id: string
          key: string | null
          mood: string | null
          platform_compatibility: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artist?: string | null
          bpm?: number | null
          created_at?: string | null
          duration?: number | null
          energy_level?: string | null
          file_url?: string | null
          genre?: string | null
          id?: string
          key?: string | null
          mood?: string | null
          platform_compatibility?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artist?: string | null
          bpm?: number | null
          created_at?: string | null
          duration?: number | null
          energy_level?: string | null
          file_url?: string | null
          genre?: string | null
          id?: string
          key?: string | null
          mood?: string | null
          platform_compatibility?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          progress_percentage: number | null
          training_module: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          training_module: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          training_module?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "social_media_manager" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "social_media_manager", "editor", "user"],
    },
  },
} as const
