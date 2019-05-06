import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('depNameValidator', {
    getMessage: () => {
        return "Phòng ban này đã tồn tại xin hãy nhập phòng ban khác!";
    },
    validate: (value, obj) => {
        return checkDepNameExisted(value, obj);
    }
});

async function checkDepNameExisted(value, obj) {
    let isDepNameExisted = true;
    let currentName = obj[0];
    let isEdit = obj[1];
    if(!isEdit && currentName === value){
        return true;
    }
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
                    console.log("Phòng ban không trùng!");
                }
            );
    } catch (err) {
        console.log(err);
    }
    return isDepNameExisted;
}