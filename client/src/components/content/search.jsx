import { useRef } from "react"
import InputTextInconstancy from "../small/input_text_inconstancy"

export default function Search() {
    const search_input_ref = useRef();

    

    return (
        <InputTextInconstancy ref_parcel={search_input_ref} label={<i className="bi bi-search"></i>}/>
        
    )
}