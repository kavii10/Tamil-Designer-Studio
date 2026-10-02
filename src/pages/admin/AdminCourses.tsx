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
} from 'lucide-react';
import { CourseItem } from '../../types';
import { db, DEFAULT_COURSES } from '../../services/db';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const data = await db.getCourses(false); // fetch all courses including inactive
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleUpdateCourse = (id: string, updates: Partial<CourseItem>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleAddTopic = (courseId: string, topicText: string) => {
    const trimmed = topicText.trim();
    if (!trimmed) return;

    // Handle comma or newline separated bulk input & auto-strip leading numbers like "1. "
    const newItems = trimmed
      .split(/[\n,]/)
      .map((t) => t.trim().replace(/^\d+[\.\)]\s*/, ''))
      .filter((t) => t.length > 0);

    if (newItems.length === 0) return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
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
      await db.saveCourses(courses);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Academy Courses &amp; Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Manage fashion design masterclasses, curriculum variations, and syllabus topics.
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
            <span>Load Official Syllabus (7 Courses)</span>
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
                <span>Save All Courses</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Courses and syllabus successfully saved! Live on your website.</span>
        </div>
      )}

      {/* Courses List */}
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
                  value={course.title}
                  onChange={(e) => handleUpdateCourse(course.id, { title: e.target.value })}
                  className="font-serif font-bold text-studio-900 text-base sm:text-lg border-b border-transparent hover:border-beige-300 focus:border-gold-500 focus:outline-none bg-transparent flex-1 truncate"
                  placeholder="Course Title"
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
                      <span className="text-emerald-700 font-semibold">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6 text-studio-400" />
                      <span className="text-studio-500 font-medium">Hidden</span>
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
                  Level
                </label>
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
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={course.badge || ''}
                  onChange={(e) => handleUpdateCourse(course.id, { badge: e.target.value })}
                  placeholder="e.g. 18 Variations"
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-studio-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600 mb-1">
                  Course Description
                </label>
                <input
                  type="text"
                  value={course.description}
                  onChange={(e) => handleUpdateCourse(course.id, { description: e.target.value })}
                  placeholder="Summary of course scope and outcomes"
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-studio-800"
                />
              </div>
            </div>

            {/* Topics / Syllabus */}
            <div className="space-y-2.5 pt-3 border-t border-beige-100">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600">
                  Curriculum Topics ({course.topics.length})
                </label>
                <span className="text-[10px] text-studio-400">
                  Tip: Separate multiple topics with commas or press Enter
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-cream-50/70 border border-beige-200 rounded-xl">
                {course.topics.map((t, idx) => (
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
                {course.topics.length === 0 && (
                  <span className="text-xs text-studio-400 italic">No topics in syllabus yet.</span>
                )}
              </div>

              {/* Add Topic Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add topic (e.g. Sabyasachi blouse) or paste comma-separated list..."
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
                  Add Topic
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
