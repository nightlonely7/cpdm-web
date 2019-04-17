import axios from "axios";
import {Validator} from "vee-validate";

Validator.extend('projectAliasValidator', {
    getMessage: () => {
        return "Mã phòng ban này đã tồn tại xin hãy nhập mã phòng ban khác!";
    },
    validate: (value, obj) => {
        return checkProjectAliasExisted(value, obj);
    }
});

async function checkProjectAliasExisted(value, obj) {
    let isProjectAliasExisted = true;
    let currentAlias = obj[0];
    let isEdit = obj[1];
    if(isEdit && currentAlias === value){
        return true;
    }
    try {
        await axios.get('http://localhost:8080/projects/check/existByAlias/', {
            params: {
                alias: value
            }
        })
            .then(
                response => {
                    isProjectAliasExisted = !response.data;
                })
            .catch(
                () => {
                    console.log("Phòng ban không trùng!");
                }
            );
    } catch (err) {
        console.log(err);
    }
    return isProjectAliasExisted;
}