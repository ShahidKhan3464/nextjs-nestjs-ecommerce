import { ProfileForm } from "@/modules/customer/profile";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Keep your name and contact information current for orders and receipts.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
