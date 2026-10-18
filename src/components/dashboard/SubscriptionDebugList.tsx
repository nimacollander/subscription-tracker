"use client";

// TEMPORARY: raw view to check that useSubscriptions loads, persists, and updates.
// Replaced by the real dashboard widgets in a later step.
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Card } from "@/components/ui/Card";
import { toISODate } from "@/lib/dates";

const buttonClass =
  "rounded border border-border px-2 py-1 text-xs hover:bg-border/50 transition-colors";

export function SubscriptionDebugList() {
  const { subscriptions, isLoaded, addSubscription, updateSubscription, deleteSubscription, toggleStatus } =
    useSubscriptions();

  return (
    <Card title={`Raw subscriptions (debug) · ${subscriptions.length}`}>
      {!isLoaded ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          <button
            type="button"
            className={`${buttonClass} mb-3`}
            onClick={() =>
              addSubscription({
                name: `Test ${subscriptions.length + 1}`,
                price: 4.99,
                billingCycle: "monthly",
                nextBillingDate: toISODate(new Date()),
                category: "Other",
                notes: "",
                status: "active",
              })
            }
          >
            + Add test subscription
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  {["Name", "Price", "Cycle", "Next billing", "Category", "Status", ""].map((h) => (
                    <th key={h} className="py-2 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-t border-border">
                    <td className="py-2 pr-4">{sub.name}</td>
                    <td className="py-2 pr-4 tabular-nums">{sub.price.toFixed(2)}</td>
                    <td className="py-2 pr-4">{sub.billingCycle}</td>
                    <td className="py-2 pr-4">{sub.nextBillingDate}</td>
                    <td className="py-2 pr-4">{sub.category}</td>
                    <td className="py-2 pr-4">{sub.status}</td>
                    <td className="flex gap-1 py-2 whitespace-nowrap">
                      <button type="button" className={buttonClass} onClick={() => toggleStatus(sub.id)}>
                        {sub.status === "active" ? "Pause" : "Resume"}
                      </button>
                      <button
                        type="button"
                        className={buttonClass}
                        onClick={() => updateSubscription(sub.id, { price: sub.price + 1 })}
                      >
                        +1
                      </button>
                      <button type="button" className={buttonClass} onClick={() => deleteSubscription(sub.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
