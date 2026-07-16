/** A recurrent clinical task with scheduling and repetition configuration */
export interface recurrentTask {
  _id: string;
  title: string;
  description: string;
  assignees: { staffId: string }[];
  tags: string[];
  stage: 'Done' | 'Pending' | 'In Process' | 'Omitted';
  priority: 'Routine' | 'Urgent' | 'In Stat';
  startDate: string;
  endDate?: string;
  deltaTime: number;
  type: string;
  repetitionTimes: number;
  repetitionLapse: number;
  repetitionSequence:
    | 'annually'
    | 'monthly'
    | 'weekly'
    | 'daily'
    | 'firstInMonth'
    | 'secondInMonth'
    | 'thirdInMonth'
    | 'fourthInMonth';
  repetitionDays: string[];
  recordId?: string;
  contactId?: string;
  parentId?: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}
