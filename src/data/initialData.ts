import { Student, Teacher, CommunityPost, ParentTeacherMessage, Grade, Campus, GradeFeeStructure } from '../types';

// The portal starts completely empty for real live school operations as requested:
export const INITIAL_TEACHERS: Teacher[] = [];
export const INITIAL_STUDENTS: Student[] = [];

export const DEFAULT_GRADE_FEES: Record<Grade, GradeFeeStructure> = {
  Kindergarten: {
    grade: 'Kindergarten',
    tuition: 14000,
    lunchAndSnacks: 5000,
    activityAndCraft: 2500,
    swimmingAndCoCurricular: 2500,
    totalTermFee: 24000,
  },
  PP1: {
    grade: 'PP1',
    tuition: 16000,
    lunchAndSnacks: 6000,
    activityAndCraft: 3500,
    swimmingAndCoCurricular: 3000,
    totalTermFee: 28500,
  },
  PP2: {
    grade: 'PP2',
    tuition: 17500,
    lunchAndSnacks: 6500,
    activityAndCraft: 4000,
    swimmingAndCoCurricular: 3000,
    totalTermFee: 31000,
  },
};

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    title: 'Welcome to Term 3 at AmboTsavo Schools (Kajiado & Kimana)',
    author: 'AmboTsavo Administration',
    authorRole: 'Head of School & Directorship',
    targetAudience: 'All AmboTsavo Parents',
    date: 'October 2, 2026',
    campus: 'All Campuses',
    category: 'Notice',
    content: 'We warmly welcome all parents and incoming learners for Kindergarten, PP1, and PP2 across our Kajiado Town and Kimana Amboseli campuses. Teachers are accessible via WhatsApp and our interactive portal. Please ensure all learner records and fee reconciliations are updated.',
    imageUrl: '/src/assets/images/hero_ambotzavo_school_1791538583417.jpg',
    reactions: {
      like: 12,
      love: 9,
      clap: 8,
      celebrate: 5,
      star: 7,
      fire: 4,
    },
    comments: [],
  },
  {
    id: 'post-02',
    title: 'Official School Fees Payment Channels & M-Pesa Paybill',
    author: 'Finance & Bursar Office',
    authorRole: 'AmboTsavo Accounts Office',
    targetAudience: 'All AmboTsavo Parents',
    date: 'October 4, 2026',
    campus: 'All Campuses',
    category: 'Fees Reminder',
    content: 'Dear Parents, all school fee payments are to be made securely via M-Pesa Paybill Number: 522123. Use your student registration number or child name as Account Number. Instant official receipts are generated and available in the Parent Portal.',
    reactions: {
      like: 15,
      love: 6,
      clap: 10,
      celebrate: 3,
      star: 4,
      fire: 2,
    },
    comments: [],
  },
];

export const INITIAL_MESSAGES: ParentTeacherMessage[] = [];

// Storage Keys
const STORAGE_KEYS = {
  STUDENTS: 'ambotsavo_real_students_v4',
  TEACHERS: 'ambotsavo_real_teachers_v4',
  POSTS: 'ambotsavo_real_posts_v4',
  MESSAGES: 'ambotsavo_real_messages_v4',
  FEE_STRUCTURE: 'ambotsavo_fee_structures_v4',
  ADMIN_PIN: 'ambotsavo_admin_pin_v4',
  CURRENT_TEACHER: 'ambotsavo_active_teacher_v4',
};

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function getStoredTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEACHERS;
  }
}

export function saveStoredTeachers(teachers: Teacher[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (e) {
    console.error('Failed to save teachers to localStorage', e);
  }
}

export function getStoredFeeStructures(): Record<Grade, GradeFeeStructure> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURE, JSON.stringify(DEFAULT_GRADE_FEES));
      return DEFAULT_GRADE_FEES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_GRADE_FEES;
  }
}

export function saveStoredFeeStructures(structures: Record<Grade, GradeFeeStructure>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURE, JSON.stringify(structures));
  } catch (e) {
    console.error('Failed to save fee structures', e);
  }
}

export function getStoredPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMUNITY_POSTS;
  }
}

export function saveStoredPosts(posts: CommunityPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to localStorage', e);
  }
}

export function getStoredMessages(): ParentTeacherMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function saveStoredMessages(messages: ParentTeacherMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages to localStorage', e);
  }
}

export function getStoredAdminPin(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    return raw || 'admin123';
  } catch {
    return 'admin123';
  }
}

export function saveStoredAdminPin(pin: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
  } catch (e) {
    console.error('Failed to save admin PIN', e);
  }
}

export function getActiveTeacher(): Teacher | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_TEACHER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveTeacher(teacher: Teacher | null): void {
  try {
    if (teacher) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TEACHER, JSON.stringify(teacher));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_TEACHER);
    }
  } catch (e) {
    console.error('Failed to save active teacher', e);
  }
}

// Helper to create a student with default grade fees
export function createNewStudentRecord(params: {
  name: string;
  age: number;
  grade: Grade;
  parentName: string;
  parentWhatsApp: string;
  parentPassword?: string;
  campus: Campus;
  status?: 'Active' | 'Joining' | 'Admitted';
  customFee?: number;
}): Student {
  const feeStructures = getStoredFeeStructures();
  const gradeFees = feeStructures[params.grade] || DEFAULT_GRADE_FEES[params.grade];
  const totalFee = params.customFee !== undefined ? params.customFee : gradeFees.totalTermFee;
  
  const campusCode = params.campus === 'Kimana Amboseli Campus' ? 'KMN' : 'KJD';
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const regNo = `AMB/${campusCode}/${new Date().getFullYear()}/${randomSuffix}`;

  return {
    id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: params.name.trim(),
    age: params.age,
    grade: params.grade,
    parentName: params.parentName.trim(),
    parentWhatsApp: params.parentWhatsApp.trim().replace(/\s+/g, ''),
    parentPassword: params.parentPassword?.trim() || 'ambo' + randomSuffix,
    campus: params.campus,
    studentRegNo: regNo,
    dateOfBirth: `${new Date().getFullYear() - params.age}-01-15`,
    emergencyContact: `${params.parentWhatsApp.trim()} (${params.parentName.trim()})`,
    status: params.status || 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    classTeacher: {
      name: `${params.grade} Class Educator`,
      role: `${params.grade} Lead Teacher`,
      phone: '+254 721 340 112',
      email: `${params.grade.toLowerCase()}@ambotsavoschools.ac.ke`,
    },
    fees: {
      totalTermFee: totalFee,
      paidAmount: 0,
      balanceDue: totalFee,
      dueDate: `${new Date().getFullYear()}-11-15`,
      term: 'Term 3 2026',
      paybill: '522123',
      accountNumber: regNo,
      items: [
        { category: 'Tuition & CBC Instruction', amount: gradeFees.tuition, status: 'Pending' },
        { category: 'Mid-Morning Snack & Nutritious Hot Lunch', amount: gradeFees.lunchAndSnacks, status: 'Pending' },
        { category: 'CBC Workbooks & Sensory Craft Materials', amount: gradeFees.activityAndCraft, status: 'Pending' },
        { category: 'Swimming & Co-curricular Coaching', amount: gradeFees.swimmingAndCoCurricular, status: 'Pending' },
      ],
      paymentHistory: [],
    },
    subjects: [
      {
        id: 'sub-01',
        name: 'Language Activities',
        category: 'Literacy',
        competencyRating: 'Meeting Expectations',
        scorePercent: 78,
        teacherNotes: 'Enthusiastic participant in storytelling and vocabulary exercises.',
      },
      {
        id: 'sub-02',
        name: 'Mathematical Activities',
        category: 'Numeracy',
        competencyRating: 'Meeting Expectations',
        scorePercent: 82,
        teacherNotes: 'Demonstrates great recognition of numbers and shapes.',
      },
      {
        id: 'sub-03',
        name: 'Environmental Activities',
        category: 'Science & Discovery',
        competencyRating: 'Exceeding Expectations',
        scorePercent: 88,
        teacherNotes: 'Curious about flora and fauna, nature walk observations.',
      },
      {
        id: 'sub-04',
        name: 'Psychomotor & Creative Arts',
        category: 'Creative Arts',
        competencyRating: 'Exceeding Expectations',
        scorePercent: 90,
        teacherNotes: 'Excellent fine motor dexterity in clay modeling and coloring.',
      },
      {
        id: 'sub-05',
        name: 'Religious Education (CRE / IRE)',
        category: 'Values & Ethics',
        competencyRating: 'Meeting Expectations',
        scorePercent: 80,
        teacherNotes: 'Exhibits kindness, sharing, and respectful interaction.',
      },
    ],
    homework: [],
    attendance: {
      presentDays: 32,
      totalDays: 34,
      lateDays: 2,
      ratePercent: 94,
      recentLogs: [
        { date: '2026-10-08', status: 'Present' },
        { date: '2026-10-07', status: 'Present' },
        { date: '2026-10-06', status: 'Present' },
        { date: '2026-10-05', status: 'Present' },
      ],
    },
    teacherRemarks: 'Active, joyful learner showing remarkable growth in CBC competencies.',
    lastTermOverallGrade: 'ME (Meeting Expectations)',
  };
}
