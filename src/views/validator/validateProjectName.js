import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('projectNameValidator', {
    getMessage: () => {
        return "Dự án này đã tồn tại xin hãy nhập dự án khác!";
    },
    validate: (value, obj) => {
        return checkDepNameExisted(value, obj);
    }
});

async function checkDepNameExisted(value, obj) {
    let isProjectNameExisted = true;
    let currentName = obj[0];
    let isEdit = obj[1];
    if(isEdit && currentName === value){
        return true;
    }
    try {
        await axios.get('http://localhost:8080/projects/check/existByName/', {
            params: {
                name: value
            }
        })
            .then(
                response => {
                    isProjectNameExisted = !response.data;
                })
            .catch(
                (err) => {
                    console.log(err);
                }
            );
    } catch (err) {
        await console.log(err);
    }
    return isProjectNameExisted;
}