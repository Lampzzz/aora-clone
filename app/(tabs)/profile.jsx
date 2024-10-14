import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { View } from "react-native";

import InfoBox from "@/components/ui/InfoBox";
import Avatar from "@/components/ui/Avatar";
import ProfileButton from "@/components/ui/ProfileButton";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { logout } from "@/firebase/auth";
import { icons, images } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { usePostStore } from "@/store/postStore";

const Profile = () => {
  const { currentUser } = useAuthStore();
  const { userPosts, fetchUserPosts } = usePostStore();
  const { bookmarks, fetchBookmarks } = useBookmarkStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserPosts();
      fetchBookmarks();
    }
  }, [currentUser, bookmarks, userPosts]);

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <View className="w-full justify-center items-center my-12">
        <Avatar />

        <InfoBox
          title={
            currentUser?.username ?? (
              <View className="bg-black-200 w-28 h-6 rounded" />
            )
          }
          styles="mt-3"
        />

        <View className="mt-5 flex flex-row">
          <InfoBox
            title={userPosts?.length ?? 0}
            subtitle={userPosts.length > 1 ? "Posts" : "Post"}
            styles="mr-10"
          />
          <InfoBox
            title={bookmarks?.length ?? 0}
            subtitle={bookmarks.length > 1 ? "Boomarks" : "Bookmark"}
          />
        </View>
      </View>
      <ProfileButton
        handlePress={() => router.push("/my-posts")}
        label="My Posts"
        icon={icons.video}
      />
      <ProfileButton
        handlePress={() => router.push("/bookmark")}
        label="Bookmark"
        icon={icons.bookmark}
      />
      <ProfileButton
        handlePress={() => setShowModal(!showModal)}
        label="Logout"
        icon={icons.logout}
      />
      <ConfirmationModal
        isModalVisible={showModal}
        onPressCancel={() => setShowModal(false)}
        onPressConfirm={logout}
        image={images.logout}
        title="Sign Out"
        subtitle="Are you sure you would like to sign out of your account?"
      />
    </SafeAreaView>
  );
};

export default Profile;
