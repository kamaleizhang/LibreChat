/* eslint-disable react-hooks/rules-of-hooks */
import { ArrowUpDown } from 'lucide-react';
import { SystemRoles, FileContext } from 'librechat-data-provider';
import type { ColumnDef } from '@tanstack/react-table';
import type { TUser } from 'librechat-data-provider';
import ImagePreview from '~/components/Chat/Input/Files/ImagePreview';
import { SortFilterHeader } from './SortFilterHeader';
import { Button, Checkbox } from '~/components/ui';
import { formatDate, getFileType } from '~/utils';
import useLocalize from '~/hooks/useLocalize';

const contextMap = {
  [FileContext.avatar]: 'com_ui_avatar',
  [FileContext.unknown]: 'com_ui_unknown',
  [FileContext.assistants]: 'com_ui_assistants',
  [FileContext.image_generation]: 'com_ui_image_gen',
  [FileContext.assistants_output]: 'com_ui_assistants_output',
  [FileContext.message_attachment]: 'com_ui_attachment',
};

export const columns: ColumnDef<TUser>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="flex"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="flex"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'avatar',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <div>{localize('com_ui_avatar')}</div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      if (user.avatar) {
        return (
          <div className="flex">
            <ImagePreview
              url={user.avatar}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md"
            />
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 py-0 text-xs sm:px-2 sm:py-2 sm:text-sm"
        >
          {localize('com_auth_email')}
          <ArrowUpDown className="ml-2 h-3 w-4 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 py-0 text-xs sm:px-2 sm:py-2 sm:text-sm"
        >
          {localize('com_auth_full_name')}
          <ArrowUpDown className="ml-2 h-3 w-4 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <SortFilterHeader
          column={column}
          title={localize('com_ui_role')}
          filters={{
            Storage: Object.values(SystemRoles).filter(
              (value) =>
                value === SystemRoles.ADMIN ||
                value === SystemRoles.USER,
            ),
          }}
          valueMap={{
            [SystemRoles.ADMIN]: SystemRoles.ADMIN,
            [SystemRoles.USER]: 'USER',
          }}
        />
      );
    },
    cell: ({ row }) => row.original.role,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 py-0 text-xs sm:px-2 sm:py-2 sm:text-sm"
        >
          {localize('com_ui_username')}
          <ArrowUpDown className="ml-2 h-3 w-4 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.username,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      const localize = useLocalize();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 py-0 text-xs sm:px-2 sm:py-2 sm:text-sm"
        >
          {localize('com_ui_date_update')}
          <ArrowUpDown className="ml-2 h-3 w-4 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
];
