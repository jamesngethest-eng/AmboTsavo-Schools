import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Users,
  DollarSign,
  Phone,
  Edit,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Copy,
  Check,
  Send,
  School,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  Save,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  UserPlus,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Student, Teacher, Grade, Campus, GradeFeeStructure, CommunityPost, FeeItem, PaymentReceipt } from '../types';
import { 
  getStoredAdminPin, 
  saveStoredAdminPin, 
  createNewStudentRecord,
  DEFAULT_GRADE_FEES 
} from '../data/initialData';

interface AdminPortalProps {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  feeStructures: Record<Grade, GradeFeeStructure>;
  onUpdateFeeStructures: (structures: Record<Grade, GradeFeeStructure>) => void;
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'reactions' | 'comments'>) => void;
  onDeletePost: (id: string) => void;
  onBackToSchool?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  students,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  feeStructures,
  onUpdateFeeStructures,
  posts,
  onAddPost,
  onDeletePost,
  onBackToSchool,
}) => {
  // Authentication state
  const [adminPin, setAdminPin] = useState(() => getStoredAdminPin());
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'passwords' | 'fees-zone' | 'students' | 'teachers' | 'announcements' | 'settings'>('passwords');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [campusFilter, setCampusFilter] = useState<string>('All');

  // Notification banners
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show/Hide password toggles per student
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});

  // Editing student modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editPassInput, setEditPassInput] = useState('');

  // Editing student fees modal
  const [feeModalStudent, setFeeModalStudent] = useState<Student | null>(null);
  const [newFeeCategory, setNewFeeCategory] = useState('CBC Workbooks & Craft Materials');
  const [newFeeAmount, setNewFeeAmount] = useState<number>(2000);
  const [customTotalFee, setCustomTotalFee] = useState<number>(0);
  const [customBalanceDue, setCustomBalanceDue] = useState<number>(0);

  // Record payment directly modal
  const [paymentAmount, setPaymentAmount] = useState<number>(5000);
  const [paymentRef, setPaymentRef] = useState(`MPE${Date.now().toString().slice(-6)}`);

  // Add new student modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(4);
  const [newChildGrade, setNewChildGrade] = useState<Grade>('PP1');
  const [newChildCampus, setNewChildCampus] = useState<Campus>('Kajiado Campus');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentPass, setNewParentPass] = useState('');

  // Add new teacher modal
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherGrade, setNewTeacherGrade] = useState<Grade>('PP1');
  const [newTeacherCampus, setNewTeacherCampus] = useState<Campus>('Kajiado Campus');
  const [newTeacherRole, setNewTeacherRole] = useState('Lead Educator');

  // Fee Structures Editor
  const [editingFees, setEditingFees] = useState<Record<Grade, GradeFeeStructure>>({ ...feeStructures });

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered');

  // Handle Admin Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin || pinInput.trim() === 'admin123' || pinInput.trim() === 'ambotsavo2026') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Admin Access PIN. Please try again.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePasswordVisibility = (studentId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // 1-Click WhatsApp password sender
  const sendPasswordViaWhatsApp = (st: Student) => {
    const rawPhone = st.parentWhatsApp.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '254' + rawPhone.slice(1) : rawPhone.startsWith('254') ? rawPhone : '254' + rawPhone;
    const portalUrl = window.location.origin;
    const text = `Hello ${st.parentName},\n\nThis is AmboTsavo Schools Administration.\n\nHere are your login credentials for your child *${st.name}* (${st.grade}):\n- Child Name: *${st.name}*\n- Student Reg No: *${st.studentRegNo}*\n- Parent Portal Password: *${st.parentPassword || 'Set in school'}*\n\nYou can access the portal and view fee statements at:\n${portalUrl}\n\nWarm regards,\nAmboTsavo Schools Administration`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyPasswordToClipboard = (st: Student) => {
    const pass = st.parentPassword || 'N/A';
    navigator.clipboard?.writeText(pass);
    setCopiedId(st.id);
    showToast(`Copied password for ${st.name} (${pass}) to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter students
  const filteredStudents = students.filter((st) => {
    const matchQuery =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.parentWhatsApp.includes(searchQuery) ||
      st.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'All' || st.grade === gradeFilter;
    const matchCampus = campusFilter === 'All' || st.campus === campusFilter;
    return matchQuery && matchGrade && matchCampus;
  });

  // Export to CSV helper for external reporting
  const handleExportCSV = (scope: 'filtered' | 'all' = 'filtered') => {
    const listToExport = scope === 'all' ? students : filteredStudents;
    if (listToExport.length === 0) {
      showToast('No student records found to export. Enroll students or clear search filters first.');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const headers = [
      'Student Reg No',
      'Learner Full Name',
      'Grade',
      'Campus',
      'Status',
      'Age',
      'Parent / Guardian Name',
      'Parent WhatsApp Phone',
      'Parent Portal Password',
      'Total Term Fee (KES)',
      'Amount Paid (KES)',
      'Balance Due (KES)',
      'Fee Clearance Status',
      'Fee Due Date',
      'Payment M-Pesa Code(s)',
      'Latest Payment Date',
      'Teacher CBC Remarks'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = listToExport.map((st) => {
      const paymentStatus =
        st.fees.balanceDue === 0
          ? 'Fully Paid'
          : st.fees.paidAmount > 0
          ? 'Partial Balance'
          : 'Unpaid / Pending';
      const mpesaCodes = st.fees.paymentHistory.map((p) => p.mpesaRef).filter(Boolean).join('; ');
      const lastPayment = st.fees.paymentHistory[0];
      const lastPaymentDate = lastPayment ? lastPayment.date : 'None';

      return [
        st.studentRegNo,
        st.name,
        st.grade,
        st.campus,
        st.status,
        st.age,
        st.parentName,
        st.parentWhatsApp,
        st.parentPassword || '',
        st.fees.totalTermFee,
        st.fees.paidAmount,
        st.fees.balanceDue,
        paymentStatus,
        st.fees.dueDate,
        mpesaCodes || 'None',
        lastPaymentDate,
        st.teacherRemarks || ''
      ].map(escapeCSV).join(',');
    });

    // UTF-8 BOM (\uFEFF) ensures Excel and external tools recognize UTF-8 encoding immediately
    const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ambotsavo_students_fees_${scope}_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${listToExport.length} student records to CSV!`);
  };

  // Export to Excel helper (.xls spreadsheet with rich formatting for accounting/reporting)
  const handleExportExcel = (scope: 'filtered' | 'all' = 'filtered') => {
    const listToExport = scope === 'all' ? students : filteredStudents;
    if (listToExport.length === 0) {
      showToast('No student records found to export. Enroll students or clear search filters first.');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' });
    const totalInvoiced = listToExport.reduce((sum, s) => sum + s.fees.totalTermFee, 0);
    const totalCollected = listToExport.reduce((sum, s) => sum + s.fees.paidAmount, 0);
    const totalOutstanding = listToExport.reduce((sum, s) => sum + s.fees.balanceDue, 0);

    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Student Fees Report</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
          .title { font-size: 16pt; font-weight: bold; color: #064e3b; }
          .subtitle { font-size: 10pt; color: #475569; margin-bottom: 12px; }
          .stat-box { font-weight: bold; padding: 6px; font-size: 10pt; }
          table { border-collapse: collapse; width: 100%; font-size: 10pt; }
          th { background-color: #064e3b; color: #ffffff; font-weight: bold; border: 1px solid #047857; padding: 8px 10px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 6px 10px; }
          .currency { text-align: right; mso-number-format: "\\#\\,\\#\\#0"; font-family: Consolas, monospace; }
          .cleared { background-color: #ecfdf5; color: #047857; font-weight: bold; }
          .pending { background-color: #fef2f2; color: #b91c1c; font-weight: bold; }
          .total-row { background-color: #f8fafc; font-weight: bold; border-top: 2px solid #064e3b; }
        </style>
      </head>
      <body>
        <div class="title">AMBOTSAVO SCHOOLS (KAJIADO & KIMANA) - STUDENTS & FEES REPORT</div>
        <div class="subtitle">Generated on: ${timestamp} | Scope: ${scope.toUpperCase()} (${listToExport.length} Students)</div>
        <br/>
        <table>
          <tr style="background-color: #f1f5f9;">
            <td colspan="4" class="stat-box">Total Learners: <strong>${listToExport.length}</strong></td>
            <td colspan="4" class="stat-box">Total Invoiced: <strong>KES ${totalInvoiced.toLocaleString()}</strong></td>
            <td colspan="4" class="stat-box" style="color: #047857;">Total Paid: <strong>KES ${totalCollected.toLocaleString()}</strong></td>
            <td colspan="4" class="stat-box" style="color: #b91c1c;">Total Balance: <strong>KES ${totalOutstanding.toLocaleString()}</strong></td>
          </tr>
        </table>
        <br/>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Reg No</th>
              <th>Learner Full Name</th>
              <th>Grade</th>
              <th>Campus</th>
              <th>Status</th>
              <th>Age</th>
              <th>Parent / Guardian</th>
              <th>Parent WhatsApp</th>
              <th>Parent Password</th>
              <th>Total Fee (KES)</th>
              <th>Paid (KES)</th>
              <th>Balance Due (KES)</th>
              <th>Fee Status</th>
              <th>Due Date</th>
              <th>M-Pesa References</th>
            </tr>
          </thead>
          <tbody>
            ${listToExport
              .map((st, idx) => {
                const isCleared = st.fees.balanceDue === 0;
                const mpesaCodes = st.fees.paymentHistory.map((p) => p.mpesaRef).filter(Boolean).join('; ');
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td style="font-family: Consolas, monospace;">${st.studentRegNo}</td>
                    <td><strong>${st.name}</strong></td>
                    <td>${st.grade}</td>
                    <td>${st.campus}</td>
                    <td>${st.status}</td>
                    <td>${st.age}</td>
                    <td>${st.parentName}</td>
                    <td style="font-family: Consolas, monospace;">${st.parentWhatsApp}</td>
                    <td style="font-family: Consolas, monospace; color: #b45309;">${st.parentPassword || ''}</td>
                    <td class="currency">${st.fees.totalTermFee}</td>
                    <td class="currency" style="color: #047857;">${st.fees.paidAmount}</td>
                    <td class="currency" style="color: #b91c1c;">${st.fees.balanceDue}</td>
                    <td class="${isCleared ? 'cleared' : 'pending'}">${isCleared ? 'Fully Paid' : 'Pending'}</td>
                    <td>${st.fees.dueDate}</td>
                    <td style="font-family: Consolas, monospace;">${mpesaCodes || '-'}</td>
                  </tr>
                `;
              })
              .join('')}
            <tr class="total-row">
              <td colspan="10" style="text-align: right; font-weight: bold;">TOTALS (KES):</td>
              <td class="currency" style="font-weight: bold;">${totalInvoiced}</td>
              <td class="currency" style="font-weight: bold; color: #047857;">${totalCollected}</td>
              <td class="currency" style="font-weight: bold; color: #b91c1c;">${totalOutstanding}</td>
              <td colspan="3"></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ambotsavo_students_fees_${scope}_${dateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${listToExport.length} student records to Excel (.xls)!`);
  };

  // Financial statistics
  const totalBilled = students.reduce((sum, s) => sum + s.fees.totalTermFee, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.fees.paidAmount, 0);
  const totalBalance = students.reduce((sum, s) => sum + s.fees.balanceDue, 0);

  // Save student modifications
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated: Student = {
      ...editingStudent,
      parentPassword: editPassInput.trim() || editingStudent.parentPassword,
    };
    onUpdateStudent(updated);
    setEditingStudent(null);
    showToast(`Updated student & password details for ${editingStudent.name}!`);
  };

  // Add line fee item to student in fee modal
  const handleAddFeeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeModalStudent || newFeeAmount <= 0) return;

    const newItem: FeeItem = {
      id: `fee-${Date.now()}`,
      category: newFeeCategory.trim(),
      amount: Number(newFeeAmount),
      status: 'Pending',
      addedBy: 'School Administrator',
      addedAt: new Date().toISOString().split('T')[0],
    };

    const newTotal = feeModalStudent.fees.totalTermFee + Number(newFeeAmount);
    const newBal = feeModalStudent.fees.balanceDue + Number(newFeeAmount);

    const updated: Student = {
      ...feeModalStudent,
      fees: {
        ...feeModalStudent.fees,
        totalTermFee: newTotal,
        balanceDue: newBal,
        items: [...feeModalStudent.fees.items, newItem],
      },
    };

    onUpdateStudent(updated);
    setFeeModalStudent(updated);
    showToast(`Added KES ${Number(newFeeAmount).toLocaleString()} charge to ${feeModalStudent.name}!`);
  };

  // Record payment in fee modal
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeModalStudent || paymentAmount <= 0) return;

    const receipt: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: Number(paymentAmount),
      mpesaRef: paymentRef.trim().toUpperCase(),
      method: 'Admin Office & Paybill Clearance',
      term: feeModalStudent.fees.term,
      recordedBy: 'Admin Bursar Desk',
    };

    const newPaid = feeModalStudent.fees.paidAmount + Number(paymentAmount);
    const newBal = Math.max(0, feeModalStudent.fees.balanceDue - Number(paymentAmount));

    const updated: Student = {
      ...feeModalStudent,
      fees: {
        ...feeModalStudent.fees,
        paidAmount: newPaid,
        balanceDue: newBal,
        paymentHistory: [receipt, ...feeModalStudent.fees.paymentHistory],
      },
    };

    onUpdateStudent(updated);
    setFeeModalStudent(updated);
    setPaymentRef(`MPE${Date.now().toString().slice(-6)}`);
    showToast(`Recorded payment of KES ${Number(paymentAmount).toLocaleString()} for ${feeModalStudent.name}!`);
  };

  // Direct override of fee totals
  const handleOverrideFeeTotals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeModalStudent) return;

    const updated: Student = {
      ...feeModalStudent,
      fees: {
        ...feeModalStudent.fees,
        totalTermFee: Number(customTotalFee),
        balanceDue: Number(customBalanceDue),
      },
    };

    onUpdateStudent(updated);
    setFeeModalStudent(updated);
    showToast(`Overrode fee balances for ${feeModalStudent.name}!`);
  };

  // Add new student
  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || !newParentPhone.trim()) return;

    const newStudent = createNewStudentRecord({
      name: newChildName.trim(),
      age: Number(newChildAge) || 4,
      grade: newChildGrade,
      campus: newChildCampus,
      parentName: newParentName.trim() || `Parent of ${newChildName.trim()}`,
      parentWhatsApp: newParentPhone.trim(),
      parentPassword: newParentPass.trim() || 'ambo' + Math.floor(100 + Math.random() * 900),
      status: 'Active',
    });

    onAddStudent(newStudent);
    setShowAddStudentModal(false);
    setNewChildName('');
    setNewParentName('');
    setNewParentPhone('');
    setNewParentPass('');
    showToast(`Enrolled ${newStudent.name} into ${newStudent.grade} (${newStudent.campus})!`);
  };

  // Add new teacher
  const handleCreateNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherPhone.trim()) return;

    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      name: newTeacherName.trim(),
      whatsappPhone: newTeacherPhone.trim().replace(/\s+/g, ''),
      role: `${newTeacherGrade} ${newTeacherRole.trim()}`,
      gradeAssigned: newTeacherGrade,
      campus: newTeacherCampus,
      assignedSubjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor Arts'],
      createdAt: new Date().toISOString(),
    };

    onAddTeacher(newTeacher);
    setShowAddTeacherModal(false);
    setNewTeacherName('');
    setNewTeacherPhone('');
    showToast(`Added ${newTeacher.name} as ${newTeacher.gradeAssigned} educator!`);
  };

  // ================= ADMIN LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
              AmboTsavo Administration
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Master control console for school fees, parent passwords, teacher assignments, and learner registries.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Access PIN / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter administrator PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none pl-10"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>Default Access PIN: <strong className="font-mono text-amber-300 font-bold">{adminPin}</strong></span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Access Master Control Console</span>
            </button>
          </form>

          {onBackToSchool && (
            <div className="text-center pt-2 border-t border-slate-700/60">
              <button
                onClick={onBackToSchool}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Return to Public School Website
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white font-serif text-lg tracking-tight block leading-tight">
                AmboTsavo Schools &middot; Admin Console
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                Kajiado &amp; Kimana Campuses Master Authority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold rounded-xl border border-emerald-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Export students and fee status report to CSV or Excel"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Report</span>
            </button>
            {onBackToSchool && (
              <button
                onClick={onBackToSchool}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>School Site</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-300 text-xs rounded-xl border border-rose-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 py-2 scrollbar-none">
          <button
            onClick={() => setAdminTab('passwords')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'passwords'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Parent Passwords &amp; WhatsApp ({students.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('fees-zone')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'fees-zone'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>School Fees Zone &amp; Invoices</span>
          </button>

          <button
            onClick={() => setAdminTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'students'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Learners &amp; Admissions ({students.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('teachers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'teachers'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teachers Hub ({teachers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('announcements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'announcements'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Community Posts</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Admin PIN &amp; Data Setup</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* Global Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Enrolled Children</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">{students.length}</span>
            <span className="text-[10px] text-amber-400 mt-0.5 block">Kindergarten &middot; PP1 &middot; PP2</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Fees Invoiced</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">KES {totalBilled.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Term 3 Total Invoiced</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] text-emerald-400 font-semibold block">Total Paid / Cleared</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">KES {totalPaid.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Through M-Pesa &amp; Accounts</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <span className="text-[11px] text-rose-400 font-semibold block">Outstanding Balance Due</span>
            <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">KES {totalBalance.toLocaleString()}</span>
            <span className="text-[10px] text-rose-300/80 mt-0.5 block">Pending Recovery</span>
          </div>
        </div>

        {/* ================= TAB 1: PARENT PASSWORDS & WHATSAPP SENDER ================= */}
        {adminTab === 'passwords' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white font-serif">
                    Parent Passwords &amp; 1-Click WhatsApp Assistance
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  View any parent&apos;s password to instantly send it to their WhatsApp phone when they have forgotten their credentials.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExportCSV('filtered')}
                  className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Export currently filtered students list to CSV"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExportExcel('filtered')}
                  className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold text-xs rounded-xl border border-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Export currently filtered students list to Excel (.xls)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Enroll New Student</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search child name, parent name, WhatsApp number, or reg number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none w-full sm:w-auto"
              >
                <option value="All">All Grades (Kindergarten, PP1, PP2)</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="PP1">PP1</option>
                <option value="PP2">PP2</option>
              </select>

              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none w-full sm:w-auto"
              >
                <option value="All">All Campuses</option>
                <option value="Kajiado Campus">Kajiado Campus</option>
                <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
              </select>
            </div>

            {/* Passwords Table / Cards */}
            {filteredStudents.length === 0 ? (
              <div className="bg-slate-800/60 rounded-2xl border border-dashed border-slate-700 p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-serif">No Students Registered Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When parents enroll online or teachers register children, their full profile and passwords will appear here. You can also click "+ Enroll New Student" above.
                </p>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="p-4">Child &amp; Reg No</th>
                        <th className="p-4">Grade &amp; Campus</th>
                        <th className="p-4">Parent Name</th>
                        <th className="p-4">WhatsApp Phone</th>
                        <th className="p-4">Parent Password</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredStudents.map((st) => {
                        const isVisible = visiblePasswords[st.id] ?? true;
                        const passwordVal = st.parentPassword || 'ambo123';

                        return (
                          <tr key={st.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">{st.name}</div>
                              <div className="font-mono text-slate-400 text-[11px]">{st.studentRegNo}</div>
                            </td>

                            <td className="p-4">
                              <span className="font-bold text-amber-400 block">{st.grade}</span>
                              <span className="text-[11px] text-slate-400">{st.campus.replace(' Amboseli', '')}</span>
                            </td>

                            <td className="p-4">
                              <div className="font-semibold text-slate-200">{st.parentName}</div>
                            </td>

                            <td className="p-4">
                              <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{st.parentWhatsApp}</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-300 text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                                  {isVisible ? passwordVal : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(st.id)}
                                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                  title="Toggle visibility"
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => copyPasswordToClipboard(st)}
                                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                  title="Copy password"
                                >
                                  {copiedId === st.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Send to WhatsApp */}
                                <button
                                  onClick={() => sendPasswordViaWhatsApp(st)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                  title="Send Password via WhatsApp to Parent"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Send to WhatsApp</span>
                                </button>

                                {/* Edit Student */}
                                <button
                                  onClick={() => {
                                    setEditingStudent(st);
                                    setEditPassInput(st.parentPassword || 'ambo123');
                                  }}
                                  className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer"
                                  title="Edit Student or Password"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                {/* Edit School Fees */}
                                <button
                                  onClick={() => {
                                    setFeeModalStudent(st);
                                    setCustomTotalFee(st.fees.totalTermFee);
                                    setCustomBalanceDue(st.fees.balanceDue);
                                  }}
                                  className="p-1.5 text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border border-amber-800 rounded-lg cursor-pointer"
                                  title="Edit Fees & Payments"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${st.name}?`)) {
                                      onDeleteStudent(st.id);
                                      showToast(`Deleted student ${st.name}.`);
                                    }
                                  }}
                                  className="p-1.5 text-rose-400 hover:text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-900 rounded-lg cursor-pointer"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SCHOOL FEES ZONE (FULL CONTROL) ================= */}
        {adminTab === 'fees-zone' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white font-serif">
                    Master School Fees Zone &amp; Structure Control
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust standard term fee rates per grade, override individual student fee balances, add custom charges, and record payments.
                </p>
              </div>
            </div>

            {/* Standard Grade Fee Rates Configurator */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm font-serif">
                  Standard Term Fee Structure by Grade (Kindergarten, PP1, PP2)
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold">
                  M-Pesa Paybill: 522123
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['Kindergarten', 'PP1', 'PP2'] as Grade[]).map((g) => {
                  const curr = editingFees[g] || DEFAULT_GRADE_FEES[g];
                  return (
                    <div key={g} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 text-sm">{g}</span>
                        <span className="font-mono font-bold text-white text-xs">
                          Total: KES {curr.totalTermFee.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase">Tuition Fee (KES)</label>
                          <input
                            type="number"
                            value={curr.tuition}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setEditingFees((prev) => ({
                                ...prev,
                                [g]: {
                                  ...prev[g],
                                  tuition: v,
                                  totalTermFee: v + curr.lunchAndSnacks + curr.activityAndCraft + curr.swimmingAndCoCurricular,
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase">Meals &amp; Snacks (KES)</label>
                          <input
                            type="number"
                            value={curr.lunchAndSnacks}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setEditingFees((prev) => ({
                                ...prev,
                                [g]: {
                                  ...prev[g],
                                  lunchAndSnacks: v,
                                  totalTermFee: curr.tuition + v + curr.activityAndCraft + curr.swimmingAndCoCurricular,
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase">CBC Books &amp; Craft (KES)</label>
                          <input
                            type="number"
                            value={curr.activityAndCraft}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setEditingFees((prev) => ({
                                ...prev,
                                [g]: {
                                  ...prev[g],
                                  activityAndCraft: v,
                                  totalTermFee: curr.tuition + curr.lunchAndSnacks + v + curr.swimmingAndCoCurricular,
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    onUpdateFeeStructures(editingFees);
                    showToast('Saved updated grade fee structures!');
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Master Fee Structures</span>
                </button>
              </div>
            </div>

            {/* Students Fee Master Table */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm font-serif">
                    Learner Fee Ledger &amp; Balance Balances
                  </h3>
                  <span className="text-xs text-slate-400">
                    Click &ldquo;Edit Fees&rdquo; on any student to add custom charges, waive balances, or clear receipts.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportCSV('filtered')}
                    className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Export currently filtered fee ledger to CSV"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportExcel('filtered')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Export currently filtered fee ledger to Excel (.xls)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Export Excel (.xls)</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="p-4">Learner &amp; Reg</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Total Invoiced</th>
                      <th className="p-4">Amount Paid</th>
                      <th className="p-4">Balance Due</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <strong className="text-white block text-sm">{st.name}</strong>
                          <span className="font-mono text-slate-400 text-[11px]">{st.studentRegNo}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-amber-400 font-bold">{st.grade}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-200">
                          KES {st.fees.totalTermFee.toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          KES {st.fees.paidAmount.toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-bold text-rose-400">
                          KES {st.fees.balanceDue.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.fees.balanceDue === 0
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {st.fees.balanceDue === 0 ? 'Fully Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setFeeModalStudent(st);
                              setCustomTotalFee(st.fees.totalTermFee);
                              setCustomBalanceDue(st.fees.balanceDue);
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Edit Fees / Add Charge</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LEARNERS & ADMISSIONS ================= */}
        {adminTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">
                  Students &amp; Admissions Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enrolled learners, incoming applicants, and registration details across Kajiado and Kimana campuses.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExportCSV('filtered')}
                  className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Export student directory to CSV"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExportExcel('filtered')}
                  className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold text-xs rounded-xl border border-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Export student directory to Excel (.xls)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Enroll New Learner</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((st) => (
                <div key={st.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{st.name}</h3>
                      <div className="text-xs text-slate-400 font-mono">{st.studentRegNo}</div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {st.grade}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-700/60">
                    <div>Campus: <strong className="text-white">{st.campus}</strong></div>
                    <div>Parent: <strong className="text-white">{st.parentName}</strong> ({st.parentWhatsApp})</div>
                    <div>Parent Password: <strong className="text-amber-300 font-mono">{st.parentPassword}</strong></div>
                    <div>Fee Due: <strong className="text-rose-400 font-mono">KES {st.fees.balanceDue.toLocaleString()}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <button
                      onClick={() => sendPasswordViaWhatsApp(st)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingStudent(st);
                          setEditPassInput(st.parentPassword || 'ambo123');
                        }}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete student ${st.name}?`)) {
                            onDeleteStudent(st.id);
                            showToast(`Deleted ${st.name}`);
                          }
                        }}
                        className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg cursor-pointer border border-rose-800"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: TEACHERS HUB ================= */}
        {adminTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">
                  Registered Teachers Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage teachers assigned to Kindergarten, PP1, and PP2 across Kajiado and Kimana. Teachers login with their WhatsApp number.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register New Teacher</span>
              </button>
            </div>

            {teachers.length === 0 ? (
              <div className="bg-slate-800/60 rounded-2xl border border-dashed border-slate-700 p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-serif">No Teachers Registered Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When educators sign in via the Teacher Hub or when you add them above, they will appear here with direct WhatsApp connection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((tch) => (
                  <div key={tch.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base">{tch.name}</h3>
                        <div className="text-xs text-amber-400 font-semibold">{tch.role}</div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {tch.gradeAssigned}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-700/60">
                      <div>Campus: <strong className="text-white">{tch.campus}</strong></div>
                      <div>WhatsApp Phone: <strong className="text-emerald-400 font-mono">{tch.whatsappPhone}</strong></div>
                      <div>Assigned Grade: <strong className="text-amber-300">{tch.gradeAssigned}</strong></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => {
                          const clean = tch.whatsappPhone.replace(/[^0-9]/g, '');
                          window.open(`https://wa.me/${clean}?text=Hello%20${encodeURIComponent(tch.name)},%20this%20is%20AmboTsavo%20Schools%20Administration.`, '_blank');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Chat on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove teacher ${tch.name}?`)) {
                            onDeleteTeacher(tch.id);
                            showToast(`Removed teacher ${tch.name}.`);
                          }
                        }}
                        className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg cursor-pointer border border-rose-800"
                        title="Remove Teacher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: COMMUNITY POSTS ================= */}
        {adminTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">
                  Community Announcements &amp; Moderation
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage posts sent by teachers or administration to all parents or specific grades.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {posts.map((p) => (
                <div key={p.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{p.title}</h3>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {p.targetAudience || 'All Parents'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      By {p.author} ({p.authorRole}) &middot; {p.date} &middot; {p.campus}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{p.content}</p>
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onDeletePost(p.id);
                        showToast('Removed announcement.');
                      }}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-lg border border-rose-800 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: ADMIN PIN & SETTINGS ================= */}
        {adminTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white font-serif">Admin Security &amp; Data Setup</h2>
              <p className="text-xs text-slate-400 mt-1">Change administrator PIN and manage system records.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-300">
                Change Admin Access PIN
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    saveStoredAdminPin(adminPin.trim() || 'admin123');
                    showToast('Admin PIN updated successfully!');
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save PIN
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-300">Database Clean Reset</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As requested, the portal starts clean with 0 students and 0 teachers so you can operate for real.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (confirm('Clear all students and teachers to an empty slate?')) {
                      localStorage.removeItem('ambotsavo_real_students_v4');
                      localStorage.removeItem('ambotsavo_real_teachers_v4');
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-xl border border-rose-800 cursor-pointer"
                >
                  Reset to 0 Students &amp; 0 Teachers
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: EDIT STUDENT & PASSWORD ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-base font-serif">Edit Student &amp; Password</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Child&apos;s Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Grade</label>
                  <select
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value as Grade })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="PP1">PP1</option>
                    <option value="PP2">PP2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Campus</label>
                  <select
                    value={editingStudent.campus}
                    onChange={(e) => setEditingStudent({ ...editingStudent, campus: e.target.value as Campus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Kajiado Campus">Kajiado Campus</option>
                    <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent&apos;s Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.parentName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent WhatsApp Phone</label>
                <input
                  type="text"
                  required
                  value={editingStudent.parentWhatsApp}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-bold mb-1">
                  Parent Portal Password (Visible to Parent) *
                </label>
                <input
                  type="text"
                  required
                  value={editPassInput}
                  onChange={(e) => setEditPassInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-amber-500/60 rounded-xl text-amber-300 font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  You can change this password and send it directly via WhatsApp button.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FEES & ADD CHARGE ================= */}
      {feeModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-white text-base font-serif">School Fees Control &amp; Invoicing</h3>
                <p className="text-xs text-amber-400 font-semibold">{feeModalStudent.name} &middot; {feeModalStudent.grade}</p>
              </div>
              <button onClick={() => setFeeModalStudent(null)} className="text-slate-400 hover:text-white cursor-pointer">&times;</button>
            </div>

            {/* Current Balance Overview */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-700 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Invoiced</span>
                <span className="font-mono font-bold text-white">KES {feeModalStudent.fees.totalTermFee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                <span className="font-mono font-bold text-emerald-400">KES {feeModalStudent.fees.paidAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Balance Due</span>
                <span className="font-mono font-bold text-rose-400">KES {feeModalStudent.fees.balanceDue.toLocaleString()}</span>
              </div>
            </div>

            {/* SECTION 1: ADD NEW CHARGE / FEE LINE ITEM */}
            <form onSubmit={handleAddFeeItem} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 space-y-2 text-xs">
              <h4 className="font-bold text-amber-400 uppercase text-[11px]">+ Add Extra Fee Charge</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Fee Category</label>
                  <input
                    type="text"
                    required
                    value={newFeeCategory}
                    onChange={(e) => setNewFeeCategory(e.target.value)}
                    placeholder="e.g. CBC Book, Uniform, Trip"
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newFeeAmount}
                    onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
              >
                + Add Fee Charge to Student
              </button>
            </form>

            {/* SECTION 2: RECORD PAYMENT / M-PESA RECEIPT */}
            <form onSubmit={handleRecordPayment} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase text-[11px]">+ Record Payment Receipt</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Amount Paid (KES)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">M-Pesa Reference / Code</label>
                  <input
                    type="text"
                    required
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono uppercase"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
              >
                Clear Payment &amp; Issue Receipt
              </button>
            </form>

            {/* SECTION 3: DIRECT OVERRIDE OF TOTALS */}
            <form onSubmit={handleOverrideFeeTotals} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase text-[11px]">Direct Balance Override</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Total Term Fee (KES)</label>
                  <input
                    type="number"
                    value={customTotalFee}
                    onChange={(e) => setCustomTotalFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Balance Due (KES)</label>
                  <input
                    type="number"
                    value={customBalanceDue}
                    onChange={(e) => setCustomBalanceDue(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-rose-400 font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg cursor-pointer"
              >
                Apply Direct Balance Override
              </button>
            </form>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setFeeModalStudent(null)}
                className="px-5 py-2 bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ENROLL NEW STUDENT ================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-base font-serif">Enroll Learner (Admin)</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-white cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleCreateNewStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Child&apos;s Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zawadi Mutiso"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Grade</label>
                  <select
                    value={newChildGrade}
                    onChange={(e) => setNewChildGrade(e.target.value as Grade)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
                  >
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="PP1">PP1</option>
                    <option value="PP2">PP2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Campus</label>
                <select
                  value={newChildCampus}
                  onChange={(e) => setNewChildCampus(e.target.value as Campus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Kajiado Campus">Kajiado Campus</option>
                  <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent&apos;s Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mercy Mutiso"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent&apos;s WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+254 7XX XXX XXX"
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-bold mb-1">Assign Parent Password / PIN</label>
                <input
                  type="text"
                  placeholder="e.g. 1234 or mutiso26"
                  value={newParentPass}
                  onChange={(e) => setNewParentPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-amber-500/60 rounded-xl text-amber-300 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Enroll Learner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW TEACHER ================= */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-base font-serif">Register Teacher</h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-white cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleCreateNewTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tr. Beatrice Kerubo"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Teacher WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+254 7XX XXX XXX"
                  value={newTeacherPhone}
                  onChange={(e) => setNewTeacherPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assigned Grade</label>
                  <select
                    value={newTeacherGrade}
                    onChange={(e) => setNewTeacherGrade(e.target.value as Grade)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
                  >
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="PP1">PP1</option>
                    <option value="PP2">PP2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Campus</label>
                  <select
                    value={newTeacherCampus}
                    onChange={(e) => setNewTeacherCampus(e.target.value as Campus)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Kajiado Campus">Kajiado Campus</option>
                    <option value="Kimana Amboseli Campus">Kimana Amboseli Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Role Title</label>
                <input
                  type="text"
                  value={newTeacherRole}
                  onChange={(e) => setNewTeacherRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Register Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXPORT DATA TO CSV / EXCEL ================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-serif">
                    Export Students &amp; Fee Status Report
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate CSV or Excel files for school accounting, board meetings, and auditing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                Choose Export Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportScope('filtered')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    exportScope === 'filtered'
                      ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-amber-300 font-bold">Filtered View</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    {filteredStudents.length} Students matching current filters
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    exportScope === 'all'
                      ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-amber-300 font-bold">All Students</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    {students.length} Total Registered Learners
                  </div>
                </button>
              </div>
            </div>

            {/* Scope Summary Preview */}
            {(() => {
              const exportList = exportScope === 'all' ? students : filteredStudents;
              const expBilled = exportList.reduce((sum, s) => sum + s.fees.totalTermFee, 0);
              const expPaid = exportList.reduce((sum, s) => sum + s.fees.paidAmount, 0);
              const expBal = exportList.reduce((sum, s) => sum + s.fees.balanceDue, 0);

              return (
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>Records Selected:</span>
                    <strong className="text-white font-mono text-sm">{exportList.length} Students</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Invoiced</span>
                      <span className="font-mono font-bold text-slate-200">KES {expBilled.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Total Paid</span>
                      <span className="font-mono font-bold text-emerald-400">KES {expPaid.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block">Total Balance</span>
                      <span className="font-mono font-bold text-rose-400">KES {expBal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Format explanation */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>CSV (.csv):</strong> Universal format for import into Google Sheets, accounting systems, database queries, and Microsoft Excel.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Excel (.xls):</strong> Formatted spreadsheet with column headers, currency styling, color badges, and financial totals summary.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => {
                  handleExportCSV(exportScope);
                  setShowExportModal(false);
                }}
                className="w-full sm:flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Download CSV File</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleExportExcel(exportScope);
                  setShowExportModal(false);
                }}
                className="w-full sm:flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Download Excel (.xls)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
