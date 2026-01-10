
import React from 'react';
import { Project, User } from '../types';

interface ProjectListProps {
  projects: Project[];
  users: User[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map(project => {
        const owner = users.find(u => u.id === project.ownerId);
        return (
          <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                {project.code}
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-bold uppercase border border-green-100">Active</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">{project.description}</p>
            
            <div className="border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Owner</p>
                  <div className="flex items-center gap-2">
                    <img src={owner?.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium text-slate-700">{owner?.name}</span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Members</p>
                   <div className="flex -space-x-2">
                     {project.members.slice(0, 3).map(mid => (
                       <img 
                        key={mid}
                        src={users.find(u => u.id === mid)?.avatar} 
                        className="w-6 h-6 rounded-full border-2 border-white"
                       />
                     ))}
                     {project.members.length > 3 && (
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                         +{project.members.length - 3}
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all bg-slate-50/50">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
          <PlusIcon />
        </div>
        <span className="font-bold">Create New Project</span>
      </button>
    </div>
  );
};

const PlusIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default ProjectList;
