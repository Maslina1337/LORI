const cursor_pos = {
    x: 0,
    y: 0,
    client_x: 0,
    client_y: 0,
}

const update_knowladge = (event) => {
    cursor_pos.x = event.pageX;
    cursor_pos.y = event.pageY;

    cursor_pos.client_x = event.clientX;
    cursor_pos.client_y = event.clientY;
};

const update_knowladge_scroll = (event) => {
    cursor_pos.x = cursor_pos.client_x + window.scrollX;
    cursor_pos.y = cursor_pos.client_y + window.scrollY;
};

window.addEventListener("mousemove", update_knowladge);
window.addEventListener("scroll", update_knowladge_scroll);

export default cursor_pos;