
export enum Role {
  ADMIN = 'Admin',
  PM = 'Project Manager',
  ENGINEER = 'Engineer',
  TESTER = 'Tester/QA',
  SUPPORT = 'Support Staff'
}

export enum IssueType {
  BUG = 'Bug',
  FEATURE = 'Feature Request',
  TASK = 'Task',
  ENHANCEMENT = 'Enhancement'
}

export enum Priority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum Severity {
  BLOCKER = 'Blocker',
  MAJOR = 'Major',
  MINOR = 'Minor',
  TRIVIAL = 'Trivial'
}

export enum IssueStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  REOPENED = 'Reopened'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  ownerId: string;
  members: string[]; // User IDs
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  text: string;
  createdAt: string;
  attachments?: string[];
}

export interface Activity {
  id: string;
  issueId: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface Issue {
  id: string; // Unique ticket ID like PROJ-001
  title: string;
  description: string;
  projectId: string;
  type: IssueType;
  priority: Priority;
  severity: Severity;
  status: IssueStatus;
  reporterId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  version?: string;
  labels: string[];
  attachments: string[];
}
