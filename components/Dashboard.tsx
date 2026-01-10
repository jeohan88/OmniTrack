
import React, { useMemo } from 'react';
import { Issue, Project, IssueStatus, Priority } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

interface DashboardProps {
  issues: Issue[];
  projects: Project[];
  onIssueClick: (id: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

const Dashboard: React.FC<DashboardProps> = ({ issues, projects, onIssueClick }) => {
  const stats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter(i => i.status !== IssueStatus.CLOSED && i.status !== IssueStatus.RESOLVED).length;
    const critical = issues.filter(i => i.priority === Priority.CRITICAL).length;
    const resolvedThisWeek = issues.filter(i => i.status === IssueStatus.RESOLVED).length; // Simplified mock logic

    return { total, open, critical, resolvedThisWeek };
  }, [issues]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(i => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const projectData = useMemo(() => {
    return projects.map(p => ({
      name: p.code,
      count: issues.filter(i => i.projectId === p.id).length
    }));
  }, [issues, projects]);

  const recentIssues = issues.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Open Issues" value={stats.open} color="indigo" icon={OpenIcon} />
        <StatCard title="Critical / Blocker" value={stats.critical} color="red" icon={AlertIcon} />
        <StatCard title="Total Tickets" value={stats.total} color="slate" icon={TicketIcon} />
        <StatCard title="Resolved (MTD)" value={stats.resolvedThisWeek} color="green" icon={CheckIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Issues by Project</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Status Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recently Updated</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentIssues.map(issue => (
                <tr 
                  key={issue.id} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onIssueClick(issue.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{issue.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{issue.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(issue.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon: Icon }: any) => {
  const bgColors: any = { indigo: 'bg-indigo-50 text-indigo-600', red: 'bg-red-50 text-red-600', green: 'bg-green-50 text-green-600', slate: 'bg-slate-50 text-slate-600' };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const getStatusStyle = (status: IssueStatus) => {
  switch (status) {
    case IssueStatus.NEW: return 'bg-blue-50 text-blue-700 border-blue-200';
    case IssueStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-700 border-amber-200';
    case IssueStatus.IN_REVIEW: return 'bg-purple-50 text-purple-700 border-purple-200';
    case IssueStatus.RESOLVED: return 'bg-green-50 text-green-700 border-green-200';
    case IssueStatus.CLOSED: return 'bg-slate-50 text-slate-700 border-slate-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.CRITICAL: return 'text-red-600';
    case Priority.HIGH: return 'text-orange-500';
    case Priority.MEDIUM: return 'text-amber-500';
    case Priority.LOW: return 'text-green-500';
    default: return 'text-slate-500';
  }
};

const OpenIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const AlertIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const TicketIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const CheckIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Dashboard;
