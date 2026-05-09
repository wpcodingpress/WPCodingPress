export const MOSAIC_NAME = "Mosaic"
export const MOSAIC_DESC = "Agency Project Management Platform"

export const PM_WHATSAPP_NUMBER = "8801943429727"

export const PROJECT_MANAGER_NAMES = [
  "Sarah Mitchell", "James Rodriguez", "Emily Chen", "Michael Torres",
  "Olivia Parker", "Daniel Kim", "Sophia Patel", "Alexander Wright",
  "Isabella Martinez", "William Brooks", "Mia Anderson", "Ethan Cooper",
  "Charlotte Reed", "Benjamin Hayes", "Amelia Foster", "Lucas Sullivan",
  "Harper Bennett", "Mason Cruz", "Evelyn Price", "Logan Stewart",
  "Abigail Myers", "Caleb Fisher", "Elizabeth Hart", "Nathan Pierce",
  "Aria Coleman", "Dylan Jenkins", "Scarlett Bishop", "Gabriel Turner",
  "Grace Holmes", "Julian Wallace", "Lily Chandler", "Adrian Ford",
  "Hannah Gibson", "Connor Webb", "Victoria Hale", "Leo Montgomery",
  "Stella Reeves", "Roman Fletcher", "Aurora Gibbs", "Kai West",
]

export function getRandomProjectManager(): string {
  const index = Math.floor(Math.random() * PROJECT_MANAGER_NAMES.length)
  return PROJECT_MANAGER_NAMES[index]
}

export const BOARD_INIT_STEPS = [
  { key: "initializing", label: "Initializing Your Workspace..." },
  { key: "creating", label: "Creating Your Project Board..." },
  { key: "assigning", label: "Assigning Your Project Manager..." },
  { key: "setting_up", label: "Setting Up Your Dashboard..." },
  { key: "live", label: "Going Live with Mosaic 🚀" },
] as const

export const DEFAULT_COLUMNS = [
  { title: "Backlog", color: "#94a3b8", order: 0 },
  { title: "To Do", color: "#6366f1", order: 1 },
  { title: "In Progress", color: "#f59e0b", order: 2 },
  { title: "Review", color: "#8b5cf6", order: 3 },
  { title: "Done", color: "#10b981", order: 4 },
] as const;

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
} as const;

export const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-100 text-blue-600 border-blue-200",
  high: "bg-orange-100 text-orange-600 border-orange-200",
  urgent: "bg-red-100 text-red-600 border-red-200",
} as const;

export const PRIORITY_ORDER: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export type TaskPriority = keyof typeof PRIORITY_LABELS;

export const STORED_TASK_FIELDS = [
  "id", "boardId", "columnId", "title", "description",
  "priority", "dueDate", "order", "estimatedHours",
  "createdAt", "updatedAt",
] as const;

export const STORED_COMMENT_FIELDS = [
  "id", "taskId", "userId", "userName", "userAvatar",
  "content", "createdAt", "updatedAt",
] as const;

export const STORED_ATTACHMENT_FIELDS = [
  "id", "taskId", "userId", "fileName", "fileUrl",
  "fileSize", "fileType", "createdAt",
] as const;

export const STORED_CHECKLIST_FIELDS = [
  "id", "taskId", "title", "completed", "order", "createdAt",
] as const;

export const STORED_COLUMN_FIELDS = [
  "id", "boardId", "title", "color", "order", "createdAt",
] as const;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/gzip",
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getPriorityColor(priority: string): string {
  return PRIORITY_COLORS[priority as TaskPriority] || PRIORITY_COLORS.medium;
}

export function getInitialBoardData(subscriptionId: string, onboardingFormId?: string) {
  const pmName = getRandomProjectManager()
  return {
    subscriptionId,
    onboardingFormId: onboardingFormId || null,
    title: "Project Board",
    description: "Manage your web development project tasks",
    projectManagerName: pmName,
    columns: {
      create: DEFAULT_COLUMNS.map((col) => ({
        title: col.title,
        color: col.color,
        order: col.order,
      })),
    },
  };
}

export function getFirstname(name: string): string {
  return name.split(" ")[0]
}

export interface BoardWithAll {
  id: string
  subscriptionId: string
  onboardingFormId: string | null
  title: string
  description: string | null
  projectManagerName: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  columns: ColumnData[]
  tasks: TaskWithRelations[]
}

export interface ColumnData {
  id: string
  boardId: string
  title: string
  color: string
  order: number
  createdAt: Date
  _count?: { tasks: number }
}

export interface TaskData {
  id: string
  boardId: string
  columnId: string
  title: string
  description: string | null
  priority: string
  dueDate: Date | null
  order: number
  estimatedHours: number | null
  createdAt: Date
  updatedAt: Date
}

export interface TaskWithRelations extends TaskData {
  comments: CommentData[]
  attachments: AttachmentData[]
  checklists: ChecklistData[]
  assignees: AssigneeData[]
  activity: ActivityData[]
}

export interface CommentData {
  id: string
  taskId: string
  userId: string
  userName: string
  userAvatar: string | null
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface AttachmentData {
  id: string
  taskId: string
  userId: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  createdAt: Date
}

export interface ChecklistData {
  id: string
  taskId: string
  title: string
  completed: boolean
  order: number
  createdAt: Date
}

export interface AssigneeData {
  id: string
  taskId: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string | null
  createdAt: Date
}

export interface ActivityData {
  id: string
  boardId: string | null
  taskId: string | null
  userId: string
  userName: string
  userAvatar: string | null
  action: string
  details: string | null
  createdAt: Date
}

export function getDisplayName(user: { name: string | null; role?: string | null }): string {
  if (user.role === "admin" || user.role === "manager") {
    return "WPCodingPress Project Manager(PM)"
  }
  return user.name || "Unknown"
}
