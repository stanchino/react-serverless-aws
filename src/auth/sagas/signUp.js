import { call, put } from "redux-saga/effects";
import { signUpRequest}  from "../services";
import { signIn, signUp } from "../actions";
import { formError } from "./index";

export function* handleSignUpSaga(action) {
    const { email, password } = action.payload;
    let profile = { email: email };

    try {
        yield call(signUpRequest, { ...profile, password });
        yield put(signUp.success(profile));
    } catch (error) {
        if ("UsernameExistsException" === error.code) {
            yield put(signIn.request({ username: email, password: password }));
        } else if ("UserNotConfirmedException" === error.code) {
            yield put(signUp.success(profile));
        } else {
            yield formError(signUp, {
                _error: error.message
            });
        }
    }
}