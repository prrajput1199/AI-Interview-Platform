import type { ResumeAnalysis } from '@/types/resume'

export function ResumeAnalysisView({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-fg-subtle">Skills</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {analysis.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-fg-subtle">Experience</p>
        <p className="mt-1.5 text-sm text-fg">
          {analysis.experienceYears} {analysis.experienceYears === 1 ? 'year' : 'years'}
        </p>
      </div>

      {analysis.projects.length > 0 && (
        <div>
          <p className="text-xs font-medium text-fg-subtle">Projects</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {analysis.projects.map((project) => (
              <div
                key={project}
                className="rounded-md border border-border bg-bg-sunken px-3 py-2.5 text-sm text-fg"
              >
                {project}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}