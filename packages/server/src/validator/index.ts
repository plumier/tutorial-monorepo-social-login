import { val } from "plumier"

export function checkConfirmPassword() {
    return val.custom(value => {
        if (value.password !== value.confirmPassword)
            return val.result("confirmPassword", "Password doesn't match")
    })
}