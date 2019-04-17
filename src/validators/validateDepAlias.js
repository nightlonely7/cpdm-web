import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('depAliasValidator', {
    getMessage: () => {
        return "Mã phòng ban này đã tồn tại xin hãy nhập mã phòng ban khác!";
    },
    validate: (value, obj) => {
        return checkDepAliasExisted(value, obj);
    }
});

async function checkDepAliasExisted(value, obj) {
    let isDepAliasExisted = true;
    let currentAlias = obj[0];
    let isEdit = obj[1];
    if(isEdit && currentAlias === value){
        return true;
    }
    try {
        await axios.get('http://localhost:8080/departments/check/existByAlias/', {
            params: {
                alias: value
            }
        })
            .then(
                response => {
                    isDepAliasExisted = !response.data;
                })
            .catch(
                () => {
                    console.log("Phòng ban không trùng!");
                }
            );
    } catch (err) {
        console.log(err);
    }
    return isDepAliasExisted;
}