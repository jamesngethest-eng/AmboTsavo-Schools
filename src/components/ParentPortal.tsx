import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  Award, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  KeyRound,
  UserPlus,
  HelpCircle,
  School
} from 'lucide-react';
import { Student, Grade, Campus, ParentTeacherMessage, PaymentReceipt, Teacher } from '../types';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { createNewStudentRecord } from '../data/initialData';

interface ParentPortalProps {
  students: Student[];
  teachers: Teacher[];
  currentStudent: Student | null;
  onLoginStudent: (student: Student) => void;
  onLogoutStudent: () => void;
  onToggleHomeworkStatus: (studentId: string, homeworkId: string, note?: string) => void;
  onSendParentMessage: (studentId: string, text: string) => void;
  messages: ParentTeacherMessage[];
  onFeePaymentSuccess: (studentId: string, receipt: PaymentReceipt) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  students,
  teachers,
  currentStudent,
  onLoginStudent,
  onLogoutStudent,
  onToggleHomeworkStatus,
  onSendParentMessage,
  messages,
  onFeePaymentSuccess,
}) => {
  // Login vs Enrollment mode
  const [authMode, setAuthMode] = useState<'login' | 'enroll'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Child name or Reg No
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Enrollment form state
  const [enrollChildName, setEnrollChildName] = useState('');
  const [enrollChildAge, setEnrollChildAge] = useState<number>(4);
  const [enrollGrade, setEnrollGrade] = useState<Grade>('PP1');
  const [enrollCampus, setEnrollCampus] = useState<Campus>('Kajiado Campus');
  const [enrollParentName, setEnrollParentName] = useState('');
  const [enrollParentWhatsApp, setEnrollParentWhatsApp] = useState('');
  const [enrollPassword, setEnrollPassword] = useState('');

  // Active portal tab
  const [activeTab, setActiveTab] = useState<'fees' | 'records' | 'homework' | 'messages' | 'attendance'>('fees');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  // Message Zone input
  const [newMessageText, setNewMessageText] = useState('');

  // Homework submission note modal
  const [selectedHomeworkForNote, setSelectedHomeworkForNote] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Find class teacher for this student's grade if registered
  const assignedTeacher = currentStudent
    ? teachers.find((t) => t.gradeAssigned === currentStudent.grade && t.campus === currentStudent.campus) ||
      teachers.find((t) => t.gradeAssigned === currentStudent.grade) ||
      null
    : null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanInput) {
      setLoginError('Please enter your child\'s name or registration number.');
      return;
    }

    // Match student by name or Reg No
    const found = students.find((s) => {
      const matchName = s.name.toLowerCase().includes(cleanInput) || cleanInput.includes(s.name.toLowerCase());
      const matchReg = s.studentRegNo.toLowerCase().replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '');
      const matchPhone = s.parentWhatsApp.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '');
      return matchName || matchReg || matchPhone;
    });

    if (found) {
      // If student has a password, verify it (or allow phone match)
      if (found.parentPassword && cleanPass && found.parentPassword !== cleanPass) {
        setLoginError('Incorrect password entered. Click "Forgot Password" to receive it on WhatsApp from the school admin.');
        return;
      }
      onLoginStudent(found);
    } else {
      setLoginError(
        'No matching student found. Please check spelling, or switch to the "Enroll Child for Term" tab to register.'
      );
    }
  };

  // Handle New Enrollment
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!enrollChildName.trim() || !enrollParentWhatsApp.trim()) {
      setLoginError('Please fill in child\'s name and your WhatsApp number.');
      return;
    }

    const newStudent = createNewStudentRecord({
      name: enrollChildName.trim(),
      age: Number(enrollChildAge) || 4,
      grade: enrollGrade,
      parentName: enrollParentName.trim() || `Parent of ${enrollChildName.trim()}`,
      parentWhatsApp: enrollParentWhatsApp.trim(),
      parentPassword: enrollPassword.trim() || 'ambo' + Math.floor(100 + Math.random() * 900),
      campus: enrollCampus,
      status: 'Joining', // Joining applicant as requested
    });

    onLoginStudent(newStudent);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentStudent) return;
    onSendParentMessage(currentStudent.id, newMessageText.trim());
    setNewMessageText('');
  };

  const studentMessages = currentStudent
    ? messages.filter((m) => m.studentId === currentStudent.id)
    : [];

  // ================= RENDER LOGIN FORM IF NOT LOGGED IN =================
  if (!currentStudent) {
    return (
      <div className="py-14 bg-slate-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-md">
              <School className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
              AmboTsavo Parent Portal
            </h1>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              Real-time fee statements, M-Pesa paybill receipts, CBC progress evaluation, and direct WhatsApp communication with teachers.
            </p>
          </div>

          {/* Toggle between Sign In and Enroll */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Parent Portal
            </button>
            <button
              onClick={() => {
                setAuthMode('enroll');
                setLoginError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                authMode === 'enroll'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enroll / Register Child
            </button>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span>{loginError}</span>
                {authMode === 'login' && (
                  <button
                    onClick={() => setShowForgotModal(true)}
                    className="block text-emerald-800 font-bold underline mt-1 cursor-pointer"
                  >
                    Forgot Password? Request from Admin on WhatsApp &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {authMode === 'login' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-serif pb-2 border-b border-slate-100">
                Sign In with Child Details
              </h2>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Child&apos;s Full Name or Student Reg No *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. Zawadi Mutiso or AMB/KJ/2026/084"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">
                      Parent Portal Password / PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your secret parent password"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Enter Parent Portal</span>
                  </button>
                </div>
              </form>

              <div className="text-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAuthMode('enroll')}
                  className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  New to AmboTsavo? Click here to enroll your child for this term &rarr;
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: ENROLL CHILD */}
          {authMode === 'enroll' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 font-serif">
                  Enroll Child for Term (Kindergarten, PP1, PP2)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Fill in your child&apos;s details to enroll and receive your automated student registration number and fee statement.
                </p>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Child&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollChildName}
                    onChange={(e) => setEnrollChildName(e.target.value)}
                    placeholder="e.g. Zawadi Mutiso"
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Child&apos;s Age (Years) *
                    </label>
                    <input
                      type="number"
                      required
                      min={2}
                      max={8}
                      value={enrollChildAge}
                      onChange={(e) => setEnrollChildAge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Grade to Join *
                    </label>
                    <select
                      value={enrollGrade}
                      onChange={(e) => setEnrollGrade(e.target.value as Grade)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 bg-white font-semibold"
                    >
                      <option value="Kindergarten">Kindergarten / Playgroup</option>
                      <option value="PP1">PP1 (Pre-Primary 1)</option>
                      <option value="PP2">PP2 (Pre-Primary 2)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Campus *
                  </label>
                  <select
                    value={enrollCampus}
                    onChange={(e) => setEnrollCampus(e.target.value as Campus)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 bg-white font-semibold"
                  >
                    <option value="Kajiado Campus">Kajiado Campus (Town)</option>
                    <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollParentName}
                    onChange={(e) => setEnrollParentName(e.target.value)}
                    placeholder="e.g. Mercy Mutiso"
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Parent&apos;s WhatsApp Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-emerald-700" />
                    <input
                      type="tel"
                      required
                      value={enrollParentWhatsApp}
                      onChange={(e) => setEnrollParentWhatsApp(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Set Secret Parent Password / PIN *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={enrollPassword}
                      onChange={(e) => setEnrollPassword(e.target.value)}
                      placeholder="e.g. 1234 or mutiso2026"
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Keep this safe to login. School admin can also look this up for you if you forget.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>Complete Enrollment &amp; Enter Portal</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD MODAL */}
          {showForgotModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    <span>Forgot Parent Password?</span>
                  </h3>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  The AmboTsavo School Administrator has direct access to all registered parent accounts and can verify your identity and immediately send your portal password straight to your WhatsApp.
                </p>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold">Contact School Admin:</div>
                  <div className="font-mono text-emerald-800">+254 721 340 112 (Admissions &amp; Records Desk)</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Hello AmboTsavo Admin, I am a parent and I forgot my login password for the parent portal. My child's name is: ${loginIdentifier || '[Child Name]'}. Kindly assist me with my login credentials.`;
                      window.open(`https://wa.me/254721340112?text=${encodeURIComponent(text)}`, '_blank');
                      setShowForgotModal(false);
                    }}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-200" />
                    <span>Request via WhatsApp Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ================= LOGGED IN PORTAL VIEW =================
  const pendingHomeworkCount = currentStudent.homework.filter((h) => h.status === 'Pending').length;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Child Profile Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xl font-serif shrink-0">
                {currentStudent.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-serif text-slate-900">
                    {currentStudent.name}
                  </h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                    {currentStudent.grade}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentStudent.status === 'Joining' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentStudent.status === 'Joining' ? 'Joining Applicant' : 'Active Learner'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Age: <strong className="text-slate-700">{currentStudent.age} Years</strong></span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Campus: <strong className="text-slate-700">{currentStudent.campus}</strong></span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Reg No: <strong className="font-mono text-slate-700">{currentStudent.studentRegNo}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {assignedTeacher ? (
                <a
                  href={`https://wa.me/${assignedTeacher.whatsappPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(assignedTeacher.name)},%20this%20is%20${encodeURIComponent(currentStudent.parentName)}%20(parent%20to%20${encodeURIComponent(currentStudent.name)}%20in%20${encodeURIComponent(currentStudent.grade)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Direct WhatsApp with Class Teacher"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Teacher ({assignedTeacher.name})</span>
                </a>
              ) : (
                <a
                  href={`https://wa.me/254721340112?text=Hello%20AmboTsavo%20Office,%20this%20is%20${encodeURIComponent(currentStudent.parentName)}%20(parent%20to%20${encodeURIComponent(currentStudent.name)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp School Office</span>
                </a>
              )}

              <button
                onClick={onLogoutStudent}
                className="px-3.5 py-2 text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Term Fees</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                KES {currentStudent.fees.totalTermFee.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Fee Balance Due</span>
              <span className={`font-bold font-mono text-sm ${currentStudent.fees.balanceDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {currentStudent.fees.balanceDue > 0 ? `KES ${currentStudent.fees.balanceDue.toLocaleString()}` : 'Cleared (KES 0)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Homework Pending</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {pendingHomeworkCount} {pendingHomeworkCount === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Your Login Password</span>
              <span className="font-mono font-bold text-slate-800 tracking-wider">
                {currentStudent.parentPassword || 'Set by School'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'fees'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>School Fees &amp; M-Pesa Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>CBC Progress Records</span>
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'homework'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Homework ({pendingHomeworkCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'border-emerald-800 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Inquiries</span>
          </button>
        </div>

        {/* TAB 1: SCHOOL FEES */}
        {activeTab === 'fees' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fees Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 font-serif text-base">
                      Term Fee Breakdown &amp; Items
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official fee structure for {currentStudent.grade} ({currentStudent.fees.term})
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-300" />
                    <span>Pay via M-Pesa</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentStudent.fees.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block">{item.category}</span>
                        {item.addedBy && (
                          <span className="text-[10px] text-slate-500">Added by: {item.addedBy}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">
                          KES {item.amount.toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 font-serif text-base pb-3 border-b border-slate-100 mb-4">
                  Official M-Pesa Payment Receipts
                </h3>

                {currentStudent.fees.paymentHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No payment receipts yet. When you pay via M-Pesa Paybill 522123, your receipt will appear here.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentStudent.fees.paymentHistory.map((receipt) => (
                      <div
                        key={receipt.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{receipt.mpesaRef}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                              Confirmed
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{receipt.date} &middot; {receipt.method}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold font-mono text-emerald-700">
                            +KES {receipt.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paybill Instructions Card */}
            <div className="space-y-6">
              <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-sm border border-emerald-900 space-y-4">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>M-Pesa Paybill Payment</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 flex justify-between items-center">
                    <span className="text-emerald-200">Business No (Paybill):</span>
                    <span className="font-mono font-bold text-base text-amber-300">522123</span>
                  </div>

                  <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 flex justify-between items-center">
                    <span className="text-emerald-200">Account No:</span>
                    <span className="font-mono font-bold text-emerald-100">{currentStudent.studentRegNo}</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Enter student registration number as account number. Receipts are automatically validated and recorded onto your child&apos;s ledger.
                </p>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Make Online M-Pesa Payment Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CBC RECORDS */}
        {activeTab === 'records' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 font-serif text-lg">
                CBC Assessment &amp; Core Competency Profile
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kenya Competency Based Curriculum (CBC) evaluation for {currentStudent.grade}.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-emerald-800">Class Educator Remarks</span>
              <p className="leading-relaxed italic">&ldquo;{currentStudent.teacherRemarks}&rdquo;</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStudent.subjects.map((sub) => (
                <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{sub.name}</strong>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      {sub.competencyRating}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{sub.teacherNotes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 font-serif text-lg">
                Assigned Homework &amp; Home Practice
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tasks assigned by your child&apos;s educator for {currentStudent.grade}.
              </p>
            </div>

            {currentStudent.homework.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No homework assigned at this time. Check back later or message your educator!
              </div>
            ) : (
              <div className="space-y-4">
                {currentStudent.homework.map((hw) => (
                  <div key={hw.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          {hw.subject}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full self-start ${
                        hw.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hw.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{hw.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                      <span>Due: <strong>{hw.dueDate}</strong></span>
                      <button
                        onClick={() => onToggleHomeworkStatus(currentStudent.id, hw.id)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 rounded-lg text-xs cursor-pointer"
                      >
                        {hw.status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIRECT INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 font-serif text-lg">
                Direct Inquiries &amp; Messages
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Communicate directly with your educator or school administration.
              </p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
              {studentMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No messages yet. Send a message below or use the direct WhatsApp link.
                </div>
              ) : (
                studentMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl max-w-[85%] text-xs ${
                      m.sender === 'parent'
                        ? 'ml-auto bg-emerald-800 text-white'
                        : 'mr-auto bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-[10px] opacity-75 mb-1">{m.sender === 'parent' ? 'You' : m.teacherName} &middot; {m.timestamp}</div>
                    <p>{m.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your inquiry for the teacher..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && currentStudent && (
        <PaymentModal
          student={currentStudent}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={(receipt: PaymentReceipt) => onFeePaymentSuccess(currentStudent.id, receipt)}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && currentStudent && (
        <ReceiptModal
          receipt={selectedReceipt}
          student={currentStudent}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
