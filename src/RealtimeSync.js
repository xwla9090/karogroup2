import { useEffect } from "react";
import { supabase } from "./supabase";

function setLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function getLS(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v || d; } catch { return d; } }

export default function RealtimeSync({ project, onUpdate }) {
  useEffect(() => {
    if (!project) return;

    const expSub = supabase
      .channel("exp_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project },
        (payload) => {
          if (onUpdate) onUpdate("expenses", payload);
        }
      ).subscribe();

    const concSub = supabase
      .channel("conc_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project },
        (payload) => {
          if (onUpdate) onUpdate("concrete", payload);
        }
      ).subscribe();

    const cashSub = supabase
      .channel("cash_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "cash", filter: "project=eq." + project },
        (payload) => {
          if (onUpdate) onUpdate("cash", payload);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
      supabase.removeChannel(cashSub);
    };
  }, [project, onUpdate]);

  return null;
}
