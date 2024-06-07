import { public_server_values } from "../data_management/public_server_values";

function nickname_valid_check(nickname: string): { is_valid: boolean, message: string } {
    if (nickname.length < public_server_values.min_user_nickname_length) {
        return { is_valid: false, message: `Никнейм слишком короткий. Мининум ${public_server_values.min_user_nickname_length} символов.`};
    }
    if (nickname.length > public_server_values.max_user_nickname_length) {
        return { is_valid: false, message: `Никнейм слишком длинный. Максимум ${public_server_values.max_user_nickname_length} символов.`};
    }
    return { is_valid: true, message: "Данные прошли тест на валидность."};
}

export { nickname_valid_check };