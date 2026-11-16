export interface QueryResult {
  columns: string[];
  rows: (string | number | null | Uint8Array)[][];
  executionTimeMs: number;
  rowCount: number;
  statementType: 'SELECT' | 'DML' | 'DDL' | 'OTHER';
  changes?: number;
}

export interface TableColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
  fk?: {
    table: string;
    to: string;
  };
}

export interface TableSchemaInfo {
  name: string;
  columns: TableColumnInfo[];
  rowCount: number;
  sampleRows: (string | number | null | Uint8Array)[][];
}

export type VisualizerType =
  | 'execution-order'
  | 'join-diagram'
  | 'group-by'
  | 'window-vs-group';

export type TheoryBlock =
  | {
      type: 'text';
      title?: string;
      content: string;
    }
  | {
      type: 'syntax';
      title?: string;
      code: string;
      caption?: string;
    }
  | {
      type: 'example';
      title: string;
      description?: string;
      sql: string;
    }
  | {
      type: 'callout';
      variant: 'tip' | 'warning' | 'interview' | 'info';
      title: string;
      content: string;
    }
  | {
      type: 'comparison';
      title: string;
      leftTitle: string;
      leftItems: string[];
      rightTitle: string;
      rightItems: string[];
    }
  | {
      type: 'visualizer';
      kind: VisualizerType;
      title: string;
      description: string;
    };

export interface PracticeChallenge {
  title: string;
  prompt: string;
  requirements: string[];
  starterSql: string;
  solutionSql: string;
  /** Optional query run after solution/user SQL for DML/DDL grading */
  verifySql?: string;
  requireOrder?: boolean;
  hints: string[];
  xp: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  tags: string[];
  theory: TheoryBlock[];
  challenge: PracticeChallenge;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  color: 'amber' | 'blue' | 'emerald' | 'violet' | 'rose' | 'cyan';
  lessons: Lesson[];
}

export interface GradeResult {
  passed: boolean;
  message: string;
  details?: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
  error?: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CheatSheetItem {
  id: string;
  category: string;
  keyword: string;
  syntax: string;
  description: string;
  example: string;
}

export interface CaseStudy {
  id: string;
  order: number;
  title: string;
  company: string;
  domain: 'E-commerce' | 'Product Analytics' | 'HR & Ops' | 'Data Audit';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Interview';
  skills: string[];
  scenario: string;
  challenge: PracticeChallenge;
}

