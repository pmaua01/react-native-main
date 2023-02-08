import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getFirestore,
} from "firebase/storage";
import { db } from "../firebase/config";

import { useDispatch } from "react-redux";

import { authOnRegister } from "../redux/auth/authOperations";
// icon
import Addphoto from "../images/Addphoto.svg";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: "",
};

const storage = getStorage();

export const RegistrationScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [securePass, setSecurePass] = useState(true);

  const [photo, setPhoto] = useState("");
  const [camera, setCamera] = useState(null);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const dispatch = useDispatch();

  const keyboardHideOutInput = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const onLogin = async () => {
    await uploadFoto();
    await dispatch(authOnRegister(state));
    setState(initialState);
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

  // take photo for avatar

  const uploadFoto = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const id = Date.now().toString();
    const storageRef = ref(storage, `avatarImage/${id}`);
    await uploadBytes(storageRef, file);
    const downloadFoto = await getDownloadURL(storageRef);
    console.log("downloadFoto", downloadFoto);
    setState((prevState) => ({
      ...prevState,
      avatar: downloadFoto,
    }));
  };

  const takePhoto = async () => {
    requestPermission();
    console.log(permission);
    if (!permission.granted) {
      error("Not Permission");
    }
    try {
      const photo = await camera.takePictureAsync();
      console.log("Photo on register screen", photo);
      setPhoto(photo.uri);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHideOutInput}>
      <View style={styles.container}>
        <ImageBackground
          source={require(`../images/PhotoBg.jpg`)}
          style={styles.image}
        >
          <View
            style={{
              ...styles.register,
              justifyContent: isShowKeyboard ? "flex-end" : "center",
            }}
          >
            <View style={styles.avatar}>
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  width: 25,
                  height: 25,
                  position: "absolute",
                  top: 100,
                  right: 0,
                  transform: [{ translateY: -14 }, { translateX: 12 }],
                  zIndex: 999,
                }}
              >
                <Addphoto />
              </TouchableOpacity>
              <View
                style={{
                  overflow: "hidden",
                  borderRadius: 25,
                  backgroundColor: "#F6F6F6",
                }}
              >
                <Camera
                  style={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F6F6F6",
                  }}
                  ref={setCamera}
                  type={CameraType.front}
                ></Camera>
              </View>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View styles={styles.form}>
                <View
                  style={{
                    marginBottom: 16,
                    ajustifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.registerTitle}>Регистрация</Text>
                  <TextInput
                    placeholder="Логин"
                    style={styles.input}
                    value={state.login}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        login: value,
                      }))
                    }
                  />
                </View>
                <View style={{ marginBottom: 16 }}>
                  <TextInput
                    placeholder="Адрес электронной почты"
                    style={styles.input}
                    value={state.email}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        email: value,
                      }))
                    }
                  />
                </View>
                <View
                  style={{
                    marginBottom: isShowKeyboard ? 32 : 43,
                    position: "relative",
                  }}
                >
                  <TextInput
                    placeholder="Пароль"
                    secureTextEntry={securePass}
                    style={styles.input}
                    value={state.password}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      transform: [{ translateY: 16 }, { translateX: -16 }],
                    }}
                  >
                    <Text
                      style={{ color: "#1B4371", fontSize: 16 }}
                      onPress={() => setSecurePass(!securePass)}
                    >
                      Показать
                    </Text>
                  </View>
                </View>

                {!isShowKeyboard && (
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={onLogin}
                  >
                    <Text style={styles.buttonText}> Зарегистрироваться</Text>
                  </TouchableOpacity>
                )}
                {!isShowKeyboard && (
                  <TouchableOpacity
                    style={{ alignItems: "center" }}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.accountText}>
                      Уже есть аккаунт?
                      <Text style={styles.accountText}>Войти</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,

    resizeMode: "cover",
  },
  register: {
    position: "absolute",
    top: "30%",

    width: "100%",
    height: "70%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
  input: {
    height: 50,
    width: 343,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    paddingLeft: 16,
    paddingRight: 16,
  },
  button: {
    borderRadius: 100,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    marginBottom: 16,
  },

  form: {},
  buttonText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#FFFFFF",
  },
  accountText: {
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
});
