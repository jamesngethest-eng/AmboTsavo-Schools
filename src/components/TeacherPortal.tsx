import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Upload, 
  Edit3, 
  MessageSquare, 
  Send, 
  PlusCircle, 
  Check, 
  Save, 
  Calendar, 
  School, 
  Phone, 
  CheckCircle2,
  DollarSign,
  Share2,
  LogOut,
  AlertCircle,
  Clock,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Student, Teacher, Grade, Campus, HomeworkItem, ParentTeacherMessage, CompetencyRating, CommunityPost } from '../types';
import { createNewStudentRecord } from '../data/initialData';

interface TeacherPortalProps {
  teachers: Teacher[];
  activeTeacher: Teacher | null;
  onLoginTeacher: (teacher: Teacher) => void;
  onLogoutTeacher: () => void;
  students: Student[];
  onUpdateStudent: (updatedStudent: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onUploadHomework: (newHomework: Omit<HomeworkItem, 'id' | 'status' | 'parentSubmissionNote' | 'completedAt'>) => void;
  onSendTeacherMessage: (studentId: string, text: string) => void;
  onBroadcastCommunityPost: (post: Omit<CommunityPost, 'id' | 'reactions' | 'comments'>) => void;
  messages: ParentTeacherMessage[];
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teachers,
  activeTeacher,
  onLoginTeacher,
  onLogoutTeacher,
  students,
  onUpdateStudent,
  onAddStudent,
  onUploadHomework,
  onSendTeacherMessage,
  onBroadcastCommunityPost,
  messages,
}) => {
  // Login / Registration form state
  const [loginGrade, setLoginGrade] = useState<Grade>('PP1');
  const [loginCampus, setLoginCampus] = useState<Campus>('Kajiado Campus');
  const [teacherNameInput, setTeacherNameInput] = useState('');
  const [teacherWhatsAppInput, setTeacherWhatsAppInput] = useState('');
  const [teacherRoleInput, setTeacherRoleInput] = useState('Lead Educator');

  // Active portal tab
  const [activeTab, setActiveTab] = useState<'roster' | 'community-broadcast' | 'fees-manager' | 'upload-homework' | 'inbox'>('roster');

  // Filter students by status
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Joining'>('all');

  // Modal / drawer states
  const [selectedStudentForFees, setSelectedStudentForFees] = useState<Student | null>(null);
  const [feeCategory, setFeeCategory] = useState('CBC Workbooks & Exercise Materials');
  const [feeAmount, setFeeAmount] = useState<number>(1500);
  const [feeSuccessNotice, setFeeSuccessNotice] = useState<string | null>(null);

  // Student editing state (CBC scores & remarks)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [editingRemarks, setEditingRemarks] = useState('');
  const [editingScores, setEditingScores] = useState<{ [subjectId: string]: { rating: CompetencyRating; score: number; notes: string } }>({});
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Quick enroll student modal
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitChildName, setAdmitChildName] = useState('');
  const [admitAge, setAdmitAge] = useState(4);
  const [admitParentName, setAdmitParentName] = useState('');
  const [admitParentWhatsApp, setAdmitParentWhatsApp] = useState('');
  const [admitStatus, setAdmitStatus] = useState<'Active' | 'Joining'>('Active');

  // Community Broadcast state
  const [broadcastAudience, setBroadcastAudience] = useState<'grade' | 'all'>('grade');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<CommunityPost['category']>('Class Update');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Homework upload form
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Language Activities');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2026-10-18');
  const [uploadNotice, setUploadNotice] = useState(false);

  // Direct message text
  const [directMessageText, setDirectMessageText] = useState('');

  // Handle Teacher Login / Registration
  const handleTeacherLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherNameInput.trim() || !teacherWhatsAppInput.trim()) return;

    const cleanPhone = teacherWhatsAppInput.trim().replace(/\s+/g, '');
    const cleanName = teacherNameInput.trim();

    // Check if teacher already exists for this grade/phone
    const existing = teachers.find(
      (t) => t.gradeAssigned === loginGrade && (t.whatsappPhone.includes(cleanPhone) || t.name.toLowerCase() === cleanName.toLowerCase())
    );

    if (existing) {
      onLoginTeacher(existing);
    } else {
      const newTeacher: Teacher = {
        id: `tch-${Date.now()}`,
        name: cleanName,
        whatsappPhone: cleanPhone,
        role: `${loginGrade} ${teacherRoleInput}`,
        gradeAssigned: loginGrade,
        campus: loginCampus,
        assignedSubjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor Arts'],
        createdAt: new Date().toISOString(),
      };
      onLoginTeacher(newTeacher);
    }
  };

  // If no teacher is logged in, show the login / registration form
  if (!activeTeacher) {
    return (
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-emerald-900 px-6 py-8 text-white text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-800/80 rounded-2xl mx-auto flex items-center justify-center mb-4 text-amber-300 border border-emerald-700 shadow-md">
              <School className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-serif">Teacher Hub Login</h2>
            <p className="text-emerald-200 text-sm mt-1">
              Select your grade (Kindergarten, PP1, PP2) and sign in with your WhatsApp number
            </p>
          </div>

          <form onSubmit={handleTeacherLoginSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Assign Grade Level *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Kindergarten', 'PP1', 'PP2'] as Grade[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setLoginGrade(g)}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all text-center ${
                      loginGrade === g
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                You will be connected to the exact children &amp; parents for <strong>{loginGrade}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Teacher Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tr. Beatrice Naserian"
                value={teacherNameInput}
                onChange={(e) => setTeacherNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Teacher WhatsApp Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+254 7XX XXX XXX"
                  value={teacherWhatsAppInput}
                  onChange={(e) => setTeacherWhatsAppInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none pl-10"
                />
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enables 1-click WhatsApp messaging directly with parents.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                School Campus *
              </label>
              <select
                value={loginCampus}
                onChange={(e) => setLoginCampus(e.target.value as Campus)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                <option value="Kajiado Campus">Kajiado Campus (Town)</option>
                <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Role Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Educator &amp; Early Literacy Head"
                value={teacherRoleInput}
                onChange={(e) => setTeacherRoleInput(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <School className="w-5 h-5 text-amber-300" />
              <span>Enter {loginGrade} Classroom Hub</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter students for this teacher's assigned grade
  const gradeStudents = students.filter((s) => s.grade === activeTeacher.gradeAssigned);
  const enrolledCount = gradeStudents.filter((s) => s.status !== 'Joining').length;
  const joiningCount = gradeStudents.filter((s) => s.status === 'Joining').length;

  const filteredGradeStudents = gradeStudents.filter((s) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'Joining') return s.status === 'Joining';
    return s.status !== 'Joining';
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Quick WhatsApp link generator helper
  const openWhatsApp = (phone: string, text: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? '254' + clean.slice(1) : clean.startsWith('254') ? clean : '254' + clean;
    const url = `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Add fee to student
  const handleAddFeeToStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForFees || feeAmount <= 0) return;

    const targetStudent = selectedStudentForFees;
    const newItem = {
      id: `fee-${Date.now()}`,
      category: feeCategory.trim(),
      amount: Number(feeAmount),
      status: 'Pending' as const,
      addedBy: `${activeTeacher.name} (${activeTeacher.gradeAssigned} Teacher)`,
      addedAt: new Date().toISOString().split('T')[0],
    };

    const newTotal = targetStudent.fees.totalTermFee + Number(feeAmount);
    const newBalance = targetStudent.fees.balanceDue + Number(feeAmount);

    const updated: Student = {
      ...targetStudent,
      fees: {
        ...targetStudent.fees,
        totalTermFee: newTotal,
        balanceDue: newBalance,
        items: [...targetStudent.fees.items, newItem],
      },
    };

    onUpdateStudent(updated);
    setFeeSuccessNotice(`Successfully billed KES ${Number(feeAmount).toLocaleString()} (${feeCategory}) to ${targetStudent.name}!`);
    setTimeout(() => {
      setFeeSuccessNotice(null);
      setSelectedStudentForFees(null);
    }, 2500);
  };

  // Handle admit student by teacher
  const handleQuickAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitChildName.trim() || !admitParentWhatsApp.trim()) return;

    const newStudent = createNewStudentRecord({
      name: admitChildName.trim(),
      age: Number(admitAge) || 4,
      grade: activeTeacher.gradeAssigned,
      parentName: admitParentName.trim() || `Parent of ${admitChildName.trim()}`,
      parentWhatsApp: admitParentWhatsApp.trim(),
      campus: activeTeacher.campus,
      status: admitStatus,
    });

    onAddStudent(newStudent);
    setShowAdmitModal(false);
    setAdmitChildName('');
    setAdmitParentName('');
    setAdmitParentWhatsApp('');
  };

  // Broadcast community message
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    const audienceLabel = broadcastAudience === 'all' 
      ? 'All AmboTsavo Parents' 
      : activeTeacher.gradeAssigned;

    onBroadcastCommunityPost({
      title: broadcastTitle.trim(),
      content: broadcastContent.trim(),
      author: activeTeacher.name,
      authorRole: `${activeTeacher.gradeAssigned} Educator &middot; ${activeTeacher.campus}`,
      teacherGrade: activeTeacher.gradeAssigned,
      targetAudience: audienceLabel as any,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      campus: broadcastAudience === 'all' ? 'All Campuses' : activeTeacher.campus,
      category: broadcastCategory,
      imageUrl: '/src/assets/images/learning_classroom_art_1791538609308.jpg',
    });

    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastTitle('');
      setBroadcastContent('');
      setActiveTab('roster');
    }, 2000);
  };

  // Handle assignment upload
  const handleAssignmentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwDescription.trim()) return;

    onUploadHomework({
      title: hwTitle.trim(),
      subject: hwSubject,
      gradeLevel: activeTeacher.gradeAssigned,
      description: hwDescription.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: hwDueDate,
      teacherName: activeTeacher.name,
    });

    setUploadNotice(true);
    setTimeout(() => {
      setUploadNotice(false);
      setHwTitle('');
      setHwDescription('');
    }, 2500);
  };

  // Save student remark / grades
  const handleSaveStudentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updatedSubjects = selectedStudent.subjects.map((sub) => {
      const edit = editingScores[sub.id];
      if (edit) {
        return {
          ...sub,
          competencyRating: edit.rating,
          scorePercent: edit.score,
          teacherNotes: edit.notes,
        };
      }
      return sub;
    });

    const updated: Student = {
      ...selectedStudent,
      teacherRemarks: editingRemarks,
      subjects: updatedSubjects,
    };

    onUpdateStudent(updated);
    setSaveSuccessNotice(`Successfully saved CBC records for ${selectedStudent.name}!`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner with Teacher Credentials */}
      <div className="bg-emerald-900 text-white border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 font-bold text-xl shadow-inner">
                {activeTeacher.gradeAssigned}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif">{activeTeacher.name}</h1>
                  <span className="bg-amber-400 text-slate-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeTeacher.gradeAssigned} Teacher
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 mt-1">
                  <span>{activeTeacher.campus}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-mono text-emerald-100">
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    {activeTeacher.whatsappPhone}
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-300">{gradeStudents.length} Students in {activeTeacher.gradeAssigned}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAdmitModal(true)}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Admit Learner to {activeTeacher.gradeAssigned}</span>
              </button>
              <button
                onClick={onLogoutTeacher}
                className="px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold rounded-xl border border-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar inside Teacher Hub */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-emerald-800/60 mt-6 scrollbar-none">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{activeTeacher.gradeAssigned} Learners &amp; Parents ({gradeStudents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('community-broadcast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'community-broadcast'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Share2 className="w-4 h-4 text-amber-500" />
              <span>Send Community Broadcast</span>
            </button>

            <button
              onClick={() => setActiveTab('fees-manager')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'fees-manager'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Add / Bill School Fees</span>
            </button>

            <button
              onClick={() => setActiveTab('upload-homework')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'upload-homework'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>CBC Homework</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: ROSTER / LEARNERS & PARENTS */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            {/* Header with Joining & Enrolled filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  {activeTeacher.gradeAssigned} Classroom Register
                </h2>
                <p className="text-xs text-slate-500">
                  Manage admitted learners and incoming applicants for {activeTeacher.campus}.
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    statusFilter === 'all'
                      ? 'bg-emerald-900 text-white border-emerald-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All ({gradeStudents.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    statusFilter === 'Active'
                      ? 'bg-emerald-900 text-white border-emerald-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Enrolled ({enrolledCount})
                </button>
                <button
                  onClick={() => setStatusFilter('Joining')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    statusFilter === 'Joining'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Joining Soon ({joiningCount})
                </button>
              </div>
            </div>

            {/* If zero students in this grade */}
            {filteredGradeStudents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  No Students Registered in {activeTeacher.gradeAssigned} Yet
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  When parents register online or enroll at the school office, their children and WhatsApp contacts will automatically appear here. You can also immediately admit a child right now.
                </p>
                <button
                  onClick={() => setShowAdmitModal(true)}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span>Admit First Child to {activeTeacher.gradeAssigned}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students list */}
                <div className="lg:col-span-2 space-y-3">
                  {filteredGradeStudents.map((st) => (
                    <div
                      key={st.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{st.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            st.status === 'Joining' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {st.status === 'Joining' ? 'Joining Applicant' : 'Active Learner'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>Age: <strong>{st.age} yrs</strong></span>
                          <span>&bull;</span>
                          <span>Reg: <strong className="font-mono text-slate-700">{st.studentRegNo}</strong></span>
                          <span>&bull;</span>
                          <span>Fee Due: <strong className="text-rose-600">KES {st.fees.balanceDue.toLocaleString()}</strong></span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                          <span className="font-semibold text-slate-900">Parent: {st.parentName}</span>
                          <span className="text-slate-400">&bull;</span>
                          <span className="font-mono text-emerald-700 font-semibold">{st.parentWhatsApp}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                        {/* 1-Click WhatsApp Button */}
                        <button
                          onClick={() => {
                            const msg = `Hello ${st.parentName}, this is ${activeTeacher.name} (${activeTeacher.gradeAssigned} Class Educator at AmboTsavo Schools, ${activeTeacher.campus}). Reaching out regarding your learner ${st.name}.`;
                            openWhatsApp(st.parentWhatsApp, msg);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp Parent</span>
                        </button>

                        {/* Bill Fee Button */}
                        <button
                          onClick={() => setSelectedStudentForFees(st)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Add Fee Charge</span>
                        </button>

                        {/* Edit Record Button */}
                        <button
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            setEditingRemarks(st.teacherRemarks);
                            const scoresMap: typeof editingScores = {};
                            st.subjects.forEach((s) => {
                              scoresMap[s.id] = { rating: s.competencyRating, score: s.scorePercent, notes: s.teacherNotes };
                            });
                            setEditingScores(scoresMap);
                          }}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border transition-colors cursor-pointer ${
                            selectedStudentId === st.id
                              ? 'bg-emerald-900 text-white border-emerald-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>CBC Records</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Selected Student's Academic Record Editor */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs h-fit space-y-4">
                  {selectedStudent ? (
                    <form onSubmit={handleSaveStudentDetails} className="space-y-4">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          CBC Performance Assessment
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                        <p className="text-xs text-slate-500">
                          {selectedStudent.grade} &middot; {selectedStudent.studentRegNo}
                        </p>
                      </div>

                      {saveSuccessNotice && (
                        <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {saveSuccessNotice}
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700">Teacher Remarks</label>
                        <textarea
                          rows={3}
                          value={editingRemarks}
                          onChange={(e) => setEditingRemarks(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                          placeholder="Provide constructive feedback on child's CBC milestones..."
                        />
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        <label className="block text-xs font-bold text-slate-700">Competency Ratings</label>
                        {selectedStudent.subjects.map((sub) => {
                          const current = editingScores[sub.id] || {
                            rating: sub.competencyRating,
                            score: sub.scorePercent,
                            notes: sub.teacherNotes,
                          };
                          return (
                            <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                              <div className="font-bold text-slate-800">{sub.name}</div>
                              <select
                                value={current.rating}
                                onChange={(e) =>
                                  setEditingScores((prev) => ({
                                    ...prev,
                                    [sub.id]: {
                                      ...current,
                                      rating: e.target.value as CompetencyRating,
                                    },
                                  }))
                                }
                                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-medium"
                              >
                                <option value="Exceeding Expectations">Exceeding Expectations (EE)</option>
                                <option value="Meeting Expectations">Meeting Expectations (ME)</option>
                                <option value="Approaching Expectations">Approaching Expectations (AE)</option>
                                <option value="Below Expectations">Below Expectations (BE)</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>Save CBC Evaluation</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Edit3 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs">Select any learner from the list to update CBC ratings and remarks.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEND COMMUNITY MESSAGE / BROADCAST */}
        {activeTab === 'community-broadcast' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Community Announcements &amp; Broadcast
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Send Message to Parents
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                As <strong>{activeTeacher.name}</strong>, broadcast an update to all parents in AmboTsavo or specifically to your <strong>{activeTeacher.gradeAssigned}</strong> parents.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Message broadcasted successfully to AmboTsavo Community Board!
              </div>
            )}

            <form onSubmit={handleBroadcastSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Target Audience *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBroadcastAudience('grade')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      broadcastAudience === 'grade'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-800">Only {activeTeacher.gradeAssigned} Parents</div>
                    <div className="text-[11px] text-slate-500 font-normal">Targeted strictly to {activeTeacher.gradeAssigned}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBroadcastAudience('all')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      broadcastAudience === 'all'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-800">All AmboTsavo Parents</div>
                    <div className="text-[11px] text-slate-500 font-normal">School-wide (Kajiado &amp; Kimana)</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="Class Update">Classroom Update / Weekly Summary</option>
                  <option value="Notice">Official Notice</option>
                  <option value="CBC Showcase">CBC Learning Showcase</option>
                  <option value="Academics">Academics &amp; Homework</option>
                  <option value="Events">School Events &amp; Sports</option>
                  <option value="Fees Reminder">Fee Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Subject / Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${activeTeacher.gradeAssigned} Weekly Learning Highlights &amp; Next Week's Sensory Project`}
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Message Body *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your message for parents..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Publish to Community Board</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `*AmboTsavo Schools (${activeTeacher.gradeAssigned}) Announcement*\nFrom: ${activeTeacher.name}\n\n*${broadcastTitle}*\n\n${broadcastContent}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="Forward directly to WhatsApp Parent Group"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Forward via WhatsApp Group</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: FEES MANAGER / ADD SCHOOL FEES FOR CHILDREN */}
        {activeTab === 'fees-manager' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  {activeTeacher.gradeAssigned} School Fees Billing Zone
                </h2>
                <p className="text-xs text-slate-500">
                  Teachers can bill additional CBC learning kits, excursion trips, graduation items, or adjust fee statements for children in {activeTeacher.gradeAssigned}.
                </p>
              </div>
            </div>

            {feeSuccessNotice && (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {feeSuccessNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gradeStudents.map((st) => (
                <div key={st.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">{st.name}</h3>
                      <span className="font-mono text-[11px] text-slate-500">{st.studentRegNo}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Total Invoiced:</span>
                        <span className="font-semibold text-slate-900">KES {st.fees.totalTermFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700">
                        <span>Paid Amount:</span>
                        <span className="font-semibold">KES {st.fees.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1">
                        <span>Balance Due:</span>
                        <span>KES {st.fees.balanceDue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Parent: <strong>{st.parentName}</strong> ({st.parentWhatsApp})
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStudentForFees(st)}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>+ Add Fee Charge to {st.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CBC HOMEWORK UPLOADS */}
        {activeTab === 'upload-homework' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Curriculum &amp; Homework Tasks
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Upload Assignment for {activeTeacher.gradeAssigned}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Assign tasks for parents and learners to complete at home.
              </p>
            </div>

            {uploadNotice && (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Homework assigned successfully to all {activeTeacher.gradeAssigned} learners!
              </div>
            )}

            <form onSubmit={handleAssignmentUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject Area *</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="Language Activities">Language Activities (Literacy)</option>
                  <option value="Mathematical Activities">Mathematical Activities (Numeracy)</option>
                  <option value="Environmental Activities">Environmental Activities</option>
                  <option value="Psychomotor & Creative Arts">Psychomotor &amp; Creative Arts</option>
                  <option value="Religious Education">Religious Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Letter Sound Tracing &amp; Everyday Household Objects"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description &amp; Instructions *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Instructions for parent and child to follow..."
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Publish Assignment to {activeTeacher.gradeAssigned}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD FEE CHARGE TO STUDENT */}
      {selectedStudentForFees && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Add School Fee Charge</h3>
                <p className="text-xs text-slate-500">
                  Learner: <strong>{selectedStudentForFees.name}</strong> ({selectedStudentForFees.grade})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForFees(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddFeeToStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fee Item Category / Description</label>
                <input
                  type="text"
                  required
                  value={feeCategory}
                  onChange={(e) => setFeeCategory(e.target.value)}
                  placeholder="e.g. CBC Termly Workbook, School Trip, Uniform"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div>Current Total Fee: <strong>KES {selectedStudentForFees.fees.totalTermFee.toLocaleString()}</strong></div>
                <div>New Total Fee will be: <strong>KES {(selectedStudentForFees.fees.totalTermFee + Number(feeAmount)).toLocaleString()}</strong></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForFees(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 text-amber-300" />
                  <span>Confirm &amp; Add Fee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIT LEARNER TO GRADE */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Admit Learner to {activeTeacher.gradeAssigned}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeTeacher.campus}
                </p>
              </div>
              <button
                onClick={() => setShowAdmitModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleQuickAdmitSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Child's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ryan Kipchoge"
                  value={admitChildName}
                  onChange={(e) => setAdmitChildName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={admitAge}
                    onChange={(e) => setAdmitAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admission Status</label>
                  <select
                    value={admitStatus}
                    onChange={(e) => setAdmitStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Active">Active Enrolled</option>
                    <option value="Joining">Joining Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent's Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Kipchoge"
                  value={admitParentName}
                  onChange={(e) => setAdmitParentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent's WhatsApp Phone *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={admitParentWhatsApp}
                    onChange={(e) => setAdmitParentWhatsApp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold pl-10"
                  />
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Admit Learner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
