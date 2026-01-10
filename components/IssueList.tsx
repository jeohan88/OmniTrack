
import React, { useState, useMemo } from 'react';
import { Issue, Project, IssueStatus, Priority, IssueType } from '../types';

interface IssueListProps {
  issues: Issue[];
  projects: Project[];
  onIssueClick: (id: string) => void;
}

const IssueList: React.FC<IssueListProps> = ({ issues, projects, onIssueClick }) => {
  const [filter, setFilter] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    type: 'All',
    project: 'All'
  });

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const searchMatch = issue.title.toLowerCase().includes(filter.search.toLowerCase()) || 
                          issue.id.toLowerCase().includes(filter.search.toLowerCase());
      const statusMatch = filter.status === 'All' || issue.status === filter.status;
      const priorityMatch = filter.priority === 'All' || issue.priority === filter.priority;
      const typeMatch = filter.type === 'All' || issue.type === filter.type;
      const projectMatch = filter.project === 'All' || issue.projectId === filter.project;

      return searchMatch && statusMatch && priorityMatch && typeMatch && projectMatch;
    });
  }, [issues, filter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Search</label>
          <div className="relative">
             <input
              type="text"
              placeholder="Search ID or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
            <SearchIcon className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Project</label>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.project}
            onChange={(e) => setFilter({ ...filter, project: e.target.value })}
          >
            <option value="All">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Priority</label>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="All">All Priorities</option>
            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <div 
              key={issue.id}
              onClick={() => onIssueClick(issue.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getTypeStyle(issue.type)}`}>
                  <IssueTypeIcon type={issue.type} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-indigo-600">{issue.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-500">{projects.find(p => p.id === issue.projectId)?.name}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(issue.status)}`}>
                      {issue.status}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 ml-6">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Priority</p>
                  <span className={`text-sm font-bold ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <ArrowRightIcon className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium">No issues found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const getTypeStyle = (type: IssueType) => {
  switch (type) {
    case IssueType.BUG: return 'bg-red-50 text-red-500';
    case IssueType.FEATURE: return 'bg-blue-50 text-blue-500';
    case IssueType.TASK: return 'bg-slate-50 text-slate-500';
    case IssueType.ENHANCEMENT: return 'bg-emerald-50 text-emerald-500';
    default: return 'bg-slate-50 text-slate-500';
  }
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

const IssueTypeIcon = ({ type }: { type: IssueType }) => {
  switch (type) {
    case IssueType.BUG: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    case IssueType.FEATURE: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    default: return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
  }
};

const SearchIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ClockIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowRightIcon = (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

export default IssueList;
