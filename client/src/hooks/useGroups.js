import { useState, useEffect } from "react";
import api from "../api";

export default function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups");
      setGroups(response.data.groups || []);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, setGroups, loading, error, fetchGroups };
}