import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  getStoredTeachers, 
  saveStoredTeachers, 
  getStoredPosts, 
  saveStoredPosts,
  getStoredFeeStructures,
  saveStoredFeeStructures
} from './data/initialData';
import { Student, Teacher, CommunityPost, GradeFeeStructure } from './types';
import { AdminPortal } from './components/AdminPortal';

function AdminApp() {
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStoredTeachers());
  const [posts, setPosts] = useState<CommunityPost[]>(() => getStoredPosts());
  const [feeStructures, setFeeStructures] = useState(() => getStoredFeeStructures());

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
    saveStoredFeeStructures(feeStructures);
  }, [feeStructures]);

  // Handle Updates
  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (newSt: Student) => {
    setStudents((prev) => [newSt, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddTeacher = (newTch: Teacher) => {
    setTeachers((prev) => [newTch, ...prev]);
  };

  const handleUpdateTeacher = (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateFeeStructures = (newStructures: Record<string, GradeFeeStructure>) => {
    setFeeStructures(newStructures as any);
  };

  const handleAddPost = (post: Omit<CommunityPost, 'id' | 'reactions' | 'comments'>) => {
    const newP: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      reactions: { like: 0, love: 0, clap: 0, celebrate: 0, star: 0, fire: 0 },
      comments: [],
    };
    setPosts((prev) => [newP, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
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
      onUpdateFeeStructures={handleUpdateFeeStructures}
      posts={posts}
      onAddPost={handleAddPost}
      onDeletePost={handleDeletePost}
      onBackToSchool={() => {
        window.location.href = '/';
      }}
    />
  );
}

createRoot(document.getElementById('root')!).render(<AdminApp />);
