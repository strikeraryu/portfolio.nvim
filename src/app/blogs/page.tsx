'use client';

import PageHeader from '../../components/PageHeader';
import TelescopeList from '../components/TelescopeList';

export default function BlogsPage() {
  return (
    <div>
      <PageHeader />
    <div className="page-content">
        <TelescopeList folder="blogs" />
      </div>
    </div>
  );
} 