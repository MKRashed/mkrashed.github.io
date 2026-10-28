export interface Project {
  slug: string;
  title: string;
  category: string;
  group: 'Healthcare' | 'Learning platforms' | 'HRM & workforce';
  summary: string;
  status: 'TODO' | 'Published';
  featured?: boolean;
  problem: string;
  solution: string;
  challenges?: string;
  technologies: string[];
  github?: string;
  live?: string;
  portal?: string;
}

// Project identities supplied by Rashedul; descriptions checked against public sites.
// Add project-specific stacks, contributions, and technical decisions when confirmed.
export const projects: Project[] = [
  {
    slug: 'ipms',
    title: 'IPMS',
    category: 'Patient management',
    group: 'Healthcare',
    summary:
      'A patient management platform connecting doctor discovery, appointments, chamber management, and digital prescriptions.',
    status: 'Published',
    featured: true,
    problem:
      'Patients need a straightforward way to find doctors and book appointments, while doctors need to manage their chambers and patient visits.',
    solution:
      'IPMS brings doctor profiles, appointment booking, chamber schedules, patient information, and digital prescriptions into one platform.',
    technologies: [],
    live: 'https://ipms.health/',
  },
  {
    slug: 'bpsc',
    title: 'Bangladesh Pain & Spine Center',
    category: 'Healthcare & training',
    group: 'Healthcare',
    summary:
      'A healthcare website bringing specialist information, appointment access, and professional training together.',
    status: 'Published',
    problem:
      'Patients need access to information about specialist care, while healthcare professionals need to find relevant courses and training.',
    solution:
      'The BPSC website provides information about doctors and services, appointment access, and a dedicated area for professional courses and training.',
    technologies: [],
    live: 'https://www.bpsc.health/',
  },
  {
    slug: 'medcat',
    title: 'MedCAT Academy',
    category: 'Medical education / LMS',
    group: 'Learning platforms',
    summary:
      'A medical education platform for exam-focused notes, learning resources, and course discovery.',
    status: 'Published',
    featured: true,
    problem:
      'Medical learners need a clear place to discover study resources and learning opportunities for professional examinations.',
    solution:
      'MedCAT organizes medical notes, educational content, and course information in a learner-facing platform with account registration.',
    technologies: [],
    live: 'https://medcat.academy/',
  },
  {
    slug: 'lead-medical-academy',
    title: 'Lead Medical Academy',
    category: 'Medical education / LMS',
    group: 'Learning platforms',
    summary:
      'A learning platform for medical courses, clinical training, and continuing professional development.',
    status: 'Published',
    problem:
      'Medical students and healthcare professionals need a way to discover structured clinical courses and training programs.',
    solution:
      'Lead Medical Academy presents undergraduate and postgraduate learning programs, course information, and access to its learner portal.',
    technologies: [],
    live: 'https://www.leadmedical.academy/',
  },
  {
    slug: 'digi-hrm',
    title: 'Digi HRM',
    category: 'HRM · Attendance · Payroll',
    group: 'HRM & workforce',
    summary:
      'An HR management platform for employee records, attendance, leave, payroll, tasks, and business reports.',
    status: 'Published',
    featured: true,
    problem:
      'Organizations need a shared workspace for employee information and day-to-day workforce administration.',
    solution:
      'Digi HRM brings employee management, attendance, leave, payroll, tasks, and reporting into an authenticated workspace, alongside the eDigitalBio public website.',
    technologies: [],
    live: 'https://edigitalbio.com/',
    portal: 'https://dghrm.edigitalbio.com/',
  },
];

export const projectGroups = [
  'Healthcare',
  'Learning platforms',
  'HRM & workforce',
] as const;
export const featuredProjects = projects.filter((project) => project.featured);
