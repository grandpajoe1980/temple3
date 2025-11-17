'use client';

import ControlPanel from '../../../components/tenant/ControlPanel';
import PostsPage from '../../../components/tenant/PostsPage';

interface PageProps {
  params: { tenantId: string };
}

export default function TenantSettingsPage({ params }: PageProps) {
  const tenant = { id: params.tenantId };
  const currentUser = null;

  return (
    <div className="space-y-8 p-6">
      <ControlPanel
        tenant={tenant}
        currentUser={currentUser}
        onRefresh={() => window.location.reload()}
      />
      <PostsPage tenantId={tenant.id} />
    </div>
  );
}
