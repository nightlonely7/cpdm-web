import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('emailValidator', {
    getMessage: () => {
        return "Email này đã tồn tại xin hãy nhập email khác!";
    },
    validate: (value) => {
        return checkEmailExisted(value);
    }
});

async function checkEmailExisted(value) {
    var isEmailExisted = true;
    try {
        await axios.get('http://localhost:8080/users/check/existByEmail/', {
            params: {
                email: value
            }
        })
            .then(
                response => {
                    isEmailExisted = !response.data;
                })
            .catch(
                () => {
                    console.log("Email không trùng");
                }
            );
    }catch (err) {
        await console.log(err);
    }
    return isEmailExisted;
}