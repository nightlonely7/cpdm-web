import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('emailValidator', {
    getMessage: () => {
        return "Email này đã tồn tại xin hãy nhập email khác!";
    },
    validate: (value, obj) => {
        return checkEmailExisted(value, obj);
    }
});

async function checkEmailExisted(value, obj) {
    let isEmailExisted = true;
    let currentEmail = obj[0];
    let isEdit = obj[1];
    console.log("Current Email: " + currentEmail);
    console.log("Is Edit: " + isEdit);
    if(!isEdit && currentEmail !== '' && currentEmail === value){
        return true;
    }
    try {
        await axios.get('http://localhost:8080/users/check/existByEmail/', {
            params: {
                email: value
            }
        }).then(response => {
            isEmailExisted = !response.data;
        })
            .catch(
                () => {
                    console.log("Email không trùng!");
                }
            )
    } catch (err) {
        await console.log(err);
    }
    return isEmailExisted;
}