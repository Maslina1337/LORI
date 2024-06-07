export default function ListElementInconstancy({ is_selected, inner_text, click_fn}) {
    return (
        <div className={`list_element_inconstancy${is_selected ? " selected" : ""}`} onClick={click_fn}>
            <div className="outline"></div>
            { inner_text }
        </div>
    )
}

ListElementInconstancy.defaultProps = {
    is_selected: false,
    inner_text: "",
}