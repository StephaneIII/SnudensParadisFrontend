"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { withAPI } from "../app/api/navigation";

function LinkWithAPI({ href, ...props }) {
  const searchParams = useSearchParams();
  return <Link href={withAPI(href, searchParams.get("API"))} {...props} />;
}

export default function ApiLink({ href, ...props }) {
  return (
    <Suspense fallback={<Link href={href} {...props} />}>
      <LinkWithAPI href={href} {...props} />
    </Suspense>
  );
}
