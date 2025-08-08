
import { cn } from "@/lib/utils";

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ResumeSection = ({ title, children, className }: ResumeSectionProps) => (
  <div className={cn("mb-4", className)}>
    <h3 className="text-sm font-bold border-b-2 border-primary mb-2 pb-1">{title}</h3>
    <div className="text-xs space-y-2">{children}</div>
  </div>
);

interface TemplateProps {
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

export function ClassicTemplate({ data }: { data: TemplateProps }) {
  return (
    <div className="p-4 bg-white text-black font-serif border border-muted-foreground/20 rounded-lg">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-xs">
          {data.email} | {data.phone} | {data.linkedin}
        </p>
      </header>

      <ResumeSection title="Summary">
        <p>{data.summary}</p>
      </ResumeSection>

      <ResumeSection title="Experience">
        {data.experience.map((exp, i) => (
          <div key={i}>
            <div className="flex justify-between font-bold">
              <h4>{exp.role}</h4>
              <p>{exp.date}</p>
            </div>
            <p className="italic mb-1">{exp.company}</p>
            <ul className="list-disc list-inside space-y-1">
              {exp.points.map((point, j) => <li key={j}>{point}</li>)}
            </ul>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between">
            <div>
              <h4 className="font-bold">{edu.degree}</h4>
              <p>{edu.university}</p>
            </div>
            <p>{edu.date}</p>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Skills">
        <p>{data.skills.join(", ")}</p>
      </ResumeSection>
    </div>
  );
}


export function ModernTemplate({ data }: { data: TemplateProps }) {
    return (
      <div className="p-4 bg-white text-black font-sans border border-muted-foreground/20 rounded-lg">
        <header className="mb-4 pb-2 border-b-2 border-primary">
          <h1 className="text-2xl font-bold text-primary">{data.name}</h1>
          <p className="text-xs text-gray-600">
            {data.email} | {data.phone} | {data.linkedin}
          </p>
        </header>
  
        <ResumeSection title="SUMMARY">
          <p>{data.summary}</p>
        </ResumeSection>
  
        <ResumeSection title="EXPERIENCE">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between font-bold">
                <h4>{exp.role}</h4>
                <p className="text-primary">{exp.date}</p>
              </div>
              <p className="italic mb-1 text-gray-700">{exp.company}</p>
              <ul className="list-disc list-inside space-y-1">
                {exp.points.map((point, j) => <li key={j}>{point}</li>)}
              </ul>
            </div>
          ))}
        </ResumeSection>
  
        <ResumeSection title="EDUCATION">
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between">
              <div>
                <h4 className="font-bold">{edu.degree}</h4>
                <p className="text-gray-700">{edu.university}</p>
              </div>
              <p className="text-primary">{edu.date}</p>
            </div>
          ))}
        </ResumeSection>
  
        <ResumeSection title="SKILLS">
           <div className="flex flex-wrap gap-1">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{skill}</span>
                ))}
           </div>
        </ResumeSection>
      </div>
    );
  }

  export function CreativeTemplate({ data }: { data: TemplateProps }) {
    return (
      <div className="p-4 bg-white text-black font-sans border border-muted-foreground/20 rounded-lg grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-muted p-4 rounded-lg">
            <header className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{data.name.charAt(0)}</span>
                </div>
                <h1 className="text-lg font-bold">{data.name}</h1>
            </header>
             <ResumeSection title="Contact">
                <p>{data.email}</p>
                <p>{data.phone}</p>
                <p>{data.linkedin}</p>
            </ResumeSection>
             <ResumeSection title="Education">
                {data.education.map((edu, i) => (
                <div key={i}>
                    <h4 className="font-bold">{edu.degree}</h4>
                    <p className="text-gray-700">{edu.university}</p>
                    <p className="text-xs italic text-gray-500">{edu.date}</p>
                </div>
                ))}
            </ResumeSection>
             <ResumeSection title="Skills">
                <ul className="list-disc list-inside space-y-1">
                    {data.skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
            </ResumeSection>
        </div>
        <div className="col-span-2 py-4">
            <ResumeSection title="Summary">
                <p>{data.summary}</p>
            </ResumeSection>
            <ResumeSection title="Experience">
                {data.experience.map((exp, i) => (
                <div key={i}>
                    <div className="flex justify-between font-bold">
                    <h4>{exp.role}</h4>
                    <p>{exp.date}</p>
                    </div>
                    <p className="italic mb-1">{exp.company}</p>
                    <ul className="list-disc list-inside space-y-1">
                    {exp.points.map((point, j) => <li key={j}>{point}</li>)}
                    </ul>
                </div>
                ))}
            </ResumeSection>
        </div>
      </div>
    );
  }
