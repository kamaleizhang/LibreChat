import type { TUser } from 'librechat-data-provider';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '~/components';
import { useGetUsers } from '~/data-provider';
import { DataTable, columns } from './Table';
import { useLocalize } from '~/hooks';

export default function Users({ open, onOpenChange }) {
  const localize = useLocalize();

  const { data: users = [] } = useGetUsers<TUser[]>({
    select: (users) =>
      users.map((user) => {
        return user;
      }),
  });

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        title={localize('com_nav_users')}
        className="w-11/12 overflow-x-auto bg-background text-text-primary shadow-2xl"
      >
        <OGDialogHeader>
          <OGDialogTitle>{localize('com_nav_users')}</OGDialogTitle>
        </OGDialogHeader>
        <DataTable columns={columns} data={users} />
      </OGDialogContent>
    </OGDialog>
  );
}
