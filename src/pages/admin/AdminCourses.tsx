import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  BookOpen,
  FileText,
  Upload,
  Download,
  Eye,
  ExternalLink,
  AlertCircle,
  FileCheck,
  Scissors,
  Award,
} from 'lucide-react';
import { CourseItem, CourseStageSyllabus } from '../../types';
import { db, DEFAULT_COURSES, DEFAULT_STAGE_SYLLABUSES } from '../../services/db';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SyllabusPdfModal } from '../../components/studio/SyllabusPdfModal';
import { downloadPdf, generateStageSyllabusPdf } from '../../utils/pdfGenerator';
import { Lang } from '../../i18n/translations';

interface AdminCoursesProps {
  editLang?: Lang;
  onLangChange?: (lang: Lang) => void;
}

export const AdminCourses: React.FC<AdminCoursesProps> = ({
  editLang = 'en',
  onLangChange,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stageSyllabuses, setStageSyllabuses] = useState<CourseStageSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stageSaveSuccess, setStageSaveSuccess] = useState(false);
  const [uploadingStageId, setUploadingStageId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewStage, setPreviewStage] = useState<CourseStageSyllabus | null>(null);

  const isTa = editLang === 'ta';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [loadedCourses, loadedStages] = await Promise.all([
          db.getCourses(false), // fetch all courses including inactive
          db.getStageSyllabuses(),
        ]);
        setCourses(loadedCourses);
        setStageSyllabuses(loadedStages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Cross-device sync: listen for window focus
    window.addEventListener('focus', fetchData);

    // Cross-device sync: Supabase Realtime channel
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin_courses_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'courses' },
          async () => {
            try {
              const freshCourses = await db.getCourses(false);
              setCourses(freshCourses);
            } catch (e) {
              console.warn('Realtime courses sync error in admin:', e);
            }
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('focus', fetchData);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // ── Stage Syllabus Handlers ──
  const handleUpdateStage = (id: string, updates: Partial<CourseStageSyllabus>) => {
    setStageSyllabuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleStageFileUpload = async (
    stageId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadingStageId(stageId);

    try {
      const res = await db.uploadStageSyllabusPdf(stageId, file);
      const updated = stageSyllabuses.map((s) =>
        s.id === stageId
          ? {
              ...s,
              pdf_url: res.pdf_url,
              pdf_name: res.pdf_name,
              pdf_size: res.pdf_size,
              updated_at: new Date().toISOString(),
            }
          : s
      );
      setStageSyllabuses(updated);
      await db.saveStageSyllabuses(updated);
      setStageSaveSuccess(true);
      setTimeout(() => setStageSaveSuccess(false), 4000);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload syllabus PDF. Please try again.');
    } finally {
      setUploadingStageId(null);
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  const handleRemoveStagePdf = async (stageId: string) => {
    if (window.confirm('Remove this custom PDF and revert to the official default syllabus PDF?')) {
      try {
        await db.deleteStageSyllabusPdf(stageId);
        const updated = stageSyllabuses.map((s) =>
          s.id === stageId
            ? {
                ...s,
                pdf_url: undefined,
                pdf_name: `Tamil_Designer_Studio_${s.id}_Course_Syllabus.pdf`,
                pdf_size: 'Official Studio Syllabus',
                updated_at: new Date().toISOString(),
              }
            : s
        );
        setStageSyllabuses(updated);
        await db.saveStageSyllabuses(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveStageSyllabuses = async () => {
    try {
      setSaving(true);
      await db.saveStageSyllabuses(stageSyllabuses);
      setStageSaveSuccess(true);
      setTimeout(() => setStageSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadStagePdf = (stage: CourseStageSyllabus) => {
    const filename = stage.pdf_name || `Tamil_Designer_Studio_${stage.id}_Course_Syllabus.pdf`;
    if (stage.pdf_url) {
      downloadPdf(stage.pdf_url, filename);
    } else {
      const blob = generateStageSyllabusPdf(stage);
      downloadPdf(blob, filename);
    }
  };

  // ── Individual Course Handlers ──
  const handleUpdateCourse = (id: string, updates: Partial<CourseItem>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleAddTopic = (courseId: string, topicText: string) => {
    const trimmed = topicText.trim();
    if (!trimmed) return;

    const newItems = trimmed
      .split(/[\n,]/)
      .map((t) => t.trim().replace(/^\d+[\.\)]\s*/, ''))
      .filter((t) => t.length > 0);

    if (newItems.length === 0) return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          if (isTa) {
            const currentTa = c.topics_ta || [...c.topics];
            return { ...c, topics_ta: [...currentTa, ...newItems] };
          }
          return { ...c, topics: [...c.topics, ...newItems] };
        }
        return c;
      })
    );
  };

  const handleRemoveTopic = (courseId: string, topicIndex: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          if (isTa) {
            const currentTa = [...(c.topics_ta || c.topics)];
            currentTa.splice(topicIndex, 1);
            return { ...c, topics_ta: currentTa };
          }
          const updated = [...c.topics];
          updated.splice(topicIndex, 1);
          return { ...c, topics: updated };
        }
        return c;
      })
    );
  };

  const handleLoadOfficialSyllabus = () => {
    if (
      window.confirm(
        'Load all 7 official academy courses (Blouse, Kurti, Pant, Maxi, Full Set, Western, Prepleating) with their complete syllabus? You can still edit or add more before saving.'
      )
    ) {
      setCourses(JSON.parse(JSON.stringify(DEFAULT_COURSES)));
      setStageSyllabuses(JSON.parse(JSON.stringify(DEFAULT_STAGE_SYLLABUSES)));
    }
  };

  const handleAddNewCourse = () => {
    const newCourse: CourseItem = {
      id: 'course-' + Date.now(),
      title: 'New Masterclass Course',
      level: 'Specialized',
      badge: 'Certified',
      description: 'Hands-on practical training with individual machine access and personal guidance.',
      topics: ['Fundamental Pattern Drafting', 'Fabric Cutting & Fitting', 'Finishing & Pressing'],
      is_active: true,
      sort_order: courses.length + 1,
    };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to remove this course and its syllabus?')) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await Promise.all([
        db.saveCourses(courses),
        db.saveStageSyllabuses(stageSyllabuses),
      ]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-studio-500 text-xs">Loading courses and syllabus...</div>;
  }

  const stageBadgeColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    beginner: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-900', icon: Scissors },
    intermediate: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-900', icon: BookOpen },
    advanced: { bg: 'bg-rose-100 border-rose-300', text: 'text-rose-900', icon: Award },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Academy Courses &amp; Syllabus Manager
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Upload PDF syllabus files for all stage classes (Basic, Intermediate, Advanced) and manage masterclasses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadOfficialSyllabus}
            title="Load 7 official syllabus courses"
            className="inline-flex items-center gap-1.5 text-xs bg-gold-50 hover:bg-gold-100 text-gold-950 border border-gold-300 px-3 py-2 rounded-xl transition-colors font-semibold shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gold-700" />
            <span>Restore Official Syllabus</span>
          </button>

          <button
            onClick={handleAddNewCourse}
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-beige-100 text-studio-800 border border-beige-300 px-3.5 py-2 rounded-xl transition-colors font-semibold shadow-subtle"
          >
            <Plus className="w-4 h-4 text-gold-600" />
            <span>Add Course</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs bg-studio-800 hover:bg-studio-900 text-white px-4 py-2 rounded-xl transition-all shadow-subtle font-semibold"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All courses, syllabus PDFs, and topics successfully saved! Live on your website.</span>
        </div>
      )}

      {stageSaveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Stage syllabus PDFs successfully updated! Visitors can now view and download the new PDF.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 1: COURSE STAGE SYLLABUS PDFS (Basic, Intermediate, Advanced)
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-cream-50 via-white to-gold-50/30 rounded-3xl border-2 border-gold-300/80 p-5 sm:p-7 shadow-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-beige-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D9A73A] to-[#E8BE56] text-[#160E07] flex items-center justify-center shadow-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-studio-900">
                Course Stage Syllabus PDFs (Basic, Intermediate &amp; Advanced)
              </h2>
              <p className="text-xs text-studio-500">
                Upload your custom PDF booklet for each stage class. When students hit "See Syllabus", it opens this exact PDF format and allows instant download.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveStageSyllabuses}
            disabled={saving}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs bg-gold-600 hover:bg-gold-700 text-studio-950 font-bold px-4 py-2 rounded-xl transition-all shadow-subtle shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save Syllabus PDFs</span>
          </button>
        </div>

        {/* 3 Stage Class Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {stageSyllabuses.map((stage) => {
            const hasCustomPdf = Boolean(stage.pdf_url);
            const isUploading = uploadingStageId === stage.id;
            const badgeStyle = stageBadgeColors[stage.id] || stageBadgeColors.beginner;
            const BadgeIcon = badgeStyle.icon;

            return (
              <div
                key={stage.id}
                className="bg-white rounded-2xl border border-beige-200 p-5 flex flex-col justify-between shadow-xs space-y-4 hover:border-gold-400 transition-all"
              >
                <div className="space-y-3">
                  {/* Stage Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text}`}
                    >
                      {stage.badge}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-studio-700">
                      <BadgeIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-studio-500 mb-0.5">
                      {isTa ? 'நிலை தலைப்பு (Stage Title - Tamil)' : 'Stage Title'}
                    </label>
                    <input
                      type="text"
                      value={isTa ? (stage.title_ta ?? '') : stage.title}
                      onChange={(e) => handleUpdateStage(stage.id, isTa ? { title_ta: e.target.value } : { title: e.target.value })}
                      placeholder={isTa ? (stage.title || 'அடிப்படை & ஆரம்ப தையல் படிப்பு') : 'Stage Title'}
                      className="w-full font-serif font-bold text-sm sm:text-base text-studio-900 border-b border-beige-200 hover:border-gold-400 focus:border-gold-500 focus:outline-none bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-studio-500 mb-0.5">
                      {isTa ? 'விளக்கம் (Description - Tamil)' : 'Description / Overview'}
                    </label>
                    <textarea
                      rows={2}
                      value={isTa ? (stage.description_ta ?? '') : stage.description}
                      onChange={(e) => handleUpdateStage(stage.id, isTa ? { description_ta: e.target.value } : { description: e.target.value })}
                      placeholder={isTa ? (stage.description || 'பாடப்பிரிவு விளக்கம்...') : 'Description'}
                      className="w-full text-xs text-studio-700 p-2 rounded-xl border border-beige-200 focus:border-gold-400 focus:outline-none resize-none bg-cream-50/50"
                    />
                  </div>

                  {/* Current PDF Status Box */}
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      hasCustomPdf
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-gold-50/50 border-gold-200 text-gold-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        {hasCustomPdf ? 'Custom PDF Active' : 'Default Studio PDF Active'}
                      </span>
                      <span className="text-[10px] opacity-75 font-mono">
                        {stage.pdf_size || 'Official'}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono truncate text-studio-600">
                      {stage.pdf_name || `Tamil_Designer_Studio_${stage.id}_Course_Syllabus.pdf`}
                    </p>

                    {/* PDF Actions: Preview, Download, Remove */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setPreviewStage(stage)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-beige-300 hover:bg-beige-50 text-[11px] font-semibold text-studio-800 flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-gold-600" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadStagePdf(stage)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-beige-300 hover:bg-beige-50 text-[11px] font-semibold text-studio-800 flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Download className="w-3 h-3 text-gold-600" />
                        <span>Download</span>
                      </button>

                      {hasCustomPdf && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStagePdf(stage.id)}
                          className="px-2 py-1 rounded-lg hover:bg-rose-100 text-[11px] font-semibold text-rose-700 transition-colors ml-auto"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload & Link Controls */}
                <div className="pt-2 border-t border-beige-100 space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-700">
                    Upload New PDF (.pdf file):
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      disabled={isUploading}
                      onChange={(e) => handleStageFileUpload(stage.id, e)}
                      id={`pdf-upload-${stage.id}`}
                      className="hidden"
                    />
                    <label
                      htmlFor={`pdf-upload-${stage.id}`}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed text-xs font-semibold cursor-pointer transition-all ${
                        isUploading
                          ? 'bg-cream-100 text-studio-400 border-beige-300 cursor-not-allowed'
                          : 'bg-cream-50 hover:bg-gold-50 text-studio-800 hover:text-gold-900 border-gold-300 hover:border-gold-500 shadow-2xs'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                          <span>Uploading &amp; Saving PDF...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-gold-600" />
                          <span>Select &amp; Upload PDF</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Optional Direct PDF Link input */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-studio-400">
                      Or paste direct PDF URL (Google Drive, Cloud):
                    </span>
                    <input
                      type="url"
                      value={stage.pdf_url && stage.pdf_url.startsWith('http') ? stage.pdf_url : ''}
                      placeholder="https://drive.google.com/... or cloud URL"
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        handleUpdateStage(stage.id, {
                          pdf_url: val || undefined,
                          pdf_name: val ? `${stage.title}_Syllabus.pdf` : undefined,
                        });
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-beige-200 focus:border-gold-400 focus:outline-none bg-white text-studio-800"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2: MASTERCLASS COURSES LIST
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-beige-200 pb-3">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-gold-600" />
            <h2 className="text-lg font-serif font-bold text-studio-900">
              Masterclass Curriculum Variations ({courses.length})
            </h2>
          </div>
          <span className="text-xs text-studio-500">
            Blouse, Kurti, Pant, Maxi, Western, Ensembles &amp; Saree Prepleating
          </span>
        </div>

        <div className="space-y-6">
          {courses.map((course, cIdx) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl border transition-all p-6 space-y-4 shadow-sm ${
                course.is_active ? 'border-beige-200' : 'border-dashed border-studio-300 opacity-70 bg-cream-50/50'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-beige-100 pb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-gold-800 bg-gold-100 border border-gold-300 px-2.5 py-1 rounded-md">
                    #{cIdx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={isTa ? (course.title_ta ?? '') : course.title}
                    onChange={(e) => handleUpdateCourse(course.id, isTa ? { title_ta: e.target.value } : { title: e.target.value })}
                    className="font-serif font-bold text-studio-900 text-base sm:text-lg border-b border-transparent hover:border-beige-300 focus:border-gold-500 focus:outline-none bg-transparent flex-1 truncate"
                    placeholder={isTa ? (course.title || 'படிப்பு தலைப்பு') : 'Course Title'}
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateCourse(course.id, { is_active: !course.is_active })}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-studio-600"
                  >
                    {course.is_active ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">{isTa ? 'செயலில்' : 'Active'}</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-studio-400" />
                        <span className="text-studio-500 font-medium">{isTa ? 'மறைக்கப்பட்டது' : 'Hidden'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inputs: Level, Badge, Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                    {isTa ? 'நிலை (Level - Tamil)' : 'Level'}
                  </label>
                  {isTa ? (
                    <input
                      type="text"
                      value={course.level_ta ?? ''}
                      onChange={(e) => handleUpdateCourse(course.id, { level_ta: e.target.value })}
                      placeholder={course.level || 'மேம்பட்ட நிலை'}
                      className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white text-studio-800"
                    />
                  ) : (
                    <select
                      value={course.level}
                      onChange={(e) => handleUpdateCourse(course.id, { level: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white text-studio-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Specialized">Specialized</option>
                      <option value="Couture">Couture</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                    {isTa ? 'பேட்ஜ் (Badge - Tamil)' : 'Badge Tag'}
                  </label>
                  <input
                    type="text"
                    value={isTa ? (course.badge_ta ?? '') : (course.badge || '')}
                    onChange={(e) => handleUpdateCourse(course.id, isTa ? { badge_ta: e.target.value } : { badge: e.target.value })}
                    placeholder={isTa ? (course.badge || '18 வகைகள்') : 'e.g. 18 Variations'}
                    className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-studio-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                    Course Syllabus PDF (Optional)
                  </label>
                  <input
                    type="text"
                    value={course.pdf_url || ''}
                    onChange={(e) => handleUpdateCourse(course.id, { pdf_url: e.target.value, pdf_name: `${course.title}_Syllabus.pdf` })}
                    placeholder="Optional PDF link or cloud URL"
                    className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-studio-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                    {isTa ? 'பாடப்பிரிவு விளக்கம் (Description - Tamil)' : 'Course Description'}
                  </label>
                  <input
                    type="text"
                    value={isTa ? (course.description_ta ?? '') : course.description}
                    onChange={(e) => handleUpdateCourse(course.id, isTa ? { description_ta: e.target.value } : { description: e.target.value })}
                    placeholder={isTa ? (course.description || 'படிப்பு பற்றிய சுருக்கம்') : 'Summary of course scope and outcomes'}
                    className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-studio-800"
                  />
                </div>
              </div>

              {/* Topics / Syllabus */}
              <div className="space-y-2.5 pt-3 border-t border-beige-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600">
                    {isTa
                      ? `பாடத்திட்ட தலைப்புகள் (${(isTa && course.topics_ta ? course.topics_ta : course.topics).length}) - தமிழ்`
                      : `Curriculum Topics (${course.topics.length})`}
                  </label>
                  <span className="text-[10px] text-studio-400">
                    {isTa ? 'குறிப்பு: காற்புள்ளிகள் (comma) அல்லது Enter அழுத்தி பிரிக்கவும்' : 'Tip: Separate multiple topics with commas or press Enter'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-cream-50/70 border border-beige-200 rounded-xl">
                  {(isTa && course.topics_ta && course.topics_ta.length > 0 ? course.topics_ta : course.topics).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-white border border-beige-300 text-studio-800 text-xs px-2.5 py-1 rounded-lg shadow-2xs font-medium"
                    >
                      <span className="text-gold-700 font-mono text-[10px] font-bold">
                        {idx + 1}.
                      </span>
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(course.id, idx)}
                        className="text-studio-400 hover:text-red-500 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(isTa ? (course.topics_ta?.length === 0) : course.topics.length === 0) && (
                    <span className="text-xs text-studio-400 italic">No topics in syllabus yet.</span>
                  )}
                </div>

                {/* Add Topic Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={isTa ? 'தலைப்பை சேர்க்கவும் (எ.கா: சப்யசாச்சி பிளவுஸ்)...' : 'Add topic (e.g. Sabyasachi blouse) or paste comma-separated list...'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic(course.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleAddTopic(course.id, input.value);
                      input.value = '';
                    }}
                    className="text-xs bg-studio-900 hover:bg-studio-800 text-white px-4 py-2 rounded-xl font-semibold shadow-xs transition-colors shrink-0"
                  >
                    {isTa ? 'தலைப்பு சேர்' : 'Add Topic'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Preview Modal for Admin */}
      {previewStage && (
        <SyllabusPdfModal
          stage={previewStage}
          whatsappUrl="https://wa.me/917845264168"
          isDark={false}
          onClose={() => setPreviewStage(null)}
        />
      )}
    </div>
  );
};
