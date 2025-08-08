
import { cn } from "@/lib/utils";
import React from 'react';

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ResumeSection = ({ title, children, className }: ResumeSectionProps) => (
  <div className={cn("mb-4", className)}>
    <h3 className="text-sm font-bold border-b-2 border-primary mb-2 pb-1 uppercase tracking-wider">{title}</h3>
    <div className="text-xs space-y-2">{children}</div>
  </div>
);

export interface TemplateData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: {
    role: string;
    company: string;
    date: string;
    points: string[];
  }[];
  education: {
    degree: string;
    university: string;
    date: string;
  }[];
  skills: string[];
}

interface TemplateComponentProps {
    data: TemplateData;
}

export const ClassicTemplate = React.forwardRef<HTMLDivElement, TemplateComponentProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black font-serif border border-muted-foreground/20 rounded-lg w-[210mm] min-h-[297mm] mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-sm">
          {data.email} | {data.phone} | {data.linkedin}
        </p>
      </header>

      <ResumeSection title="Summary">
        <p className="text-sm">{data.summary}</p>
      </ResumeSection>

      <ResumeSection title="Experience">
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold text-sm">
              <h4>{exp.role}</h4>
              <p>{exp.date}</p>
            </div>
            <p className="italic mb-1 text-sm">{exp.company}</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              {exp.points.map((point, j) => <li key={j}>{point}</li>)}
            </ul>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between mb-2 text-sm">
            <div>
              <h4 className="font-bold">{edu.degree}</h4>
              <p>{edu.university}</p>
            </div>
            <p>{edu.date}</p>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Skills">
        <p className="text-sm">{data.skills.join(", ")}</p>
      </ResumeSection>
    </div>
  );
});
ClassicTemplate.displayName = 'ClassicTemplate';

export const ModernTemplate = React.forwardRef<HTMLDivElement, TemplateComponentProps>(({ data }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white text-black font-sans border border-muted-foreground/20 rounded-lg w-[210mm] min-h-[297mm] mx-auto">
        <header className="mb-6 pb-2 border-b-2 border-primary">
          <h1 className="text-3xl font-bold text-primary">{data.name}</h1>
          <p className="text-sm text-gray-600">
            {data.email} | {data.phone} | {data.linkedin}
          </p>
        </header>
  
        <ResumeSection title="SUMMARY">
          <p className="text-sm">{data.summary}</p>
        </ResumeSection>
  
        <ResumeSection title="EXPERIENCE">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <h4>{exp.role}</h4>
                <p className="text-primary">{exp.date}</p>
              </div>
              <p className="italic mb-1 text-gray-700 text-sm">{exp.company}</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                {exp.points.map((point, j) => <li key={j}>{point}</li>)}
              </ul>
            </div>
          ))}
        </ResumeSection>
  
        <ResumeSection title="EDUCATION">
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-2 text-sm">
              <div>
                <h4 className="font-bold">{edu.degree}</h4>
                <p className="text-gray-700">{edu.university}</p>
              </div>
              <p className="text-primary">{edu.date}</p>
            </div>
          ))}
        </ResumeSection>
  
        <ResumeSection title="SKILLS">
           <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>
                ))}
           </div>
        </ResumeSection>
      </div>
    );
  });
ModernTemplate.displayName = 'ModernTemplate';

export const CreativeTemplate = React.forwardRef<HTMLDivElement, TemplateComponentProps>(({ data }, ref) => {
    return (
      <div ref={ref} className="bg-white text-black font-sans border border-muted-foreground/20 rounded-lg grid grid-cols-3 gap-6 w-[210mm] min-h-[297mm] mx-auto">
        <div className="col-span-1 bg-gray-100 p-6 rounded-l-lg">
            <header className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{data.name.charAt(0)}</span>
                </div>
                <h1 className="text-2xl font-bold">{data.name}</h1>
            </header>
             <ResumeSection title="Contact">
                <p className="text-sm break-words">{data.email}</p>
                <p className="text-sm">{data.phone}</p>
                <p className="text-sm break-words">{data.linkedin}</p>
            </ResumeSection>
             <ResumeSection title="Education">
                {data.education.map((edu, i) => (
                <div key={i} className="mb-2">
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="text-gray-700 text-sm">{edu.university}</p>
                    <p className="text-xs italic text-gray-500">{edu.date}</p>
                </div>
                ))}
            </ResumeSection>
             <ResumeSection title="Skills">
                <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                    {data.skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
            </ResumeSection>
        </div>
        <div className="col-span-2 p-6">
            <ResumeSection title="Summary">
                <p className="text-sm">{data.summary}</p>
            </ResumeSection>
            <ResumeSection title="Experience">
                {data.experience.map((exp, i) => (
                <div key={i} className="mb-3">
                    <div className="flex justify-between font-bold text-sm">
                        <h4>{exp.role}</h4>
                        <p>{exp.date}</p>
                    </div>
                    <p className="italic mb-1 text-sm">{exp.company}</p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                        {exp.points.map((point, j) => <li key={j}>{point}</li>)}
                    </ul>
                </div>
                ))}
            </ResumeSection>
        </div>
      </div>
    );
});
CreativeTemplate.displayName = 'CreativeTemplate';
