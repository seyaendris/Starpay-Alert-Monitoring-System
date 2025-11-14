import { AccountsTable } from "@/components/accounts/AccountsTable";

export default function AccountsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Accounts</h1>
      <AccountsTable />
    </div>
  );
}
