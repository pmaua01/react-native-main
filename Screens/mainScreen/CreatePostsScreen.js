import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";

import Photo from "../../images/Photo.svg";
// icon
import Gps from "../../images/gps.svg";
import Trash from "../../images/trash.svg";
// helpers

import { db } from "../../firebase/config";

const initialState = {
  name: "",
  location: "",
};

const storage = getStorage();

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState("");
  const [camera, setCamera] = useState(null);
  const [state, setState] = useState(initialState);
  const [position, setPosition] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isShowButton, setIsShowButton] = useState(true);
  const [region, setRegion] = useState("");

  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);
  const getCity = async (latitude, longitude) => {
    const place = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    return { city: place[0].city, country: place[0].country };
  };

  useEffect(() => {
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

  const { userId, nickname } = useSelector((state) => state.auth);

  const takePhoto = async () => {
    requestPermission();
    console.log(permission);
    if (!permission.granted) {
      error("Not Permission");
    }
    const photo = await camera.takePictureAsync();
    const locationGps = await Location.getCurrentPositionAsync();
    setPosition(locationGps);
    const latitude = locationGps.coords.latitude;
    const longitude = locationGps.coords.longitude;
    const region = await getCity(latitude, longitude);
    setRegion(region);
    setPhoto(photo.uri);
    setIsShowButton(false);
  };

  const uploadFoto = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const id = Date.now().toString();
    const storageRef = ref(storage, `postImage/${id}`);
    await uploadBytes(storageRef, file);
    const downloadFoto = await getDownloadURL(storageRef);
    setIsShowButton(true);
    setRegion("");
    return downloadFoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadFoto();

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        photo,
        name: state.name,
        location: position.coords,
        nickname,
        userId,
        region,
        likePush: 0,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const publish = () => {
    navigation.navigate("Публикации");
    uploadPostToServer();
    setState(initialState);
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            ...styles.cameraBorder,
            marginTop: isShowKeyboard ? 0 : 32,
            marginBottom: 8,
          }}
        >
          <Camera style={styles.camera} ref={setCamera}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Photo style={{ color: "black" }}></Photo>
            </TouchableOpacity>
          </Camera>
        </View>
        {isShowKeyboard ? (
          <></>
        ) : (
          <Text style={{ color: "#BDBDBD" }}>
            {photo ? "Редактировать фото" : "Загрузите фото"}
          </Text>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.titleBorder,
              marginTop: isShowKeyboard ? 10 : 48,
            }}
          >
            <TextInput
              placeholder="Название..."
              style={styles.title}
              value={state.name}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, name: value }))
              }
            ></TextInput>
          </View>
          <View
            style={{
              ...styles.titleBorder,
              marginTop: 32,
              flexDirection: "row",
            }}
          >
            <Gps style={styles.gpsIcon}></Gps>

            <TextInput
              placeholder="Местность"
              style={styles.title}
              value={region && `${region.country}/${region.city}`}
              onChangeText={(value) =>
                setState((prevState) => ({ ...prevState, location: value }))
              }
            ></TextInput>
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            ...styles.publishButton,
            backgroundColor: isShowButton ? "#F6F6F6" : "#FF6C00",
          }}
          disabled={isShowButton}
          onPress={publish}
        >
          <Text
            style={{
              ...styles.publishButtonTitle,
              color: isShowButton ? "#BDBDBD" : "#fff",
            }}
          >
            Опубликовать
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",

          marginBottom: 5,
        }}
      >
        <Trash></Trash>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  cameraBorder: {
    height: 240,

    marginTop: 60,

    overflow: "hidden",
    borderRadius: 8,
  },

  camera: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#fff",
    color: "#fff",
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  titleBorder: {
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },

  title: {
    fontFamily: "Roboto-Regular",
    marginBottom: 10,
  },
  publishButton: {
    marginTop: 32,

    borderRadius: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  publishButtonTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
});

export default CreatePostsScreen;
