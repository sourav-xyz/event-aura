import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function VerifyEmailFallback({ searchParams }: Props) {
  // `searchParams` can be a Promise in some Next setups; await it to be safe
  const params = searchParams ? await searchParams : {};
  const tokenRaw = params?.token as string | string[] | undefined;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;

  if (token) {
    // Server-side redirect to the dynamic route that handles verification
    redirect(`/verify-email/${token}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Verification link</h1>
        <p className="text-muted-foreground mb-4">No token was provided in the URL.</p>
        <Link href="/" className="text-primary hover:underline">
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
