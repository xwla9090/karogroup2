import { useEffect, useRef } from "react";
import { supabase } from "./supabase";

export default function RealtimeSync({ project, onExpUpdate, onConcUpdate, onCashUpdate }) {
  const isLocal = useRef(false);

  useEffect(() => {
    if (!project) return;

    const expSub = supabase
      .channel("exp_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: "project=eq." + project },
        async () => {
          if (isLocal.current) return;
          const { data } = await supabase.from("expenses").select("*").eq("project", project);
          if (data) onExpUpdate(data);
        }
      ).subscribe();

    const concSub = supabase
      .channel("conc_" + project)
      .on("postgres_changes", { event: "*", schema: "public", table: "concrete", filter: "project=eq." + project },
        async () => {
          if (isLocal.current) return;
          const { data } = await supabase.from("concrete").select("*").eq("project", project);
          if (data) onConcUpdate(data);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(expSub);
      supabase.removeChannel(concSub);
    };
  }, [project]);

  useEffect(() => {
    const setLocal = () => { isLocal.current = true; setTimeout(() => { isLocal.current = false; }, 10000); };
    window.addEventListener("karoLocalChange", setLocal);
    return () => window.removeEventListener("karoLocalChange", setLocal);
  }, []);

  return null;
}