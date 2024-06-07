import ListElementInconstancy from "../small/list_element_inconstancy";

export default function ListInconstancy({ list, selected, set_selected }) {
    return (
        <>
            <div className="list_inconstancy_selected">
                <div className="list">
                    {selected.map((element) => {
                        return <ListElementInconstancy key={element} inner_text={element} is_selected={true}/>
                    })}
                </div>
            </div>

            <div className="list_inconstancy">
                <div className="list"></div>
                    {list.map(element => {
                        return <ListElementInconstancy key={element} inner_text={element} is_selected={false}/>
                    })}
            </div>
        </>
    )
}