import { useQuery } from "@tanstack/react-query";

interface ServerData {
  players: number;
  maxPlayers: number;
}

export const useFivemPlayers = (serverCode: string) => {
  return useQuery<ServerData>({
    queryKey: ["fivem-players", serverCode],
    queryFn: async () => {
      try {
        const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverCode}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        return {
          players: json?.Data?.clients || 0,
          maxPlayers: json?.Data?.sv_maxclients || 64,
        };
      } catch {
        return { players: 0, maxPlayers: 64 };
      }
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
