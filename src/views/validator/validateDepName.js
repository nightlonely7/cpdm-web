import axios from "axios";
import {Validator} from "vee-validate";
import '@/store/index'

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
                    console.log(this.$store.state.DEPARTMENT_STORE.isEdit);
                })
            .catch(
                () => {
                    console.log(this.$store.state.DEPARTMENT_STORE.isEdit);
                }
            );
    } catch (err) {
        await console.log(err);
    }
    return isDepNameExisted;
}