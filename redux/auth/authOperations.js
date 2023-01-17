import db from "../../firebase/config";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  updateUserId,
  authSetChange,
  authReducerSignOut,
  updateUserAvatar,
} from "./authReducer";
import { async } from "@firebase/util";

const auth = getAuth();

export const authOnRegister =
  ({ password, login, email, avatar }) =>
  async (dispatch) => {
    try {
      console.log("Dispatch register", email, password, login);
      await createUserWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;

      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });
      const newuser = await auth.currentUser;
      console.log("user", user);

      const { uid, displayName } = await auth.currentUser;

      dispatch(
        updateUserId({ userId: uid, nickname: displayName, email, avatar })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const authOnLogin =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      console.log("authOnLogin", email, password);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user", user);
    } catch (error) {
      console.log(error);
    }
  };

export const authSetChangeUser = () => async (dispatch) => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          updateUserId({
            userId: user.uid,
            nickname: user.displayName,
            email: user.email,
            avatar: user.photoURL,
          })
        );
        dispatch(authSetChange({ stateChange: true }));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const authSignOut = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(authReducerSignOut());
  } catch (error) {
    console.log(error);
  }
};

export const deleteAvatar = () => async (dispatch) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: "",
    });
    const { photoURL } = await auth.currentUser;
    console.log(photoURL);
    dispatch(updateUserAvatar());
  } catch (error) {
    console.log(error);
  }
};
