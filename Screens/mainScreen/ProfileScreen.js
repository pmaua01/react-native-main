import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useDispatch } from "react-redux";

import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { authSignOut, deleteAvatar } from "../../redux/auth/authOperations";

// icon
import Gps from "../../images/gps.svg";
import Shape from "../../images/Shape.svg";
import Wo from "../../images/wo.svg";
import Logout from "../../images/log-out.svg";
import Delete from "../../images/delete.svg";
import Addphoto from "../../images/Addphoto.svg";

const ProfileScreen = () => {
  const id = useSelector((state) => state.auth.userId);
  const nickname = useSelector((state) => state.auth.nickname);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userCredentials = useSelector((state) => state.auth);

  const getUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", id));
    await onSnapshot(q, (data) => {
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const createLike = async (id) => {
    await getUserPosts();
    const docRef = doc(db, "posts", id);
    const like = userPosts.find((element) => element.id === id);
    const likePush = like.likePush + 1;
    await setDoc(docRef, { likePush }, { merge: true });
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require(`../../images/PhotoBg.jpg`)}
        style={styles.image}
      >
        <View
          style={{
            ...styles.register,
            justifyContent: "center",
          }}
        >
          <View style={styles.avatar}>
            <Image
              style={{ width: "100%", height: "100%", borderRadius: 25 }}
              source={{ uri: userCredentials.avatar }}
            />
            <TouchableOpacity
              onPress={() => {
                dispatch(deleteAvatar());
              }}
              style={{
                width: 25,
                height: 25,
                position: "absolute",
                top: 100,
                right: 0,
                transform: [{ translateY: -14 }, { translateX: 12 }],
                zIndex: 999,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {userCredentials.avatar ? (
                <Delete style={{ width: 25, height: 25 }} />
              ) : (
                <Addphoto />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(authSignOut());
            }}
            style={{
              width: 25,
              height: 25,
              position: "absolute",
              top: 0,
              right: 0,
              transform: [{ translateY: 24 }, { translateX: -19 }],
            }}
          >
            <Logout></Logout>
          </TouchableOpacity>

          <View style={styles.posts}>
            <View
              style={{
                marginBottom: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 30, fontWeight: "500" }}>
                {nickname}
              </Text>
            </View>
            <FlatList
              data={userPosts}
              keyExtractor={(item, indx) => indx.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 34,
                    width: "100%",
                    // justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.photo }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                  <Text style={{ marginBottom: 10 }}>{item.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Комментарии", {
                            photo: item.photo,
                            id: item.id,
                          })
                        }
                        style={{ marginRight: 9 }}
                      >
                        <Shape
                          fill={item.qtyPush ? "#FF6C00" : "#E5E5E5"}
                        ></Shape>
                      </TouchableOpacity>

                      <Text>{item.qtyPush || 0}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ marginRight: 9 }}
                        onPress={() => createLike(item.id)}
                      >
                        <Wo></Wo>
                      </TouchableOpacity>
                      <Text>{item.likePush}</Text>

                      <Text></Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("MapScreen", {
                            latitude: item.location.latitude,
                            longitude: item.location.longitude,
                          })
                        }
                      >
                        <Gps></Gps>
                      </TouchableOpacity>

                      <Text style={{ textDecorationLine: "underline" }}>{`${
                        item.region.country || item.location.latitude
                      }/${item.region.city || item.location.longitude} `}</Text>
                    </View>
                  </View>
                </View>
              )}
            ></FlatList>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,

    resizeMode: "cover",
  },
  register: {
    position: "absolute",
    top: "20%",

    width: "100%",
    height: "80%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
  },
  registerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 33,
    fontFamily: "Roboto-Medium",
  },
  avatar: {
    position: "absolute",
    width: 120,
    height: 120,
    top: -60,
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
  },
  posts: {
    marginTop: 90,
    flex: 1,
    width: "100%",
  },
});

export default ProfileScreen;
