'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

interface Experience {
  id: number; company: string; title: string; startDate: string; endDate: string; description: string
}
interface Education {
  id: number; school: string; degree: string; startDate: string; endDate: string
}

let nextExpId = 1
let nextEduId = 1

type Template = 'classic' | 'modern' | 'minimal'

export default function ResumeBuilder() {
  const t = useTranslations("tools.resume-builder")

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]
  const guideSteps = t.raw('guide.steps') as string[]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState<Experience[]>([
    { id: nextExpId++, company: '', title: '', startDate: '', endDate: '', description: '' }
  ])
  const [education, setEducation] = useState<Education[]>([
    { id: nextEduId++, school: '', degree: '', startDate: '', endDate: '' }
  ])
  const [template, setTemplate] = useState<Template>('classic')

  const addExp = () => setExperience([...experience, { id: nextExpId++, company: '', title: '', startDate: '', endDate: '', description: '' }])
  const removeExp = (id: number) => experience.length > 1 && setExperience(experience.filter(e => e.id !== id))
  const updateExp = (id: number, u: Partial<Experience>) => setExperience(experience.map(e => e.id === id ? { ...e, ...u } : e))

  const addEdu = () => setEducation([...education, { id: nextEduId++, school: '', degree: '', startDate: '', endDate: '' }])
  const removeEdu = (id: number) => education.length > 1 && setEducation(education.filter(e => e.id !== id))
  const updateEdu = (id: number, u: Partial<Education>) => setEducation(education.map(e => e.id === id ? { ...e, ...u } : e))

  const handleDownload = () => {
    const styles: Record<Template, string> = {
      classic: `body{font-family:Georgia,serif;color:#1a1a1a;max-width:800px;margin:0 auto;padding:40px;line-height:1.5}
        h1{font-size:28px;margin:0 0 4px}h2{font-size:16px;border-bottom:2px solid #1a1a1a;padding-bottom:4px;margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px}
        .contact{color:#555;font-size:13px;margin-bottom:8px}.summary{margin:10px 0;font-size:14px}
        .entry{margin-bottom:14px}.entry-header{display:flex;justify-content:space-between;align-items:baseline}
        .entry-title{font-weight:bold;font-size:14px}.entry-date{color:#666;font-size:13px}
        .entry-sub{color:#444;font-size:13px;font-style:italic}.entry-desc{font-size:13px;margin-top:4px;white-space:pre-line}
        .skills{font-size:13px}.skills span{display:inline-block;margin:2px 8px 2px 0}`,
      modern: `body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1a1a1a;max-width:800px;margin:0 auto;padding:40px;line-height:1.5}
        h1{font-size:32px;margin:0 0 4px;color:#2563eb}h2{font-size:14px;color:#2563eb;margin:20px 0 10px;text-transform:uppercase;letter-spacing:2px;font-weight:600}
        .contact{color:#555;font-size:13px;margin-bottom:8px}.summary{margin:10px 0;font-size:14px}
        .entry{margin-bottom:14px;padding-left:12px;border-left:3px solid #2563eb}.entry-header{display:flex;justify-content:space-between;align-items:baseline}
        .entry-title{font-weight:600;font-size:14px}.entry-date{color:#666;font-size:13px}
        .entry-sub{color:#444;font-size:13px}.entry-desc{font-size:13px;margin-top:4px;white-space:pre-line}
        .skills{font-size:13px}.skills span{display:inline-block;background:#eff6ff;color:#2563eb;padding:2px 10px;border-radius:12px;margin:3px 4px 3px 0;font-size:12px}`,
      minimal: `body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#333;max-width:760px;margin:0 auto;padding:40px;line-height:1.6}
        h1{font-size:24px;margin:0 0 4px;font-weight:400}h2{font-size:12px;margin:22px 0 8px;text-transform:uppercase;letter-spacing:3px;color:#999;font-weight:400}
        .contact{color:#888;font-size:12px;margin-bottom:8px}.summary{margin:10px 0;font-size:14px;color:#555}
        .entry{margin-bottom:14px}.entry-header{display:flex;justify-content:space-between;align-items:baseline}
        .entry-title{font-weight:500;font-size:14px}.entry-date{color:#999;font-size:12px}
        .entry-sub{color:#666;font-size:13px}.entry-desc{font-size:13px;margin-top:4px;color:#555;white-space:pre-line}
        .skills{font-size:13px}.skills span{display:inline-block;margin:2px 12px 2px 0;color:#555}`,
    }

    const expHtml = experience.filter(e => e.company || e.title).map(e => `
      <div class="entry"><div class="entry-header"><span class="entry-title">${esc(e.title)}</span><span class="entry-date">${esc(e.startDate)}${e.endDate ? ' — ' + esc(e.endDate) : ' — ' + esc(t('preview.present'))}</span></div>
      <div class="entry-sub">${esc(e.company)}</div>${e.description ? `<div class="entry-desc">${esc(e.description)}</div>` : ''}</div>`).join('')

    const eduHtml = education.filter(e => e.school || e.degree).map(e => `
      <div class="entry"><div class="entry-header"><span class="entry-title">${esc(e.degree)}</span><span class="entry-date">${esc(e.startDate)}${e.endDate ? ' — ' + esc(e.endDate) : ''}</span></div>
      <div class="entry-sub">${esc(e.school)}</div></div>`).join('')

    const skillsHtml = skills ? `<h2>${esc(t('preview.skills'))}</h2><div class="skills">${skills.split(',').map(s => `<span>${esc(s.trim())}</span>`).join('')}</div>` : ''
    const contact = [email, phone, location].filter(Boolean).join(' · ')

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(name || t('preview.defaultName'))}</title><style>${styles[template]}@media print{body{padding:20px}}</style></head><body>
      <h1>${esc(name || t('preview.defaultName'))}</h1>${contact ? `<div class="contact">${esc(contact)}</div>` : ''}
      ${summary ? `<div class="summary">${esc(summary)}</div>` : ''}
      ${expHtml ? `<h2>${esc(t('preview.experience'))}</h2>${expHtml}` : ''}
      ${eduHtml ? `<h2>${esc(t('preview.education'))}</h2>${eduHtml}` : ''}
      ${skillsHtml}
    </body></html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 300)
  }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const inp = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
  const label = "block text-xs font-medium text-zinc-400 mb-1"
  const section = "mb-6"

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="resume-builder"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t('guide.heading')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      }
    >
      {/* Template Selector */}
      <div className="flex gap-2 mb-6">
        {(['classic', 'modern', 'minimal'] as Template[]).map(tpl => (
          <button key={tpl} onClick={() => setTemplate(tpl)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${template === tpl ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
            {t(`templates.${tpl}`)}
          </button>
        ))}
        <button onClick={handleDownload} className="ml-auto px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors">
          {t('buttons.downloadPdf')}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className="space-y-1">
          <div className={section}>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">{t('sections.personalInfo')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>{t('labels.fullName')}</label><input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder={t('placeholders.fullName')} /></div>
              <div><label className={label}>{t('labels.email')}</label><input className={inp} value={email} onChange={e => setEmail(e.target.value)} placeholder={t('placeholders.email')} /></div>
              <div><label className={label}>{t('labels.phone')}</label><input className={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('placeholders.phone')} /></div>
              <div><label className={label}>{t('labels.location')}</label><input className={inp} value={location} onChange={e => setLocation(e.target.value)} placeholder={t('placeholders.location')} /></div>
            </div>
          </div>

          <div className={section}>
            <label className={label}>{t('labels.summary')}</label>
            <textarea className={inp + " h-20 resize-none"} value={summary} onChange={e => setSummary(e.target.value)} placeholder={t('placeholders.summary')} />
          </div>

          <div className={section}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-200">{t('sections.workExperience')}</h3>
              <button onClick={addExp} className="text-xs text-blue-400 hover:text-blue-300">{t('buttons.add')}</button>
            </div>
            {experience.map((exp, i) => (
              <div key={exp.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-500">{t('positionLabel', { index: i + 1 })}</span>
                  {experience.length > 1 && <button onClick={() => removeExp(exp.id)} className="text-xs text-red-400 hover:text-red-300">{t('buttons.remove')}</button>}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input className={inp} value={exp.title} onChange={e => updateExp(exp.id, { title: e.target.value })} placeholder={t('placeholders.jobTitle')} />
                  <input className={inp} value={exp.company} onChange={e => updateExp(exp.id, { company: e.target.value })} placeholder={t('placeholders.company')} />
                  <input className={inp} value={exp.startDate} onChange={e => updateExp(exp.id, { startDate: e.target.value })} placeholder={t('placeholders.startDate')} />
                  <input className={inp} value={exp.endDate} onChange={e => updateExp(exp.id, { endDate: e.target.value })} placeholder={t('placeholders.endDateBlank')} />
                </div>
                <textarea className={inp + " h-16 resize-none"} value={exp.description} onChange={e => updateExp(exp.id, { description: e.target.value })} placeholder={t('placeholders.responsibilities')} />
              </div>
            ))}
          </div>

          <div className={section}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-200">{t('sections.education')}</h3>
              <button onClick={addEdu} className="text-xs text-blue-400 hover:text-blue-300">{t('buttons.add')}</button>
            </div>
            {education.map((edu, i) => (
              <div key={edu.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-500">{t('educationLabel', { index: i + 1 })}</span>
                  {education.length > 1 && <button onClick={() => removeEdu(edu.id)} className="text-xs text-red-400 hover:text-red-300">{t('buttons.remove')}</button>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className={inp} value={edu.degree} onChange={e => updateEdu(edu.id, { degree: e.target.value })} placeholder={t('placeholders.degree')} />
                  <input className={inp} value={edu.school} onChange={e => updateEdu(edu.id, { school: e.target.value })} placeholder={t('placeholders.school')} />
                  <input className={inp} value={edu.startDate} onChange={e => updateEdu(edu.id, { startDate: e.target.value })} placeholder={t('placeholders.startYear')} />
                  <input className={inp} value={edu.endDate} onChange={e => updateEdu(edu.id, { endDate: e.target.value })} placeholder={t('placeholders.endYear')} />
                </div>
              </div>
            ))}
          </div>

          <div className={section}>
            <label className={label}>{t('labels.skills')}</label>
            <input className={inp} value={skills} onChange={e => setSkills(e.target.value)} placeholder={t('placeholders.skills')} />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg p-6 text-black min-h-[600px] text-sm" style={{ fontFamily: template === 'classic' ? 'Georgia, serif' : '-apple-system, sans-serif' }}>
          <h1 style={{ fontSize: template === 'minimal' ? 22 : 26, fontWeight: template === 'minimal' ? 400 : 700, color: template === 'modern' ? '#2563eb' : '#1a1a1a', margin: '0 0 4px' }}>
            {name || t('preview.defaultName')}
          </h1>
          {(email || phone || location) && (
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {[email, phone, location].filter(Boolean).join(' · ')}
            </div>
          )}
          {summary && <div style={{ fontSize: 13, color: '#555', margin: '8px 0 16px' }}>{summary}</div>}

          {experience.some(e => e.company || e.title) && (
            <>
              <h2 style={{ fontSize: template === 'minimal' ? 11 : 13, textTransform: 'uppercase', letterSpacing: template === 'minimal' ? 3 : 1, color: template === 'modern' ? '#2563eb' : template === 'minimal' ? '#999' : '#1a1a1a', borderBottom: template === 'classic' ? '2px solid #1a1a1a' : 'none', paddingBottom: 4, margin: '16px 0 8px', fontWeight: template === 'minimal' ? 400 : 600 }}>
                {t('preview.experience')}
              </h2>
              {experience.filter(e => e.company || e.title).map(e => (
                <div key={e.id} style={{ marginBottom: 12, paddingLeft: template === 'modern' ? 10 : 0, borderLeft: template === 'modern' ? '3px solid #2563eb' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: 13 }}>{e.title}</strong>
                    <span style={{ fontSize: 12, color: '#999' }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ` — ${t('preview.present')}`}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', fontStyle: template === 'classic' ? 'italic' : 'normal' }}>{e.company}</div>
                  {e.description && <div style={{ fontSize: 12, color: '#555', marginTop: 3, whiteSpace: 'pre-line' }}>{e.description}</div>}
                </div>
              ))}
            </>
          )}

          {education.some(e => e.school || e.degree) && (
            <>
              <h2 style={{ fontSize: template === 'minimal' ? 11 : 13, textTransform: 'uppercase', letterSpacing: template === 'minimal' ? 3 : 1, color: template === 'modern' ? '#2563eb' : template === 'minimal' ? '#999' : '#1a1a1a', borderBottom: template === 'classic' ? '2px solid #1a1a1a' : 'none', paddingBottom: 4, margin: '16px 0 8px', fontWeight: template === 'minimal' ? 400 : 600 }}>
                {t('preview.education')}
              </h2>
              {education.filter(e => e.school || e.degree).map(e => (
                <div key={e.id} style={{ marginBottom: 10, paddingLeft: template === 'modern' ? 10 : 0, borderLeft: template === 'modern' ? '3px solid #2563eb' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: 13 }}>{e.degree}</strong>
                    <span style={{ fontSize: 12, color: '#999' }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>{e.school}</div>
                </div>
              ))}
            </>
          )}

          {skills && (
            <>
              <h2 style={{ fontSize: template === 'minimal' ? 11 : 13, textTransform: 'uppercase', letterSpacing: template === 'minimal' ? 3 : 1, color: template === 'modern' ? '#2563eb' : template === 'minimal' ? '#999' : '#1a1a1a', borderBottom: template === 'classic' ? '2px solid #1a1a1a' : 'none', paddingBottom: 4, margin: '16px 0 8px', fontWeight: template === 'minimal' ? 400 : 600 }}>
                {t('preview.skills')}
              </h2>
              <div>
                {skills.split(',').map((s, i) => (
                  <span key={i} style={{
                    display: 'inline-block', margin: '2px 4px 2px 0', fontSize: 12,
                    ...(template === 'modern' ? { background: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: 12 } : { marginRight: 12, color: '#555' })
                  }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
