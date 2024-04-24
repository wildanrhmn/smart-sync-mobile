import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUserBookmarks } from "../../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import VideoCard from "../../../components/VideoCard";
import useAppwrite from "../../../lib/useAppwrite";
import SearchInput from "../../../components/SearchInput";
import EmptyState from "../../../components/EmptyState";

const Bookmark = () => {
  const { data: bookmarks, refetch } = useAppwrite(() =>
    getCurrentUserBookmarks(query)  
  );
  const { query } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creatorId={item.creator.$id}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-8 px-4 space-y-5">
            <View className="flex flex-1 items-start mb-6">
              <Text className="text-2xl text-white font-pmedium">
                Saved Videos
              </Text>
            </View>
            <SearchInput initialQuery={query} placeholder="Search bookmarked videos" />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No saved videos"}
            subtitle={"No saved videos found"}
            showButton={false}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
