import Link from "next/link";
export default function Assignments() {
  const items = [{ id: "123", title: "Sample Assignment" }];
  return (
    <section>
      <h1>Assignments</h1>
      <ul>
        {items.map((a) => (
          <li key={a.id}>
            {a.title} — <Link href={`/assignments/${a.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

