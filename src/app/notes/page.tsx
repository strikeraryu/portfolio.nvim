'use client';

import PageHeader from '../../components/PageHeader';
import TelescopeList from '../components/TelescopeList';

export default function NotesPage() {
  return (
    <div>
      <PageHeader />
    <div className="page-content">
        <TelescopeList folder="notes" />
      </div>
    </div>
  );
} 