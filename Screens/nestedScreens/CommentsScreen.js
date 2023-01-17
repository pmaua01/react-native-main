import { PhoneMultiFactorGenerator } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
// icon
import RowUp from "../../images/rowup.svg";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  query,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config/";

import { useSelector } from "react-redux";

const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComents] = useState([]);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const nickname = useSelector((state) => state.auth.nickname);

  console.log(route.params);
  const { photo, id } = route.params;
  const userCredentials = useSelector((state) => state.auth);

  const createPost = async () => {
    const docRef = doc(db, "posts", id);
    const colRef = collection(docRef, "comments");
    const qty = allComments.length;
    const qtyPush = qty + 1;
    await addDoc(colRef, {
      comment,
      nickname,
    });
    await setDoc(docRef, { qtyPush }, { merge: true });

    setComment("");
  };

  const getAllPosts = async () => {
    const docRef = doc(db, "posts", id);
    const colRef = collection(docRef, "comments");
    const q = query(colRef);
    await onSnapshot(q, (data) => {
      setAllComents(data.docs.map((doc) => ({ ...doc.data() })));
    });
  };

  useEffect(() => {
    getAllPosts();
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setIsShowKeyboard(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setIsShowKeyboard(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: `${photo}` }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginBottom: 32,
          }}
        />

        <FlatList
          data={allComments}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              key={item.key}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              {index % 2 === 0 ? (
                <>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 50,
                      backgroundColor: "#FF6C00",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      source={{ uri: userCredentials.avatar }}
                    />
                  </View>
                  <View style={styles.right}>
                    <Text>{item.comment}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.left}>
                    <Text>{item.comment}</Text>
                  </View>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 50,
                      backgroundColor: "#FF6C00",
                    }}
                  ></View>
                </>
              )}
            </View>
          )}
        />
      </View>
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: "#F6F6F6",
            borderRadius: 100,
            height: 60,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TextInput
            onChangeText={(value) => setComment(value)}
            value={comment}
            placeholder="Комментировать..."
            style={{
              height: 50,
              marginLeft: 16,
            }}
          ></TextInput>
          <TouchableOpacity
            onPress={createPost}
            style={{
              backgroundColor: "#FF6C00",
              width: 34,
              height: 34,
              borderRadius: 50,
              marginRight: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RowUp />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "space-between",
  },
  left: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",

    marginBottom: 5,
    width: 299,
    padding: 16,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  right: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",

    marginBottom: 5,
    width: 299,
    padding: 16,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
});

export default CommentsScreen;
