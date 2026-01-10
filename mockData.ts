
import { Role, IssueType, Priority, Severity, IssueStatus, User, Project, Issue } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@omnitrack.com', role: Role.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Bob Manager', email: 'bob@omnitrack.com', role: Role.PM, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Charlie Dev', email: 'charlie@omnitrack.com', role: Role.ENGINEER, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Diana Tester', email: 'diana@omnitrack.com', role: Role.TESTER, avatar: 'https://i.pravatar.cc/150?u=u4' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Core Platform', code: 'CORE', description: 'Main architecture and APIs', ownerId: 'u2', members: ['u1', 'u2', 'u3', 'u4'] },
  { id: 'p2', name: 'Mobile App', code: 'MOBI', description: 'React Native mobile application', ownerId: 'u2', members: ['u2', 'u3'] },
  { id: 'p3', name: 'Analytics Engine', code: 'ANLY', description: 'Data processing pipelines', ownerId: 'u1', members: ['u1', 'u3'] },
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'CORE-001',
    title: 'Login fails on Safari',
    description: 'Users report that clicking the login button does nothing in Safari 15+.',
    projectId: 'p1',
    type: IssueType.BUG,
    priority: Priority.CRITICAL,
    severity: Severity.BLOCKER,
    status: IssueStatus.IN_PROGRESS,
    reporterId: 'u4',
    assigneeId: 'u3',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    stepsToReproduce: '1. Open Safari\n2. Go to login page\n3. Click Login',
    expectedBehavior: 'User should be redirected to dashboard',
    actualBehavior: 'Nothing happens, no error in console',
    environment: 'Safari 15.4, MacOS Monterey',
    version: '1.2.0',
    labels: ['frontend', 'browser-specific'],
    attachments: []
  },
  {
    id: 'MOBI-005',
    title: 'Dark mode toggle missing',
    description: 'The dark mode switch disappeared after the last update.',
    projectId: 'p2',
    type: IssueType.ENHANCEMENT,
    priority: Priority.LOW,
    severity: Severity.MINOR,
    status: IssueStatus.NEW,
    reporterId: 'u3',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    labels: ['ui', 'low-priority'],
    attachments: []
  }
];
