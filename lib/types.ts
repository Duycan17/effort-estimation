export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  afp: number
  input: number
  output: number
  enquiry: number
  file: number
  interface: number
  resource: number
  duration: number
  predicted_effort: number
  actual_effort?: number
  feedback_rating?: number
  feedback_comment?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface FormValues {
  afp: number
  input: number
  output: number
  enquiry: number
  file: number
  interface: number
  resource: number
  duration: number
}
