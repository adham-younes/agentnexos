export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrganizationRole = "owner" | "admin" | "member" | "reviewer";
export type RunStatus =
  | "queued"
  | "running"
  | "waiting_approval"
  | "completed"
  | "failed"
  | "cancelled";
export type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";
export type ToolEffectType = "read" | "write" | "sensitive";
export type ToolCallStatus =
  | "executing"
  | "completed"
  | "failed"
  | "blocked_pending_approval";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";
export type ArtifactType =
  | "report"
  | "code"
  | "data"
  | "document"
  | "audit_proof";
export type AgentRole =
  | "process_analyst"
  | "tool_orchestrator"
  | "verifier_supervisor";

export interface Database {
  public: {
    Tables: {
      // Verified agentnexos source schema. Legacy enterprise declarations below
      // remain compatibility types for inactive modules, not deployed capability.
      agentnexos_profiles: {
        Row: { id: string; display_name: string; created_at: string };
        Insert: { id: string; display_name?: string; created_at?: string };
        Update: { display_name?: string };
        Relationships: [];
      };
      agentnexos_conversations: {
        Row: { id: string; user_id: string; title: string; locale: 'ar' | 'en'; created_at: string; updated_at: string; revision: number; last_save_id: string | null; last_save_hash: string | null };
        Insert: { id?: string; user_id: string; title: string; locale: 'ar' | 'en'; created_at?: string; updated_at?: string; revision?: number; last_save_id?: string | null; last_save_hash?: string | null };
        Update: { title?: string; updated_at?: string; revision?: number; last_save_id?: string | null; last_save_hash?: string | null };
        Relationships: [];
      };
      agentnexos_messages: {
        Row: { id: string; conversation_id: string; user_id: string; request_id: string; role: 'user' | 'assistant'; content: string; sequence: number; created_at: string };
        Insert: { id?: string; conversation_id: string; user_id: string; request_id: string; role: 'user' | 'assistant'; content: string; created_at?: string };
        Update: never;
        Relationships: [];
      };
      agentnexos_demo_requests: {
        Row: { id: string; subject_hash: string; created_at: string; status: 'reserved' | 'running' | 'completed' | 'failed' | 'cancelled'; stages: Json; completed_at: string | null };
        Insert: { id?: string; subject_hash: string; created_at?: string; status?: string; stages?: Json; completed_at?: string | null };
        Update: { status?: string; stages?: Json; completed_at?: string | null };
        Relationships: [];
      };
      agentnexos_demo_limits: {
        Row: { singleton: boolean; connection_daily_limit: number; global_daily_limit: number };
        Insert: { singleton?: boolean; connection_daily_limit: number; global_daily_limit: number };
        Update: { connection_daily_limit?: number; global_daily_limit?: number };
        Relationships: [];
      };
      organizations: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          slug: string;
          status: "active" | "suspended" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: "active" | "suspended" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          status?: "active" | "suspended" | "archived";
          updated_at?: string;
        };
      };
      profiles: {
        Relationships: [];
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      memberships: {
        Relationships: [];
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: OrganizationRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: OrganizationRole;
          created_at?: string;
        };
        Update: {
          role?: OrganizationRole;
        };
      };
      agent_threads: {
        Relationships: [];
        Row: {
          id: string;
          organization_id: string;
          created_by: string;
          title: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          created_by: string;
          title?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          metadata?: Json;
          updated_at?: string;
        };
      };
      agent_messages: {
        Relationships: [];
        Row: {
          id: string;
          thread_id: string;
          organization_id: string;
          sender_role: "user" | "assistant" | "system" | "tool";
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          organization_id: string;
          sender_role: "user" | "assistant" | "system" | "tool";
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: Json;
        };
      };
      agent_runs: {
        Relationships: [];
        Row: {
          id: string;
          thread_id: string;
          organization_id: string;
          status: RunStatus;
          execution_contract: Json;
          model_used: string | null;
          total_tokens: number;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          thread_id: string;
          organization_id: string;
          status?: RunStatus;
          execution_contract?: Json;
          model_used?: string | null;
          total_tokens?: number;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          status?: RunStatus;
          execution_contract?: Json;
          model_used?: string | null;
          total_tokens?: number;
          error_message?: string | null;
          completed_at?: string | null;
        };
      };
      agent_steps: {
        Relationships: [];
        Row: {
          id: string;
          run_id: string;
          organization_id: string;
          step_number: number;
          agent_role: AgentRole;
          step_type: "analysis" | "tool_call" | "approval_gate" | "verification" | "synthesis";
          input_payload: Json;
          output_payload: Json | null;
          status: StepStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          organization_id: string;
          step_number: number;
          agent_role: AgentRole;
          step_type: "analysis" | "tool_call" | "approval_gate" | "verification" | "synthesis";
          input_payload?: Json;
          output_payload?: Json | null;
          status?: StepStatus;
          created_at?: string;
        };
        Update: {
          output_payload?: Json | null;
          status?: StepStatus;
        };
      };
      tool_calls: {
        Relationships: [];
        Row: {
          id: string;
          run_id: string;
          step_id: string | null;
          organization_id: string;
          tool_name: string;
          effect_type: ToolEffectType;
          input_parameters: Json;
          output_result: Json | null;
          idempotency_key: string | null;
          status: ToolCallStatus;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          run_id: string;
          step_id?: string | null;
          organization_id: string;
          tool_name: string;
          effect_type: ToolEffectType;
          input_parameters?: Json;
          output_result?: Json | null;
          idempotency_key?: string | null;
          status?: ToolCallStatus;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          output_result?: Json | null;
          status?: ToolCallStatus;
          error_message?: string | null;
          completed_at?: string | null;
        };
      };
      approvals: {
        Relationships: [];
        Row: {
          id: string;
          run_id: string;
          organization_id: string;
          tool_call_id: string | null;
          action_summary: string;
          requested_by_agent: string;
          status: ApprovalStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          organization_id: string;
          tool_call_id?: string | null;
          action_summary: string;
          requested_by_agent: string;
          status?: ApprovalStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          status?: ApprovalStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
        };
      };
      artifacts: {
        Relationships: [];
        Row: {
          id: string;
          run_id: string;
          organization_id: string;
          name: string;
          artifact_type: ArtifactType;
          content_hash: string;
          storage_path: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          organization_id: string;
          name: string;
          artifact_type: ArtifactType;
          content_hash: string;
          storage_path?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          name?: string;
          storage_path?: string | null;
          metadata?: Json;
        };
      };
      audit_events: {
        Relationships: [];
        Row: {
          id: string;
          organization_id: string;
          actor_id: string | null;
          event_type: string;
          resource_type: string;
          resource_id: string;
          payload: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          actor_id?: string | null;
          event_type: string;
          resource_type: string;
          resource_id: string;
          payload?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: never; // Append-only immutable log
      };
      memories: {
        Relationships: [];
        Row: {
          id: string;
          organization_id: string;
          memory_type: "working" | "episodic" | "semantic";
          content: string;
          metadata: Json;
          retention_policy: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          memory_type: "working" | "episodic" | "semantic";
          content: string;
          metadata?: Json;
          retention_policy?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: Json;
          retention_policy?: string | null;
        };
      };
      integration_connections: {
        Relationships: [];
        Row: {
          id: string;
          organization_id: string;
          provider: string;
          connection_status: "connected" | "disconnected" | "error";
          secret_reference: string;
          config: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          provider: string;
          connection_status?: "connected" | "disconnected" | "error";
          secret_reference: string;
          config?: Json;
          created_at?: string;
        };
        Update: {
          connection_status?: "connected" | "disconnected" | "error";
          config?: Json;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      agentnexos_save_conversation: {
        Args: { p_user_id: string; p_conversation_id: string; p_expected_revision: number; p_request_id: string; p_title: string; p_locale: string; p_messages: Json; p_payload_hash: string };
        Returns: { id: string; title: string; locale: 'ar' | 'en'; created_at: string; updated_at: string; revision: number }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
