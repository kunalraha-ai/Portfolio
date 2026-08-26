"use client";

import dynamic from "next/dynamic";

const RealmCanvas = dynamic(
  () => import("@/components/three/realm-canvas").then((module) => module.RealmCanvas),
  {
    ssr: false,
    loading: () => <div className="realm-static" aria-hidden="true" />,
  },
);

export function HeroRealm() {
  return <RealmCanvas />;
}
