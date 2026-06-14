import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createGroup, fetchGroups, syncUser } from "../api/client.js";
import Layout from "../components/Layout.jsx";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        await syncUser();
        const data = await fetchGroups();
        if (!cancelled) {
          setGroups(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load groups");
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
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");
      const group = await createGroup(name.trim());
      setGroups((current) => [group, ...current]);
      setName("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create group");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="text-2xl font-semibold">Your groups</h1>
          <p className="mt-1 text-slate-600">
            Create a group to track shared expenses with flatmates or friends.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Create group</h2>
          <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Flatmates"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create group"}
            </button>
          </form>
        </section>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="px-6 py-8 text-slate-600">Loading groups...</p>
          ) : groups.length === 0 ? (
            <p className="px-6 py-8 text-slate-600">
              No groups yet. Create your first group above.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link
                    to={`/groups/${group.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
                  >
                    <span className="font-medium">{group.name}</span>
                    <span className="text-sm text-slate-500">View</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
