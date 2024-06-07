import React, { useRef, createRef, useEffect, useState, Children } from "react";
import "./inconstancy_input_form.css";
import InputTextInconstancy from "../small/input_text_inconstancy";
import ReactDOM from "react-dom";

export default function InconstancyInputForm({ required_inputs }) {
    const [input_max_width, set_input_max_width] = useState("auto");
    // let input_max_width = "auto";

    function inputs_trim_by_smallest() {        
        // let input_refs = [];
        // required_inputs.map((element) => {
        //     input_refs.push(element.ref_parcel);
        // });

        // let smallest_width = parseFloat(input_refs[0].current.getBoundingClientRect().width);

        // input_refs.map((ref) => {
        //     let current_width = parseFloat(ref.current.getBoundingClientRect().width);
        //     if (!current_width) {
        //         return;
        //     }
        //     if (smallest_width > current_width) {
        //         smallest_width = current_width;
        //     }
        // });
        // set_input_max_width(smallest_width + "px");
    }

    useEffect(() => {
        // window.addEventListener("resize", inputs_trim_by_smallest);
    }, []);

    useEffect(() => {
        inputs_trim_by_smallest();
    })

    return (
        <>
            <div className="input_form">
                {required_inputs.map((element, index) => {
                    if (element.type === "text") {
                        return (<InputTextInconstancy 
                        key={index}
                        value={element.value}
                        ref_parcel={element.ref_parcel}
                        placeholder={element.placeholder}
                        id={element.id}
                        name={element.name}
                        label={element.label}
                        edit_lock={element.edit_lock}
                        view_ban={element.view_ban}
                        label_color={element.label_color}
                        input_max_width={input_max_width}
                        />)
                    }
                })}
            </div>
        </>
    )
}

InconstancyInputForm.defaultProps = {
    required_inputs: [],
}