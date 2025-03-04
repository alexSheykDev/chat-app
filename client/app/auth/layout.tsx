import Image from "next/image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <div className="flex-1 flex items-center justify-center">{children}</div>
      <div className="flex-1">
        <Image
          src="/auth-cover.webp"
          alt="Auth Cover Image"
          width={1440}
          height={1800}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}
