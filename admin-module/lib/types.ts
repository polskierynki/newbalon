export type ContentRow = {
  key: string
  value: string
  updated_at: string
}

export type GalleryImage = {
  id: string
  url: string
  caption: string
  position: number
  created_at: string
}

export type Service = {
  id: string
  title: string
  icon: string
  position: number
  photos: string[]
}

export type Database = {
  public: {
    Tables: {
      content: {
        Row: ContentRow
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: GalleryImage
        Insert: {
          id?: string
          url: string
          caption?: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          caption?: string
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      services: {
        Row: Service
        Insert: {
          id?: string
          title: string
          description?: string
          icon?: string
          position?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          position?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}