import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useData = (fn) => {
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const refetch = () => fetchData();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return { data, loading, refetch, onRefresh, refreshing };
};

export default useData;
