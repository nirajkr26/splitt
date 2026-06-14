import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGroup } from "../api/client.js";
import Layout from "../components/Layout.jsx";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        const data = await fetchGroup(id);
        if (!cancelled) {
          setGroup(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load group");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
          Back to groups
        </Link>

        {loading ? (
          <p className="text-slate-600">Loading group...</p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : group ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold">{group.name}</h1>
              <p className="mt-1 text-slate-600">
                {group._count?.expenses ?? 0} expenses,{" "}
                {group._count?.settlements ?? 0} settlements
              </p>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium">Participants</h2>
              {group.participants?.length ? (
                <ul className="mt-4 space-y-2">
                  {group.participants.map((participant) => (
                    <li
                      key={participant.id}
                      className="rounded-lg border border-slate-200 px-3 py-2"
                    >
                      {participant.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-600">
                  No participants yet. Participant management arrives in Phase 2.
                </p>
              )}
            </section>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
