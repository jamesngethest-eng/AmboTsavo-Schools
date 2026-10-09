export type Grade = 'Kindergarten' | 'PP1' | 'PP2';

export type Campus = 'Kajiado Campus' | 'Kimana Amboseli Campus';

export type CompetencyRating = 'Exceeding Expectations' | 'Meeting Expectations' | 'Approaching Expectations' | 'Below Expectations';

export interface FeeItem {
  id?: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Pending';
  addedBy?: string;
  addedAt?: string;
}

export interface PaymentReceipt {
  id: string;
  date: string;
  amount: number;
  mpesaRef: string;
  method: string;
  term: string;
  recordedBy?: string;
}

export interface StudentFees {
  totalTermFee: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  term: string;
  paybill: string;
  accountNumber: string;
  items: FeeItem[];
  paymentHistory: PaymentReceipt[];
}

export interface SubjectRecord {
  id: string;
  name: string;
  category: string;
  competencyRating: CompetencyRating;
  scorePercent: number;
  teacherNotes: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  gradeLevel: Grade;
  teacherName: string;
  parentSubmissionNote?: string;
  completedAt?: string;
}

export interface AttendanceRecord {
  presentDays: number;
  totalDays: number;
  lateDays: number;
  ratePercent: number;
  recentLogs: Array<{
    date: string;
    status: 'Present' | 'Late' | 'Excused';
  }>;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: Grade;
  parentName: string;
  parentWhatsApp: string;
  parentPassword?: string; // Accessible by Admin to send via WhatsApp if forgotten
  campus: Campus;
  studentRegNo: string;
  dateOfBirth: string;
  emergencyContact: string;
  status: 'Active' | 'Joining' | 'Admitted';
  admissionDate?: string;
  classTeacher: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  fees: StudentFees;
  subjects: SubjectRecord[];
  homework: HomeworkItem[];
  attendance: AttendanceRecord;
  teacherRemarks: string;
  lastTermOverallGrade: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  role: 'Parent' | 'Teacher' | 'Alumni' | 'Community' | 'Admin';
  text: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  teacherGrade?: Grade;
  targetAudience?: 'All AmboTsavo Parents' | 'Kindergarten' | 'PP1' | 'PP2';
  date: string;
  campus: Campus | 'All Campuses';
  category: 'Academics' | 'Events' | 'Sports' | 'Notice' | 'CBC Showcase' | 'Fees Reminder' | 'Class Update';
  content: string;
  imageUrl?: string;
  reactions: {
    like: number;
    love: number;
    clap: number;
    celebrate: number;
    star: number;
    fire: number;
  };
  userReacted?: string[];
  comments: CommunityComment[];
}

export interface ParentTeacherMessage {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentWhatsApp: string;
  teacherId: string;
  teacherName: string;
  text: string;
  timestamp: string;
  sender: 'parent' | 'teacher';
  read: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  whatsappPhone: string; // Used for WhatsApp chat & fast login
  email?: string;
  phone?: string;
  role: string;
  gradeAssigned: Grade; // 'Kindergarten' | 'PP1' | 'PP2'
  campus: Campus;
  assignedSubjects: string[];
  createdAt?: string;
}

export interface GradeFeeStructure {
  grade: Grade;
  tuition: number;
  lunchAndSnacks: number;
  activityAndCraft: number;
  swimmingAndCoCurricular: number;
  totalTermFee: number;
}
