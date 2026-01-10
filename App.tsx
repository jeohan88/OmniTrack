
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_ISSUES } from './mockData';
import { User, Issue, Project, Role, IssueStatus, Priority, IssueType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import IssueForm from './components/IssueForm';
import ProjectList from './components/ProjectList';

type Page = 'dashboard' | 'issues' | 'projects' | 'create-issue' | 'issue-detail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[1]); // Logged in as Bob Manager
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Derived state
  const selectedIssue = useMemo(() => 
    issues.find(i => i.id === selectedIssueId), [issues, selectedIssueId]
  );

  const handleUpdateIssue = (updatedIssue: Issue) => {
    setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
  };

  const handleCreateIssue = (newIssue: Issue) => {
    setIssues(prev => [newIssue, ...prev]);
    setCurrentPage('issues');
  };

  const navigateToIssueDetail = (id: string) => {
    setSelectedIssueId(id);
    setCurrentPage('issue-detail');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard issues={issues} projects={projects} onIssueClick={navigateToIssueDetail} />;
      case 'issues':
        return <IssueList issues={issues} projects={projects} onIssueClick={navigateToIssueDetail} />;
      case 'projects':
        return <ProjectList projects={projects} users={MOCK_USERS} />;
      case 'create-issue':
        return <IssueForm projects={projects} currentUser={currentUser!} onSubmit={handleCreateIssue} />;
      case 'issue-detail':
        return selectedIssue ? (
          <IssueDetail 
            issue={selectedIssue} 
            projects={projects} 
            users={MOCK_USERS} 
            currentUser={currentUser!}
            onUpdate={handleUpdateIssue}
            onBack={() => setCurrentPage('issues')}
          />
        ) : <div className="p-8">Issue not found</div>;
      default:
        return <Dashboard issues={issues} projects={projects} onIssueClick={navigateToIssueDetail} />;
    }
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={currentUser} 
        onLogout={() => setCurrentUser(null)}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {currentPage.replace('-', ' ')}
            </h1>
            <p className="text-slate-500">Welcome back, {currentUser.name}</p>
          </div>
          {currentPage !== 'create-issue' && (
            <button
              onClick={() => setCurrentPage('create-issue')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <PlusIcon />
              New Issue
            </button>
          )}
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

// Helper Components
const Login: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <LogoIcon className="text-white w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">OmniTrack</h2>
        <p className="text-slate-500 mt-2">Internal Issue Tracking System</p>
      </div>
      <div className="space-y-4">
        {MOCK_USERS.map(user => (
          <button
            key={user.id}
            onClick={() => onLogin(user)}
            className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <img src={user.avatar} className="w-10 h-10 rounded-full mr-4" />
            <div className="text-left">
              <div className="font-semibold text-slate-900 group-hover:text-indigo-600">{user.name}</div>
              <div className="text-xs text-slate-500">{user.role}</div>
            </div>
            <ArrowRightIcon className="ml-auto text-slate-300 group-hover:text-indigo-500" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const ArrowRightIcon = ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const LogoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export default App;
