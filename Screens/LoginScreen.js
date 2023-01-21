import React, { useState, useEffect } from "react";
import {
  StyleSheet,
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

import { useDispatch } from "react-redux";
import { authOnLogin } from "../redux/auth/authOperations";

const initialState = {
  email: "",
  password: "",
};

export const LoginScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [securePass, setSecurePass] = useState(true);

  const dispatch = useDispatch();

  const keyboardHideOutInput = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const onLogin = () => {
    dispatch(authOnLogin(state));
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

  return (
    <TouchableWithoutFeedback onPress={keyboardHideOutInput}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.container}>
          <ImageBackground
            source={require(`../images/PhotoBg.jpg`)}
            style={styles.image}
          >
            <View
              style={{
                ...styles.register,

                top: isShowKeyboard ? "50%" : "40%",
                height: isShowKeyboard ? "50%" : "60%",
              }}
            >
              <Text style={styles.registerTitle}>Войти</Text>

              <View styles={styles.form}>
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
                <View style={{ marginBottom: isShowKeyboard ? 32 : 43 }}>
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
                    <Text style={styles.buttonText}> Войти</Text>
                  </TouchableOpacity>
                )}
                {!isShowKeyboard && (
                  <TouchableOpacity
                    style={{ alignItems: "center" }}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.accountText}>
                      Нет аккаунта?
                      <Text style={styles.accountText}>Зарегистрироваться</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,

    resizeMode: "cover",
  },
  register: {
    position: "absolute",
    top: "40%",
    fex: 1,
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  registerTitle: {
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    fontWeight: "bold",
    marginBottom: 33,
    marginTop: 32,
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

  buttonText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#FFFFFF",
  },
  accountText: {
    color: "#1B4371",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
});
