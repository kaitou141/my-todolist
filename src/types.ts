export interface Todo {
    id: string;
    name: string;
    description: string;
    status: 'new' | 'inprogress' | 'complete';
    startDate: string;
    endDate: string;
  }
  