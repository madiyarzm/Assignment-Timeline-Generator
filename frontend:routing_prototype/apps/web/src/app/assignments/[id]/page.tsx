import Link from "next/link";

export default function AssignmentDetail({ params }: { params: { id: string } }) {
  return (
    <section>
      <h1>Assignment {params.id}</h1>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/timeline">Open timeline</Link>
        <Link href="/calendar">Export to calendar</Link>
      </div>
    </section>
  );
}

