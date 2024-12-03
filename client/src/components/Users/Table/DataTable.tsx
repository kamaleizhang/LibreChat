import * as React from 'react';
import { ListFilter } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {SystemRoles, type TRegisterUser, TUser, UserContext} from 'librechat-data-provider';
import type { AugmentedColumnDef } from '~/common';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger, OGDialog, OGDialogTrigger, Label,
} from '~/components/ui';
import {
  LockIcon,
  UserIcon,
  TrashIcon,
  Spinner,
  EditIcon,
  NewChatIcon,
} from '~/components/svg';
import useLocalize from '~/hooks/useLocalize';
import OGDialogTemplate from "~/components/ui/OGDialogTemplate";
import {useState} from "react";
import useUpdateUsersFromTable from "~/hooks/Users/useUpdateUsersFromTable";
import useDeleteUsersFromTable from "~/hooks/Users/useDeleteUsersFromTable";
import {useForm} from "react-hook-form";
import {useToastContext} from "~/Providers";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const contextMap = {
  [UserContext.avatar]: 'com_ui_avatar',
  [UserContext.name]: 'com_auth_full_name',
  [UserContext.username]: 'com_ui_username',
  [UserContext.updatedAt]: 'com_ui_date_update',
  [UserContext.email]: 'com_auth_email',
  [UserContext.role]: 'com_ui_role',
  [UserContext.action]: 'com_ui_actions',
};

type Style = {
  width?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  zIndex?: number;
};

  export default function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const localize = useLocalize();
  const [delOpen, setDelOpen] = React.useState(false);
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [pwdOpen, setPwdOpen] = React.useState(false);
  const [addUserOpen, setAddUserOpen] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isInProgres, setIsInProgres] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  // const { mutate: deleteUsers, isLoading:isLoading } = useDeleteUsersMutation({});
  const { showToast } = useToastContext();
  const { deleteUsers } = useDeleteUsersFromTable(() => {
      setIsInProgres(false); setRowSelection({});
      showToast({ status: 'success', message: localize('com_ui_delete_success') });
    }, () => {
      setIsInProgres(false);
      showToast({ status: 'error', message: localize('com_ui_delete_error') });
  });
  const { updateUsers } = useUpdateUsersFromTable(() => {
      setIsInProgres(false); setRowSelection({}); setPwdOpen(false); setIsError(false);
      showToast({ status: 'success', message: localize('com_ui_update_success') });
    }, () => {
      setIsError(true);
      setIsInProgres(false);
      showToast({ status: 'error', message: localize('com_ui_update_error') });
  });
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const registerUser = (user: TRegisterUser) => {
    updateUsers({ userIds: usersToDelete.map(user => user['_id']) , action: 'password', value: password});
  }

  const updatePassword = (user: TRegisterUser) => {
    const password = user.password;
    setIsInProgres(true);
    const usersToDelete = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    updateUsers({ userIds: usersToDelete.map(user => user['_id']) , action: 'password', value: password});
  }
  const setUserRole = (role) => {
    setIsInProgres(true);
    const usersToDelete = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    updateUsers({ userIds: usersToDelete.map(user => user['_id']), action: 'role', value: role});
  }
  const delUsers = () => {
    setIsInProgres(true);
    const usersToDelete = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    deleteUsers({ userIds: usersToDelete.map(user => user['_id']) });
  }
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterUser>({ mode: 'onChange' });
  const password = watch('password');
  const renderInput = (id: string, label: string, type: string, validation: object) => (
    <div className="mb-4">
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={id}
          aria-label={localize(label)}
          {...register(
            id as 'password' | 'confirm_password',
            validation,
          )}
          aria-invalid={!!errors[id]}
          className="
            webkit-dark-styles transition-color peer w-full rounded-2xl border border-border-light
            bg-surface-primary px-3.5 pb-2.5 pt-3 text-text-primary duration-200 focus:border-green-500 focus:outline-none
          "
          placeholder=" "
          data-testid={id}
        />
        <label
          htmlFor={id}
          className="
            absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt duration-200
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
            peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-green-500
            rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4
          "
        >
          {localize(label)}
        </label>
      </div>
      {errors[id] && (
        <span role="alert" className="mt-1 text-sm text-red-500">
          {String(errors[id]?.message) ?? ''}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <OGDialog open={addUserOpen} onOpenChange={setAddUserOpen}>
          <OGDialogTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 gap-2 dark:hover:bg-gray-850/25 sm:ml-0"
            ><EditIcon className="h-4 w-4 text-red-400" /> {localize('com_nav_users_add')}
            </Button>
          </OGDialogTrigger>
          <OGDialogTemplate
            showCancelButton={false}
            showCloseButton={true}
            title={localize('com_auth_reset_password')}
            className="max-w-[450px]"
            main={
              <div className="flex w-full flex-col items-center gap-2">
                <form
                    className="mt-6"
                    aria-label="Registration form"
                    method="POST"
                    onSubmit={handleSubmit((data: TRegisterUser) =>
                        registerUser(data)
                    )}
                >
                  {renderInput('name', 'com_auth_full_name', 'text', {
                    required: localize('com_auth_name_required'),
                    minLength: {
                      value: 3,
                      message: localize('com_auth_name_min_length'),
                    },
                    maxLength: {
                      value: 80,
                      message: localize('com_auth_name_max_length'),
                    },
                  })}
                  {renderInput('username', 'com_auth_username', 'text', {
                    minLength: {
                      value: 2,
                      message: localize('com_auth_username_min_length'),
                    },
                    maxLength: {
                      value: 80,
                      message: localize('com_auth_username_max_length'),
                    },
                  })}
                  {renderInput('email', 'com_auth_email', 'email', {
                    required: localize('com_auth_email_required'),
                    minLength: {
                      value: 1,
                      message: localize('com_auth_email_min_length'),
                    },
                    maxLength: {
                      value: 120,
                      message: localize('com_auth_email_max_length'),
                    },
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: localize('com_auth_email_pattern'),
                    },
                  })}
                  {renderInput('password', 'com_auth_password', 'password', {
                    required: localize('com_auth_password_required'),
                    minLength: {
                      value: 8,
                      message: localize('com_auth_password_min_length'),
                    },
                    maxLength: {
                      value: 128,
                      message: localize('com_auth_password_max_length'),
                    },
                  })}
                  {renderInput('confirm_password', 'com_auth_password_confirm', 'password', {
                    validate: (value: string) =>
                      value === password || localize('com_auth_password_not_match'),
                  })}
                  <div className="mt-6">
                    <button
                        disabled={Object.keys(errors).length > 0}
                        type="submit"
                        aria-label="Submit registration"
                        className="btn-primary w-full transform rounded-2xl px-4 py-3 tracking-wide transition-colors duration-200"
                    >
                      {isInProgres ? <Spinner/> : localize('com_auth_continue')}
                    </button>
                  </div>
                  {isError && <span role="alert" className="mt-1 text-sm text-red-500 dark:text-red-900"><br/>{localize('com_nav_user_add_error')}</span>}
                </form>
              </div>
            }
            />
        </OGDialog>
        <OGDialog open={delOpen} onOpenChange={setDelOpen}>
          <OGDialogTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 gap-2 dark:hover:bg-gray-850/25 sm:ml-0"
              disabled={!table.getFilteredSelectedRowModel().rows.length || isInProgres}
            >
              {isInProgres ? (<Spinner className="h-4 w-4" />) : (<TrashIcon className="h-4 w-4 text-red-400" />)}
              {localize('com_ui_delete')}
            </Button>
          </OGDialogTrigger>
          <OGDialogTemplate
            showCloseButton={false}
            title={localize('com_ui_delete')}
            className="max-w-[450px]"
            main={<Label className="text-left text-sm font-medium">{localize('com_ui_delete_select_users')}</Label>}
            selection={{
              selectHandler: delUsers,
              selectClasses: 'bg-destructive text-white transition-all duration-200 hover:bg-destructive/80',
              selectText: isInProgres ? <Spinner /> : localize('com_ui_submit'),
            }}
          />
        </OGDialog>
        <OGDialog open={adminOpen} onOpenChange={setAdminOpen}>
          <OGDialogTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 gap-2 dark:hover:bg-gray-850/25 sm:ml-0"
              disabled={!table.getFilteredSelectedRowModel().rows.length || isInProgres}
            >
              {isInProgres ? (<Spinner className="h-4 w-4" />) : (<NewChatIcon className="h-4 w-4 text-red-400" />)}
              {localize('com_ui_set_to_admin')}
            </Button>
          </OGDialogTrigger>
          <OGDialogTemplate
            showCloseButton={false}
            title={localize('com_ui_set_to_admin')}
            className="max-w-[450px]"
            main={<Label className="text-left text-sm font-medium">{localize('com_ui_set_confirm')}</Label>}
            selection={{
              selectHandler: () => setUserRole(SystemRoles.ADMIN),
              selectClasses:'bg-destructive text-white transition-all duration-200 hover:bg-destructive/80',
              selectText: isInProgres ? <Spinner /> : localize('com_ui_submit'),
            }}
          />
        </OGDialog>
        <OGDialog open={userOpen} onOpenChange={setUserOpen}>
          <OGDialogTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 gap-2 dark:hover:bg-gray-850/25 sm:ml-0"
              disabled={!table.getFilteredSelectedRowModel().rows.length || isInProgres}
            >
              {isInProgres ? (<Spinner className="h-4 w-4" />) : (<UserIcon className="h-4 w-4 text-red-400" />)}
              {localize('com_ui_set_to_user')}
            </Button>
          </OGDialogTrigger>
          <OGDialogTemplate
            showCloseButton={false}
            title={localize('com_ui_set_to_user')}
            className="max-w-[450px]"
            main={<Label className="text-left text-sm font-medium">{localize('com_ui_set_confirm')}</Label>}
            selection={{
              selectHandler: () => setUserRole(SystemRoles.USER),
              selectClasses:
                'bg-destructive text-white transition-all duration-200 hover:bg-destructive/80',
              selectText: isInProgres ? <Spinner /> : localize('com_ui_submit'),
            }}
          />
        </OGDialog>
        <OGDialog open={pwdOpen} onOpenChange={setPwdOpen}>
          <OGDialogTrigger asChild>
            <Button
              variant="ghost"
              className="ml-1 gap-2 dark:hover:bg-gray-850/25 sm:ml-0"
              disabled={!table.getFilteredSelectedRowModel().rows.length || isInProgres}
            >
              {isInProgres ? (<Spinner className="h-4 w-4" />) : (<LockIcon className="h-4 w-4 text-red-400" />)}
              {localize('com_auth_reset_password')}
            </Button>
          </OGDialogTrigger>
          <OGDialogTemplate
            showCancelButton={false}
            showCloseButton={true}
            title={localize('com_auth_reset_password')}
            className="max-w-[450px]"
            main={
              <div className="flex w-full flex-col items-center gap-2">
                <form
                    className="mt-6"
                    aria-label="Registration form"
                    method="POST"
                    onSubmit={handleSubmit((data: TRegisterUser) =>
                        updatePassword(data)
                    )}
                >
                  {renderInput('password', 'com_auth_password', 'password', {
                    required: localize('com_auth_password_required'),
                    minLength: {
                      value: 8,
                      message: localize('com_auth_password_min_length'),
                    },
                    maxLength: {
                      value: 128,
                      message: localize('com_auth_password_max_length'),
                    },
                  })}
                  {renderInput('confirm_password', 'com_auth_password_confirm', 'password', {
                    validate: (value: string) =>
                        value === password || localize('com_auth_password_not_match'),
                  })}
                  <div className="mt-6">
                    <button
                        disabled={Object.keys(errors).length > 0}
                        type="submit"
                        aria-label="Submit registration"
                        className="btn-primary w-full transform rounded-2xl px-4 py-3 tracking-wide transition-colors duration-200"
                    >
                      {isInProgres ? <Spinner/> : localize('com_auth_continue')}
                    </button>
                  </div>
                  {isError && <span role="alert" className="mt-1 text-sm text-red-500 dark:text-red-900"><br/>{localize('com_auth_reset_password_error')}</span>}
                </form>
              </div>
            }
            />
        </OGDialog>

        <Input
            placeholder={localize('com_users_filter_email')}
            value={(table.getColumn('email')?.getFilterValue() as string | undefined) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="max-w-sm border-border-medium placeholder:text-text-secondary"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto border border-border-medium">
              <ListFilter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {/* Filter Menu */}
          <DropdownMenuContent
            align="end"
            className="z-[1001] dark:border-gray-700 dark:bg-gray-850"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="cursor-pointer capitalize dark:text-white dark:hover:bg-gray-800"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                  >
                    {localize(contextMap[column.id])}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative max-h-[25rem] min-h-0 overflow-y-auto rounded-md border border-black/10 pb-4 dark:border-white/10 sm:min-h-[28rem]">
        <Table className="w-full min-w-[600px] border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const style: Style = { maxWidth: '32px', minWidth: '125px', zIndex: 50 };
                  if (index === 0 && header.id === 'select') {
                    style.width = '25px';
                    style.maxWidth = '25px';
                    style.minWidth = '35px';
                  }
                  return (
                    <TableHead
                      key={header.id}
                      className="align-start sticky top-0 rounded-t border-b border-black/10 bg-white px-2 py-1 text-left font-medium text-gray-700 dark:border-white/10 dark:bg-gray-700 dark:text-gray-100 sm:px-4 sm:py-2"
                      style={style}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-b border-black/10 text-left text-gray-600 dark:border-white/10 dark:text-gray-300 [tr:last-child_&]:border-b-0"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const maxWidth =
                      (cell.column.columnDef as AugmentedColumnDef<TData, TValue>).meta?.size ??
                      'auto';

                    const style: Style = {};
                    if (cell.column.id === 'filename') {
                      style.maxWidth = maxWidth;
                    } else if (index === 0) {
                      style.maxWidth = '20px';
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className="align-start overflow-x-auto px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm [tr[data-disabled=true]_&]:opacity-50"
                        style={style}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {localize('com_files_no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="ml-4 mr-4 mt-4 flex h-auto items-center justify-end space-x-2 py-4 sm:ml-0 sm:mr-0 sm:h-0">
        <div className="text-muted-foreground ml-2 flex-1 text-sm">
          {localize(
            'com_users_number_selected',
            `${table.getFilteredSelectedRowModel().rows.length}`,
            `${table.getFilteredRowModel().rows.length}`,
          )}
        </div>
        <Button
          className="select-none border-border-medium"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {localize('com_ui_prev')}
        </Button>
        <Button
          className="select-none border-border-medium"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {localize('com_ui_next')}
        </Button>
      </div>
    </>
  );
}
