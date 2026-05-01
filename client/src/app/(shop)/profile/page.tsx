import { ProfileForm } from "@/modules/profile/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Update how you appear across the storefront experience.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
