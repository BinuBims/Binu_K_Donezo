import axios from "axios";
import supabase from "./client";

const getAxiosClient = async () => {
  const currentSession = await supabase.auth.getSession();
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("No active session");
  supabase.auth.getSession().then(console.log);

  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${currentSession.data.session.access_token}`,
    },
  });

  return instance;
};

export default getAxiosClient;
