
import React, { useState } from 'react';
import { Project, User, Issue, IssueType, Priority, Severity, IssueStatus } from '../types';
import { suggestPriority } from '../services/gemini';

interface IssueFormProps {
  projects: Project[];
  currentUser: User;
  onSubmit: (issue: Issue) => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ projects, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    type: IssueType.BUG,
    priority: Priority.MEDIUM,
    severity: Severity.MINOR,
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: '',
    version: '',
    labels: '',
  });

  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestPriority = async () => {
    if (!formData.description) return;
    setIsSuggesting(true);
    const suggested = await suggestPriority(formData.description);
    // Rough normalization
    const mapped = Object.values(Priority).find(p => p.toLowerCase() === suggested.toLowerCase()) || Priority.MEDIUM;
    setFormData(prev => ({ ...prev, priority: mapped }));
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === formData.projectId);
    const ticketId = `${project?.code || 'GEN'}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newIssue: Issue = {
      ...formData,
      id: ticketId,
      status: IssueStatus.NEW,
      reporterId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: formData.labels.split(',').map(l => l.trim()).filter(Boolean),
      attachments: []
    };
    
    onSubmit(newIssue);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Issue Title</label>
          <input 
            required
            maxLength={200}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
            placeholder="e.g., App crashes when uploading 4K video"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Project</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Issue Type</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as IssueType })}
            >
              {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-700">Description</label>
            <button 
              type="button"
              onClick={handleSuggestPriority}
              disabled={isSuggesting || !formData.description}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 disabled:opacity-50"
            >
              <SparklesIcon className="w-3 h-3" />
              {isSuggesting ? 'Suggesting...' : 'Suggest Priority via AI'}
            </button>
          </div>
          <textarea 
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px]"
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            >
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Severity</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
            >
              {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {formData.type === IssueType.BUG && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-900">Bug Details</h4>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Steps to Reproduce</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] font-mono text-sm"
                placeholder="1. Go to settings&#10;2. Toggle dark mode..."
                value={formData.stepsToReproduce}
                onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Environment</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Chrome, Windows 11"
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">App Version</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., 2.1.0-alpha"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Labels (comma separated)</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., ui, backend, high-priority"
            value={formData.labels}
            onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
        <button type="button" className="px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">
          Save Draft
        </button>
        <button 
          type="submit"
          className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          Create Issue
        </button>
      </div>
    </form>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;

export default IssueForm;
