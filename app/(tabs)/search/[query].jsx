import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPostsByQuery } from '../../../lib/appwrite';

import useAppwrite from '../../../lib/useAppwrite';
import VideoCard from '../../../components/VideoCard';
import SearchInput from '../../../components/SearchInput';
import EmptyState from '../../../components/EmptyState';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => getPostsByQuery(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
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
          <View className="my-6 px-4 space-y-6">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-gray-100 font-pmedium text-sm">
                Search results for:
              </Text>
              <Text className="text-white font-psemibold text-2xl">
                {query}
              </Text>
            </View>
          </View>

          <SearchInput initialQuery={query} placeholder="Search videos" />
        </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
          title={`No results for ${query}`}
          subtitle={`Try searching for something else`}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search