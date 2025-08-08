
"use client";

import { CheckCircle, AlertTriangle, Lightbulb, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ReportSection {
  title: string;
  content: string[];
}

interface ParsedReport {
  summary?: ReportSection;
  strengths?: ReportSection;
  improvements?: ReportSection;
  samples?: ReportSection;
  recommendation?: ReportSection;
}

const SectionCard = ({ title, content, icon }: { title: string, content: string[], icon: React.ReactNode }) => {
    if (!content || content.length === 0) return null;
    const contentString = content.join('\n');
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent>
                {title.toLowerCase().includes('sample') ? (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentString.replace(/\n/g, '<br />') }} />
                ) : (
                    <ul className="list-disc space-y-2 pl-5 text-sm">
                        {content.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};


export const InterviewReport = ({ markdown }: { markdown: string }) => {
  const parseMarkdown = (text: string): ParsedReport => {
    const sections: ParsedReport = {};
    const lines = text.split('\n');
    let currentSection: keyof ParsedReport | null = null;
    
    for (const line of lines) {
      if (line.startsWith('## Overall Summary')) {
        currentSection = 'summary';
        sections.summary = { title: 'Overall Summary', content: [] };
      } else if (line.startsWith('## Strengths')) {
        currentSection = 'strengths';
        sections.strengths = { title: 'Strengths', content: [] };
      } else if (line.startsWith('## Areas for Improvement')) {
        currentSection = 'improvements';
        sections.improvements = { title: 'Areas for Improvement', content: [] };
      } else if (line.startsWith('## Sample Answers')) {
        currentSection = 'samples';
        sections.samples = { title: 'Sample Answers', content: [] };
      } else if (line.startsWith('## Final Recommendation')) {
        currentSection = 'recommendation';
        sections.recommendation = { title: 'Final Recommendation', content: [] };
      } else if (currentSection && line.trim()) {
        const cleanedLine = line.replace(/^- \s*/, '').replace(/###\s*/, '<strong>').concat('</strong>');
        sections[currentSection]?.content.push(cleanedLine);
      }
    }

    return sections;
  };

  const report = parseMarkdown(markdown);

  return (
    <div className="space-y-6">
      {report.summary && (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{report.summary.title}</h3>
          <p className="text-sm text-muted-foreground">{report.summary.content.join('\n')}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Strengths" content={report.strengths?.content || []} icon={<CheckCircle className="text-green-500" />} />
        <SectionCard title="Areas for Improvement" content={report.improvements?.content || []} icon={<AlertTriangle className="text-yellow-500" />} />
      </div>
      {report.samples && <SectionCard title="Sample Answers" content={report.samples?.content || []} icon={<Lightbulb className="text-blue-500" />} />}
      {report.recommendation && <SectionCard title="Final Recommendation" content={report.recommendation?.content || []} icon={<UserCheck className="text-primary" />} />}
    </div>
  );
};

    