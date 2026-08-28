import type { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Opportunities } from './features/opportunities/opportunities';
import { Import } from './features/import/import';
import { OpportunityDetail } from './features/opportunity-detail/opportunity-detail';
import { Inbox } from './features/inbox/inbox';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'inbox',
    component: Inbox,
  },
  {
    path: 'opportunities',
    component: Opportunities,
  },
  {
    path: 'opportunities/:id',
    component: OpportunityDetail,
  },
  {
    path: 'import',
    component: Import,
  },
];
