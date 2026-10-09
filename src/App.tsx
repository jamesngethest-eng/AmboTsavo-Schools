import React, { useState, useEffect } from 'react';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  getStoredTeachers, 
  saveStoredTeachers, 
  getStoredPosts, 
  saveStoredPosts, 
  getStoredMessages, 
  saveStoredMessages,
  getStoredFeeStructures,
  saveStoredFeeStructures,
  getActiveTeacher,
  saveActiveTeacher,
  createNewStudentRecord
} from './data/initialData';
import { 
  Student, 
  Teacher, 
  CommunityPost, 
  ParentTeacherMessage, 
  HomeworkItem, 
  PaymentReceipt, 
  Grade, 
  Campus,
  GradeFeeStructure 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CampusesSection } from './components/CampusesSection';
import { CurriculumSection } from './components/CurriculumSection';
import { CommunityPage } from './components/CommunityPage';
import { ParentPortal } from './components/ParentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  // Check if initial URL is admin
  const isDirectAdminUrl = typeof window !== 'undefined' && (
    window.location.pathname.includes('admin') || 
    window.location.hash.includes('admin')
  );

  const [currentTab, setCurrentTab] = useState<'home' | 'campuses' | 'community' | 'parent-portal' | 'teacher-portal' | 'admin'>(
    isDirectAdminUrl ? 'admin' : 'home'
  );
  
  // Clean states - starts with 0 students and 0 teachers for real operations
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStoredTeachers());
  const [posts, setPosts] = useState<CommunityPost[]>(() => getStoredPosts());
  const [messages, setMessages] = useState<ParentTeacherMessage[]>(() => getStoredMessages());
  const [feeStructures, setFeeStructures] = useState<Record<Grade, GradeFeeStructure>>(() => getStoredFeeStructures());
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(() => getActiveTeacher());

  // Logged-in parent/student
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(() => {
    try {
      const stored = localStorage.getItem('ambotsavo_current_student_v4');
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = getStoredStudents().find((s) => s.id === parsed.id);
        return found || parsed;
      }
    } catch {}
    return null;
  });

  // Sync state to localStorage
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  useEffect(() => {
    saveStoredTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    saveStoredPosts(posts);
  }, [posts]);

  useEffect(() => {
    saveStoredMessages(messages);
  }, [messages]);

  useEffect(() => {
    saveStoredFeeStructures(feeStructures);
  }, [feeStructures]);

  useEffect(() => {
    saveActiveTeacher(activeTeacher);
  }, [activeTeacher]);

  useEffect(() => {
    if (loggedInStudent) {
      localStorage.setItem('ambotsavo_current_student_v4', JSON.stringify(loggedInStudent));
    } else {
      localStorage.removeItem('ambotsavo_current_student_v4');
    }
  }, [loggedInStudent]);

  // Handle Parent Login
  const handleLoginStudent = (student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (!exists) {
        return [student, ...prev];
      }
      return prev.map((s) => (s.id === student.id ? student : s));
    });
    setLoggedInStudent(student);
    setCurrentTab('parent-portal');
  };

  const handleLogoutStudent = () => {
    setLoggedInStudent(null);
  };

  // Handle Teacher Login
  const handleLoginTeacher = (teacher: Teacher) => {
    setTeachers((prev) => {
      const exists = prev.some((t) => t.id === teacher.id);
      if (!exists) {
        return [teacher, ...prev];
      }
      return prev.map((t) => (t.id === teacher.id ? teacher : t));
    });
    setActiveTeacher(teacher);
  };

  const handleLogoutTeacher = () => {
    setActiveTeacher(null);
  };

  // Student CRUD
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (loggedInStudent?.id === updatedStudent.id) {
      setLoggedInStudent(updatedStudent);
    }
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (loggedInStudent?.id === studentId) {
      setLoggedInStudent(null);
    }
  };

  // Teacher CRUD
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    if (activeTeacher?.id === updatedTeacher.id) {
      setActiveTeacher(updatedTeacher);
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    if (activeTeacher?.id === teacherId) {
      setActiveTeacher(null);
    }
  };

  // Toggle Homework Completion by Parent
  const handleToggleHomeworkStatus = (studentId: string, homeworkId: string, note?: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const updatedHomework = s.homework.map((hw) => {
          if (hw.id !== homeworkId) return hw;
          const isPending = hw.status === 'Pending';
          return {
            ...hw,
            status: isPending ? 'Completed' : 'Pending',
            parentSubmissionNote: isPending ? note || 'Completed by parent & child.' : undefined,
            completedAt: isPending ? new Date().toLocaleString() : undefined,
          } as HomeworkItem;
        });
        const updatedStudent = { ...s, homework: updatedHomework };
        if (loggedInStudent?.id === studentId) {
          setLoggedInStudent(updatedStudent);
        }
        return updatedStudent;
      })
    );
  };

  // Handle Fee Payment Success
  const handleFeePaymentSuccess = (studentId: string, receipt: PaymentReceipt) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newPaid = s.fees.paidAmount + receipt.amount;
        const newBalance = Math.max(0, s.fees.balanceDue - receipt.amount);

        let remainingPaid = newPaid;
        const updatedItems = s.fees.items.map((item) => {
          if (remainingPaid >= item.amount) {
            remainingPaid -= item.amount;
            return { ...item, status: 'Paid' as const };
          }
          return item;
        });

        const updatedStudent: Student = {
          ...s,
          fees: {
            ...s.fees,
            paidAmount: newPaid,
            balanceDue: newBalance,
            paymentHistory: [receipt, ...s.fees.paymentHistory],
            items: updatedItems,
          },
        };

        if (loggedInStudent?.id === studentId) {
          setLoggedInStudent(updatedStudent);
        }

        return updatedStudent;
      })
    );
  };

  // Handle Community Post Reaction
  const handleReactionToggle = (
    postId: string,
    reactionType: 'like' | 'love' | 'clap' | 'celebrate' | 'star' | 'fire'
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const userReacted = post.userReacted || [];
        const isAlreadyReacted = userReacted.includes(reactionType);

        const currentCount = post.reactions[reactionType] || 0;
        const nextCount = isAlreadyReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

        const nextUserReacted = isAlreadyReacted
          ? userReacted.filter((r) => r !== reactionType)
          : [...userReacted, reactionType];

        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: nextCount,
          },
          userReacted: nextUserReacted,
        };
      })
    );
  };

  // Handle Adding Comment on Community Post
  const handleAddComment = (
    postId: string,
    author: string,
    role: 'Parent' | 'Teacher' | 'Community' | 'Admin',
    text: string
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `c-${Date.now()}`,
          author,
          role,
          text,
          timestamp: 'Just now',
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      })
    );
  };

  // Handle Publishing a New Post
  const handleAddPost = (postData: Omit<CommunityPost, 'id' | 'reactions' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      reactions: {
        like: 1,
        love: 1,
        clap: 0,
        celebrate: 0,
        star: 0,
        fire: 0,
      },
      userReacted: ['like'],
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Handle Sending Parent Message to Teacher
  const handleSendParentMessage = (studentId: string, text: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // Find class teacher if registered
    const teacher = teachers.find((t) => t.gradeAssigned === student.grade);

    const parentMsg: ParentTeacherMessage = {
      id: `msg-${Date.now()}`,
      studentId,
      studentName: student.name,
      parentName: student.parentName,
      parentWhatsApp: student.parentWhatsApp,
      teacherId: teacher?.id || student.classTeacher.email,
      teacherName: teacher?.name || student.classTeacher.name,
      text,
      timestamp: 'Just now',
      sender: 'parent',
      read: true,
    };

    setMessages((prev) => [...prev, parentMsg]);
  };

  // Handle Sending Teacher Message to Parent
  const handleSendTeacherMessage = (studentId: string, text: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || !activeTeacher) return;

    const teacherMsg: ParentTeacherMessage = {
      id: `msg-${Date.now()}`,
      studentId,
      studentName: student.name,
      parentName: student.parentName,
      parentWhatsApp: student.parentWhatsApp,
      teacherId: activeTeacher.id,
      teacherName: activeTeacher.name,
      text,
      timestamp: 'Just now',
      sender: 'teacher',
      read: true,
    };

    setMessages((prev) => [...prev, teacherMsg]);
  };

  // Handle Uploading Homework by Teacher
  const handleUploadHomework = (
    newHomework: Omit<HomeworkItem, 'id' | 'status' | 'parentSubmissionNote' | 'completedAt'>
  ) => {
    const itemTemplate: HomeworkItem = {
      ...newHomework,
      id: `hw-${Date.now()}`,
      status: 'Pending',
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.grade === newHomework.gradeLevel) {
          const updated = {
            ...s,
            homework: [itemTemplate, ...s.homework],
          };
          if (loggedInStudent?.id === s.id) {
            setLoggedInStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    const communityAlert: CommunityPost = {
      id: `post-hw-${Date.now()}`,
      title: `📚 ${newHomework.gradeLevel} Homework Assigned: ${newHomework.title}`,
      author: newHomework.teacherName,
      authorRole: `${newHomework.gradeLevel} Lead Educator`,
      targetAudience: newHomework.gradeLevel,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      campus: 'All Campuses',
      category: 'Academics',
      content: `A new assignment has been uploaded for ${newHomework.gradeLevel} learners: "${newHomework.title}" in ${newHomework.subject}. Due date: ${newHomework.dueDate}. Instructions are viewable in the Parent Portal.`,
      reactions: {
        like: 2,
        love: 1,
        clap: 2,
        celebrate: 0,
        star: 1,
        fire: 0,
      },
      comments: [],
    };
    setPosts((prev) => [communityAlert, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Universal Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        loggedInStudent={loggedInStudent}
        activeTeacher={activeTeacher}
        onLogoutParent={handleLogoutStudent}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onGoToParentPortal={() => setCurrentTab('parent-portal')}
              onGoToCommunity={() => setCurrentTab('community')}
              onGoToCampuses={() => setCurrentTab('campuses')}
            />
            <CampusesSection />
            <CurriculumSection
              onGoToParentPortal={() => setCurrentTab('parent-portal')}
            />
          </>
        )}

        {currentTab === 'campuses' && (
          <div>
            <div className="bg-slate-900 text-white py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Locations &middot; Kajiado County
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif">
                  AmboTsavo Schools Campuses
                </h1>
                <p className="text-slate-300 text-sm mt-2 max-w-2xl">
                  Discover our modern campuses in Kajiado Town and Kimana Amboseli. Dedicated early years facilities, safe bus routes, and expansive play areas.
                </p>
              </div>
            </div>
            <CampusesSection />
          </div>
        )}

        {currentTab === 'community' && (
          <CommunityPage
            posts={posts}
            onReactionToggle={handleReactionToggle}
            onAddComment={handleAddComment}
            onAddPost={handleAddPost}
            loggedInStudent={loggedInStudent}
          />
        )}

        {currentTab === 'parent-portal' && (
          <ParentPortal
            students={students}
            teachers={teachers}
            currentStudent={loggedInStudent}
            onLoginStudent={handleLoginStudent}
            onLogoutStudent={handleLogoutStudent}
            onToggleHomeworkStatus={handleToggleHomeworkStatus}
            onSendParentMessage={handleSendParentMessage}
            messages={messages}
            onFeePaymentSuccess={handleFeePaymentSuccess}
          />
        )}

        {currentTab === 'teacher-portal' && (
          <TeacherPortal
            teachers={teachers}
            activeTeacher={activeTeacher}
            onLoginTeacher={handleLoginTeacher}
            onLogoutTeacher={handleLogoutTeacher}
            students={students}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onUploadHomework={handleUploadHomework}
            onSendTeacherMessage={handleSendTeacherMessage}
            onBroadcastCommunityPost={handleAddPost}
            messages={messages}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortal
            students={students}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            feeStructures={feeStructures}
            onUpdateFeeStructures={setFeeStructures}
            posts={posts}
            onAddPost={handleAddPost}
            onDeletePost={handleDeletePost}
            onBackToSchool={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Editorial Footer */}
      {currentTab !== 'admin' && <Footer onSelectTab={setCurrentTab} />}

    </div>
  );
}
