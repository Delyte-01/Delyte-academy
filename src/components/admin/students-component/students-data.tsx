export type StudentStatus = "Active" | "Inactive" | "Suspended";

export interface StudentEnrollment {
  courseId: string;
  title: string;
  thumbnail: string;
  progress: number;
  lastStudied: string;
}

export interface StudentActivityItem {
  id: string;
  type: "enrolled" | "topic" | "quiz" | "finished";
  detail: string;
  time: string;
}

export interface Student {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  avatar_url: string | null;
  initials: string;
  role: "student" | "admin";
  status: StudentStatus;
  enrolledCourses: number;
  completedCourses: number;
  topicsCompleted: number;
  quizzesCompleted: number;
  progress: number;
  averageScore: number;
  streak: number;
  lastActive: string;
  created_at: string;
  enrollments: StudentEnrollment[];
  recentActivity: StudentActivityItem[];
}

export const STUDENTS: Student[] = [
  {
    id: "s1",
    full_name: "Chiamaka Okeke",
    username: "chiamaka.o",
    email: "chiamaka.o@gmail.com",
    phone: "+234 801 234 5678",
    country: "Nigeria",
    bio: "Passionate about mathematics and data science. Currently preparing for JAMB.",
    avatar_url: null,
    initials: "CO",
    role: "student",
    status: "Active",
    enrolledCourses: 6,
    completedCourses: 2,
    topicsCompleted: 48,
    quizzesCompleted: 32,
    progress: 87,
    averageScore: 87,
    streak: 14,
    lastActive: "2 hours ago",
    created_at: "Jan 12, 2026",
    enrollments: [
      {
        courseId: "c1",
        title: "Advanced Mathematics",
        thumbnail:
          "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 92,
        lastStudied: "2 hours ago",
      },
      {
        courseId: "c2",
        title: "English Language",
        thumbnail:
          "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 75,
        lastStudied: "Yesterday",
      },
      {
        courseId: "c3",
        title: "Biology & Life Sciences",
        thumbnail:
          "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 60,
        lastStudied: "3 days ago",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "topic",
        detail: "Completed topic: Quadratic Equations",
        time: "2 hours ago",
      },
      {
        id: "ra2",
        type: "quiz",
        detail: "Passed quiz: Algebra Basics (91%)",
        time: "5 hours ago",
      },
      {
        id: "ra3",
        type: "enrolled",
        detail: "Enrolled in: Biology & Life Sciences",
        time: "Yesterday",
      },
      {
        id: "ra4",
        type: "finished",
        detail: "Completed course: English Language Basics",
        time: "3 days ago",
      },
    ],
  },
  {
    id: "s2",
    full_name: "David Adeyemi",
    username: "david.adeyemi",
    email: "david.adeyemi@yahoo.com",
    phone: "+234 802 345 6789",
    country: "Nigeria",
    bio: "Software enthusiast and future engineer. Loves coding challenges.",
    avatar_url: null,
    initials: "DA",
    role: "student",
    status: "Active",
    enrolledCourses: 4,
    completedCourses: 1,
    topicsCompleted: 35,
    quizzesCompleted: 20,
    progress: 72,
    averageScore: 92,
    streak: 7,
    lastActive: "15 min ago",
    created_at: "Feb 3, 2026",
    enrollments: [
      {
        courseId: "c4",
        title: "Java Programming",
        thumbnail:
          "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 80,
        lastStudied: "15 min ago",
      },
      {
        courseId: "c5",
        title: "Data Structures",
        thumbnail:
          "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 55,
        lastStudied: "Yesterday",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "quiz",
        detail: "Passed quiz: Java Basics (92%)",
        time: "15 min ago",
      },
      {
        id: "ra2",
        type: "topic",
        detail: "Completed topic: Variables & Data Types",
        time: "1 hour ago",
      },
      {
        id: "ra3",
        type: "enrolled",
        detail: "Enrolled in: Data Structures",
        time: "2 days ago",
      },
    ],
  },
  {
    id: "s3",
    full_name: "Fatima Mohammed",
    username: "fatima.m",
    email: "fatima.m@gmail.com",
    phone: "+234 803 456 7890",
    country: "Nigeria",
    bio: "Medical student with a love for biology and chemistry.",
    avatar_url: null,
    initials: "FM",
    role: "student",
    status: "Active",
    enrolledCourses: 8,
    completedCourses: 3,
    topicsCompleted: 72,
    quizzesCompleted: 45,
    progress: 78,
    averageScore: 78,
    streak: 21,
    lastActive: "32 min ago",
    created_at: "Dec 18, 2025",
    enrollments: [
      {
        courseId: "c6",
        title: "Biology & Life Sciences",
        thumbnail:
          "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 95,
        lastStudied: "32 min ago",
      },
      {
        courseId: "c7",
        title: "Chemistry Fundamentals",
        thumbnail:
          "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 68,
        lastStudied: "Yesterday",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "topic",
        detail: "Completed topic: Cell Division",
        time: "32 min ago",
      },
      {
        id: "ra2",
        type: "quiz",
        detail: "Passed quiz: Cell Biology (88%)",
        time: "2 hours ago",
      },
      {
        id: "ra3",
        type: "finished",
        detail: "Completed course: Human Anatomy Basics",
        time: "4 days ago",
      },
    ],
  },
  {
    id: "s4",
    full_name: "Emeka Nwosu",
    username: "emeka.n",
    email: "emeka.n@outlook.com",
    phone: "+234 804 567 8901",
    country: "Nigeria",
    bio: "Taking a break from studies but plans to return soon.",
    avatar_url: null,
    initials: "EN",
    role: "student",
    status: "Inactive",
    enrolledCourses: 3,
    completedCourses: 0,
    topicsCompleted: 12,
    quizzesCompleted: 6,
    progress: 35,
    averageScore: 65,
    streak: 0,
    lastActive: "3 weeks ago",
    created_at: "Mar 22, 2026",
    enrollments: [
      {
        courseId: "c8",
        title: "Web Development",
        thumbnail:
          "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 40,
        lastStudied: "3 weeks ago",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "enrolled",
        detail: "Enrolled in: Web Development",
        time: "3 weeks ago",
      },
      {
        id: "ra2",
        type: "topic",
        detail: "Completed topic: HTML Basics",
        time: "3 weeks ago",
      },
    ],
  },
  {
    id: "s5",
    full_name: "Amara Linus",
    username: "amara.linus",
    email: "amara.linus@gmail.com",
    phone: "+234 805 678 9012",
    country: "Nigeria",
    bio: "Aspiring data analyst with a keen interest in statistics.",
    avatar_url: null,
    initials: "AL",
    role: "student",
    status: "Active",
    enrolledCourses: 5,
    completedCourses: 2,
    topicsCompleted: 42,
    quizzesCompleted: 28,
    progress: 84,
    averageScore: 84,
    streak: 10,
    lastActive: "1 hour ago",
    created_at: "Jan 28, 2026",
    enrollments: [
      {
        courseId: "c9",
        title: "Statistics & Probability",
        thumbnail:
          "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 88,
        lastStudied: "1 hour ago",
      },
      {
        courseId: "c10",
        title: "Data Analysis",
        thumbnail:
          "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 72,
        lastStudied: "2 days ago",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "topic",
        detail: "Completed topic: Normal Distribution",
        time: "1 hour ago",
      },
      {
        id: "ra2",
        type: "quiz",
        detail: "Passed quiz: Probability Basics (84%)",
        time: "3 hours ago",
      },
      {
        id: "ra3",
        type: "enrolled",
        detail: "Enrolled in: Data Analysis",
        time: "5 days ago",
      },
    ],
  },
  {
    id: "s6",
    full_name: "Kemi Sodipo",
    username: "kemi.sodipo",
    email: "kemi.sodipo@yahoo.com",
    phone: "+234 806 789 0123",
    country: "Nigeria",
    bio: "Top performer with a passion for economics and business.",
    avatar_url: null,
    initials: "KS",
    role: "student",
    status: "Active",
    enrolledCourses: 7,
    completedCourses: 4,
    topicsCompleted: 85,
    quizzesCompleted: 60,
    progress: 90,
    averageScore: 90,
    streak: 30,
    lastActive: "5 min ago",
    created_at: "Nov 5, 2025",
    enrollments: [
      {
        courseId: "c11",
        title: "Economics & Commerce",
        thumbnail:
          "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 97,
        lastStudied: "5 min ago",
      },
      {
        courseId: "c12",
        title: "Accounting Principles",
        thumbnail:
          "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
        progress: 85,
        lastStudied: "Yesterday",
      },
    ],
    recentActivity: [
      {
        id: "ra1",
        type: "quiz",
        detail: "Passed quiz: Macroeconomics (96%)",
        time: "5 min ago",
      },
      {
        id: "ra2",
        type: "topic",
        detail: "Completed topic: Demand & Supply",
        time: "1 hour ago",
      },
      {
        id: "ra3",
        type: "finished",
        detail: "Completed course: Business Studies",
        time: "Yesterday",
      },
      {
        id: "ra4",
        type: "finished",
        detail: "Completed course: Commerce Basics",
        time: "2 days ago",
      },
    ],
  },
  {
    id: "s7",
    full_name: "Bola Okafor",
    username: "bola.okafor",
    email: "bola.okafor@gmail.com",
    phone: "+234 807 890 1234",
    country: "Nigeria",
    bio: "Account suspended due to multiple policy violations.",
    avatar_url: null,
    initials: "BO",
    role: "student",
    status: "Suspended",
    enrolledCourses: 2,
    completedCourses: 0,
    topicsCompleted: 5,
    quizzesCompleted: 2,
    progress: 18,
    averageScore: 45,
    streak: 0,
    lastActive: "2 months ago",
    created_at: "Apr 1, 2026",
    enrollments: [],
    recentActivity: [],
  },
];

export const STUDENT_KPI = {
  totalStudents: { value: "12,480", change: "+12%", trend: "up" as const },
  activeThisWeek: { value: "4,320", change: "+8%", trend: "up" as const },
  newThisMonth: { value: "284", change: "+23%", trend: "up" as const },
  avgProgress: { value: "68%", change: "-2%", trend: "down" as const },
};
