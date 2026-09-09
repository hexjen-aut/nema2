"use client";

import { useState } from "react";
import { sendOrderMessage } from "@/app/actions/order-messages";

type Message = {
  id: string;
  sender_role: "client" | "admin";
  body: string;
  created_at: string;
};

export default function OrderMessages({
  orderId,
  role,
  messages,
}: {
  orderId: string;
  role: "client" | "admin";
  messages: Message[];
}) {
  const [open, setOpen] = useState(false);
  const action = sendOrderMessage.bind(null, orderId, role);

  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs tracking-label text-orange hover:text-ink transition-colors"
      >
        {open ? "MASQUER LES MESSAGES" : `MESSAGES (${messages.length})`}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-ink/40">Aucun message pour le moment.</p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                m.sender_role === role
                  ? "ml-auto bg-orange text-ivoire"
                  : "bg-rose/60 text-noir"
              }`}
            >
              <p>{m.body}</p>
              <p className={`mt-1 text-[10px] ${m.sender_role === role ? "text-ivoire/70" : "text-noir/40"}`}>
                {new Date(m.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}

          <form action={action} className="flex items-end gap-2 pt-1">
            <textarea
              name="body"
              required
              rows={2}
              placeholder={role === "admin" ? "Répondre à la cliente..." : "Écrire à la boutique..."}
              className="flex-1 rounded-lg border border-ink/15 bg-linen px-3 py-2 text-sm outline-none focus:border-clay"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-clay px-4 py-2 text-xs text-card hover:bg-ink transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
