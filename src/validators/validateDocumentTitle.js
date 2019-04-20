import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('documentNameValidator', {
    getMessage: () => {
        return "Tên tài liệu này đã tồn tại xin hãy nhập tên tài liệu khác!";
    },
    validate: (value, obj) => {
        return checkDocumentNameExisted(value, obj);
    }
});

async function checkDocumentNameExisted(value, obj) {
    let isDocumentNameExisted = true;
    let currentTitle = obj[0];
    let isEdit = obj[1];
    if(isEdit && currentTitle === value){
        return true;
    }
    try {
        await axios.get('http://localhost:8080/documents/check/existByTitle/', {
            params: {
                title: value
            }
        })
            .then(
                response => {
                    isDocumentNameExisted = !response.data;
                })
            .catch(
                () => {
                    console.log("Tên tài liệu không trùng!");
                }
            );
    } catch (err) {
        console.log(err);
    }
    return isDocumentNameExisted;
}