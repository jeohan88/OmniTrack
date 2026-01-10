
import React, { useState, useEffect } from 'react';
import { Issue, Project, User, IssueStatus, Priority, Severity, IssueType } from '../types';
import { summarizeIssue } from '../services/gemini';

interface IssueDetailProps {
  issue: Issue;
  projects: Project[];
  users: User[];
  currentUser: User;
  onUpdate: (issue: Issue) => void;
  onBack: () => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, projects, users, currentUser, onUpdate, onBack }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [comment, setComment] = useState('');

  const project = projects.find(p => p.id === issue.projectId);
  const reporter = users.find(u => u.id === issue.reporterId);
  const assignee = users.find(u => u.id === issue.assigneeId);

  const handleStatusChange = (status: IssueStatus) => {
    onUpdate({ ...issue, status, updatedAt: new Date().toISOString() });
  };

  const handleGetAiSummary = async () => {
    setIsSummarizing(true);
    const summary = await summarizeIssue(issue.title, issue.description);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
        <ArrowLeftIcon /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{issue.id}</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm font-medium text-slate-500">{project?.name}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{issue.title}</h2>
            
            <div className="prose prose-slate max-w-none">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap">
                {issue.description}
              </div>
            </div>

            {issue.stepsToReproduce && (
              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Steps to Reproduce</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-mono text-sm">
                  {issue.stepsToReproduce}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-3 text-indigo-700">
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <button 
                onClick={handleGetAiSummary}
                disabled={isSummarizing}
                className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                {isSummarizing ? 'Analyzing...' : aiSummary ? 'Re-summarize' : 'Generate Quick Summary'}
              </button>
            </div>
            {aiSummary && (
              <div className="mt-3 p-4 bg-white border border-indigo-100 rounded-xl italic text-slate-600 text-sm">
                "{aiSummary}"
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Comments</h3>
            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">System Bot</span>
                      <span className="text-xs text-slate-400">2 days ago</span>
                    </div>
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      Issue was automatically generated from support ticket #ST-402.
                    </p>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                placeholder="Add a comment... (use @ to mention someone)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  onClick={() => setComment('')}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Management</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={issue.status}
                  onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
                >
                  {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assignee</label>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {assignee ? (
                    <>
                      <img src={assignee.avatar} className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-medium text-slate-700">{assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Unassigned</span>
                  )}
                  <button className="ml-auto text-indigo-600 text-xs font-bold hover:underline">Change</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Details</h4>
            <div className="space-y-4">
              <DetailRow label="Priority" value={issue.priority} color={getPriorityColor(issue.priority)} />
              <DetailRow label="Severity" value={issue.severity} color={getPriorityColor(issue.severity as any)} />
              <DetailRow label="Type" value={issue.type} />
              <DetailRow label="Reporter" value={reporter?.name || 'Unknown'} />
              <DetailRow label="Created" value={new Date(issue.createdAt).toLocaleDateString()} />
              <DetailRow label="Updated" value={new Date(issue.updatedAt).toLocaleDateString()} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {issue.labels.map(l => (
                <span key={l} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                  {l}
                </span>
              ))}
              <button className="p-1 text-slate-400 hover:text-indigo-600">
                <PlusSmallIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, color }: { label: string, value: string, color?: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={`font-bold ${color || 'text-slate-900'}`}>{value}</span>
  </div>
);

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.CRITICAL: return 'text-red-600';
    case Priority.HIGH: return 'text-orange-500';
    case Priority.MEDIUM: return 'text-amber-500';
    case Priority.LOW: return 'text-green-500';
    default: return 'text-slate-500';
  }
};

const ArrowLeftIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SparklesIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;
const PlusSmallIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

export default IssueDetail;
