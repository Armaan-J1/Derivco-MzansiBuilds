export interface User {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  avatarInitials: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  stage: 'Planning' | 'In Progress' | 'Blocked' | 'Wrapping Up' | 'Complete';
  supportRequired: string;
  milestones: Milestone[];
  completedAt?: string;
  createdAt: string;
  tags?: string[];
  featured?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: 'new_project' | 'update';
  project: Project;
  comments: Comment[];
  raiseHandCount: number;
  raisedByMe: boolean;
  raiseHandRequests: { userId: string; userName: string; note: string }[];
  createdAt: string;
}
