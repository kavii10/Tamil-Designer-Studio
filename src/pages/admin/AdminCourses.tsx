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
  ListPlus
} from 'lucide-react';
import { CourseItem } from '../../types';
import { db } from '../../services/db';

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
    if (!topicText.trim()) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, topics: [...c.topics, topicText.trim()] };
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

  const handleAddNewCourse = () => {
    const newCourse: CourseItem = {
      id: 'course-' + Date.now(),
      title: 'New Masterclass',
      level: 'Specialized',
      badge: 'Certificate',
      description: 'Hands-on practical training with individual machine access.',
      topics: ['Fundamental Techniques', 'Live Practice', 'Finishing & Pressing'],
      is_active: true,
      sort_order: courses.length + 1,
    };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to remove this course?')) {
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
    return <div className="text-center py-12 text-studio-500 text-xs">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-studio-900 tracking-tight">
            Academy Courses & Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-studio-500 mt-1">
            Manage fashion design courses, masterclasses, and syllabus highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
          <span>Courses updated successfully and published to the public card.</span>
        </div>
      )}

      {/* Courses Grid */}
      <div className="space-y-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-beige-200 shadow-premium p-6 space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-beige-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => handleUpdateCourse(course.id, { title: e.target.value })}
                  className="font-serif font-bold text-studio-900 text-lg sm:text-xl border-b border-transparent hover:border-beige-300 focus:border-gold-500 focus:outline-none bg-transparent"
                  placeholder="Course Title"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateCourse(course.id, { is_active: !course.is_active })}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-studio-600"
                >
                  {course.is_active ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-studio-400" />
                      <span className="text-studio-500">Hidden</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
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
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Specialized">Specialized</option>
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
                  placeholder="e.g. Signature Masterclass"
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
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
                  placeholder="Summary of course benefits and scope"
                  className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            {/* Topics / Syllabus */}
            <div className="space-y-2 pt-2 border-t border-beige-100">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-studio-600">
                Curriculum Topics (Checklist)
              </label>

              <div className="flex flex-wrap gap-2">
                {course.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-cream-50 border border-beige-200 text-studio-800 text-xs px-2.5 py-1 rounded-lg"
                  >
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
              </div>

              {/* Add Topic Input */}
              <div className="flex items-center gap-2 max-w-md pt-1">
                <input
                  type="text"
                  placeholder="Add new curriculum topic..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic(course.id, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-beige-300 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleAddTopic(course.id, input.value);
                    input.value = '';
                  }}
                  className="text-xs bg-beige-100 hover:bg-beige-200 text-studio-800 px-3 py-1.5 rounded-lg font-medium border border-beige-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
