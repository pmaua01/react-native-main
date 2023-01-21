import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  query,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../firebase/config/";
// icon
import Gps from "../../images/gps.svg";
import Shape from "../../images/Shape.svg";
import { useSelector } from "react-redux";

const DefaultPostsScreen = ({ route, navigation }) => {
  const userCredentials = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    const q = query(collection(db, "posts"));
    await onSnapshot(q, (data) => {
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginBottom: 32 }}>
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#F6F6F6",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {userCredentials.avatar && (
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{ uri: userCredentials.avatar }}
            />
          )}
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Roboto-Regular",
              fontWeight: "700",
            }}
          >
            {userCredentials.nickname}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Regular",
              fontWeight: "400",
              color: "rgba(33, 33, 33, 0.8)",
            }}
          >
            {userCredentials.email}
          </Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 34,
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
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#212121",
                marginBottom: 11,
              }}
            >
              {item.name}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ marginRight: 9 }}
                  onPress={() =>
                    navigation.navigate("Комментарии", {
                      photo: item.photo,
                      id: item.id,
                    })
                  }
                >
                  <Shape></Shape>
                </TouchableOpacity>

                <Text>{item.qtyPush}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 9 }}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F6F6F6",
  },
});

export default DefaultPostsScreen;
