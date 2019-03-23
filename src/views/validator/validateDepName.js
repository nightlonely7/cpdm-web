import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('depNameValidator', {
    getMessage: () => {
        return "Phòng ban này đã tồn tại xin hãy nhập phòng ban khác!";
    },
    validate: (value) => {
        return checkDepNameExisted(value);
    }
});

async function checkDepNameExisted(value) {
    let isDepNameExisted = true;
    try {
        await axios.get('http://localhost:8080/departments/check/existByName/', {
            params: {
                name: value
            }
        })
            .then(
                response => {
                    isDepNameExisted = !response.data;
                })
            .catch(
                () => {
                    console.log("Phòng ban không trùng");
                }
            );
    }catch (err) {
        await console.log(err);
    }
    return isDepNameExisted;
}